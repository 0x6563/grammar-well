import { Column } from "./column";
import { Dictionary, Lexer, LexerState, ParserAlgorithm, PrecompiledGrammar, Rule } from "../../../typings";
import { ParserErrorService } from "./error-reporting";
import { LegacyLexerAdapter } from "../../../lexers/legacy-adapter";
import { BasicLexer } from "../../../lexers/basic-lexer";

export interface ParserOptions {
    keepHistory?: boolean;
    lexer?: Lexer;
}


export class EarleyParser implements ParserAlgorithm {
    static fail = Symbol();
    keepHistory: boolean = false;
    current: number = 0;

    rules: Rule[];
    start: string;
    lexer: Lexer;
    lexerState: LexerState;
    table: Column[];
    results: any;
    errorService: ParserErrorService;
    ruleMap: Dictionary<Rule[]> = Object.create(null);

    constructor({ rules, start, lexer, map }: PrecompiledGrammar, options: ParserOptions = {}) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        this.lexer = lexer;
        if (!map) {
            for (const rule of rules) {
                if (!this.ruleMap[rule.name])
                    this.ruleMap[rule.name] = [rule];
                else
                    this.ruleMap[rule.name].push(rule);
            }
        }
        this.keepHistory = !!(options?.keepHistory);
        this.errorService = new ParserErrorService(this);
        this.lexer = options?.lexer || this.lexer || new BasicLexer();
        if (!this.lexer.restore)
            this.lexer = new LegacyLexerAdapter(this.lexer as any);
        const column = new Column(this.ruleMap, 0);
        this.table = [column];

        column.wants[this.start] = [];
        column.predict(this.start);
        column.process();
    }

    next() {
        try {
            return this.lexer.next();
        } catch (e) {
            const nextColumn = new Column(this.ruleMap, this.current + 1);
            this.table.push(nextColumn);
            throw this.errorService.lexerError(e);
        }
    }

    feed(chunk: string) {
        this.lexer.feed(chunk);
        let token, column;

        while (token = this.next()) {
            column = this.table[this.current];

            if (!this.keepHistory) {
                delete this.table[this.current - 1];
            }

            const n = this.current + 1;
            const nextColumn = new Column(this.ruleMap, n);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            const literal = token.text !== undefined ? token.text : token.value;
            const data = this.lexer.constructor === BasicLexer ? token.value : token;
            const { scannable } = column;
            for (let w = scannable.length; w--;) {
                const state = scannable[w];
                const expect: any = state.rule.symbols[state.dot];
                if ((expect.test && expect.test(data)) || (expect.type && expect.type === token.type) || expect?.literal === literal) {
                    const next = state.nextState({ data, token, isToken: true, reference: n - 1 });
                    nextColumn.states.push(next);
                }
            }

            // Next, for each of the rules, we either
            // (a) complete it, and try to see if the reference row expected that
            //     rule
            // (b) predict the next nonterminal it expects by adding that
            //     nonterminal's start state
            // To prevent duplication, we also keep track of rules we have already
            // added

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                throw this.errorService.tokenError(token);
            }

            if (this.keepHistory) {
                column.lexerState = this.lexer.state;
            }

            this.current++;
        }

        if (column) {
            this.lexerState = this.lexer.state;
        }

        // Incrementally keep track of results
        this.results = this.finish();
    }

    save() {
        const column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    }

    restore(column: Column) {
        const index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;

        this.lexer.restore(column.lexerState);
        // Incrementally keep track of results
        this.results = this.finish();
    }

    rewind(index: number) {
        if (!this.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding')
        }
        // nb. recall column (table) indicies fall between token indicies.
        //        col 0   --   token 0   --   col 1
        this.restore(this.table[index]);
    }

    finish() {
        const considerations = [];
        const { states } = this.table[this.table.length - 1];
        for (const { rule: { name, symbols }, dot, reference, data } of states) {
            if (name === this.start && dot === symbols.length && !reference && data !== EarleyParser.fail) {
                considerations.push(data);
            }
        }
        return considerations;
    }
}
