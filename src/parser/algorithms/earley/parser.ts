import { Column } from "./column";
import { Dictionary, Lexer, LexerState, ParserAlgorithm, PrecompiledGrammar, Rule } from "../../../typings";
import { ParserErrorService } from "./error-reporting";
import { TokenQueue } from "../../../lexers/token-queue";
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
    lexer: TokenQueue;
    lexerState: LexerState;
    table: Column[];
    results: any;
    errorService: ParserErrorService;
    ruleMap: Dictionary<Rule[]> = Object.create(null);

    constructor({ rules, start, lexer, map }: PrecompiledGrammar, options: ParserOptions = {}) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
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
        this.lexer = new TokenQueue(options?.lexer || lexer || new BasicLexer());
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
        let column;
        let token = this.next();

        while (token != undefined) {
            column = this.table[this.current];

            if (!this.keepHistory) {
                delete this.table[this.current - 1];
            }

            this.current++;

            const nextColumn = new Column(this.ruleMap, this.current);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            const literal = token.value;
            const data = token.value;
            nextColumn.data = literal;
            const { scannable } = column;
            for (let w = scannable.length; w--;) {
                const state = scannable[w];
                const expect: any = state.rule.symbols[state.dot];
                if ((expect.test && expect.test(data)) || (expect.type && expect.type === token.type) || expect?.literal === literal) {
                    const next = state.nextState({ data, token, isToken: true, reference: this.current - 1 });
                    nextColumn.states.push(next);
                }
            }

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                throw this.errorService.tokenError(token);
            }

            if (this.keepHistory) {
                column.lexerState = this.lexer.state;
            }
            token = this.next();
            console.log(token);
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
        console.log('restore', column)
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
