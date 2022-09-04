import { Dictionary, ParserAlgorithm, GrammarRule, LanguageDefinition } from "../../../typings";
import { ParserErrorService } from "./error-reporting";
import { TokenQueue } from "../../../lexers/token-queue";

export interface ParserOptions {
    keepHistory?: boolean;
}

export class EarleyParser implements ParserAlgorithm {
    static reject = Symbol();
    private keepHistory: boolean = false;
    private start: string;
    private errorService: ParserErrorService;
    private rules: Dictionary<GrammarRule[]> = Object.create(null);

    current: number = 0;
    tokenQueue: TokenQueue;
    table: Column[];
    results: any;
    constructor({ grammar, tokenQueue }: LanguageDefinition & { tokenQueue: TokenQueue }, options: ParserOptions = {}) {
        const { rules, start } = grammar;
        this.start = start;
        for (const rule of rules) {
            if (!this.rules[rule.name])
                this.rules[rule.name] = [rule];
            else
                this.rules[rule.name].push(rule);
        }
        this.tokenQueue = tokenQueue;
        this.keepHistory = !!(options?.keepHistory);
        this.errorService = new ParserErrorService(this);

    }


    feed(input: string) {
        const column = new Column(this.rules, 0);
        this.table = [column];
        column.wants[this.start] = [];
        column.predict(this.start);
        column.process();

        this.tokenQueue.feed(input);
        let token = this.tokenQueue.next();
        while (token != undefined) {
            const previousColumn: Column = this.table[this.current];

            if (!this.keepHistory) {
                delete this.table[this.current - 1];
            }

            this.current++;

            const nextColumn = new Column(this.rules, this.current);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            const literal = token.value;
            const data = token;
            nextColumn.data = literal;
            const { scannable } = previousColumn;
            for (let w = scannable.length; w--;) {
                const state = scannable[w];
                const expect: any = state.rule.symbols[state.dot];
                if ((expect.test && expect.test(literal)) || (expect.type && expect.type === token.type) || expect?.literal === literal) {
                    const next = state.nextState({ data, token, isToken: true, reference: this.current - 1 });
                    nextColumn.states.push(next);
                }
            }

            nextColumn.process();

            if (nextColumn.states.length === 0) { // Unexepected token
                throw this.errorService.tokenError(token);
            }

            token = this.tokenQueue.next();
        }

        // Incrementally keep track of results

        this.results = [];
        const { states } = this.table[this.table.length - 1];
        for (const { rule: { name, symbols }, dot, reference, data } of states) {
            if (name === this.start && dot === symbols.length && !reference && data !== EarleyParser.reject) {
                this.results.push(data);
            }
        }
        return this.results;
    }
}


class Column {
    data: any;
    states: State[] = [];
    wants: Dictionary<State[]> = Object.create(null);// states indexed by the non-terminal they expect
    scannable: State[] = [];// list of states that expect a token
    completed: Dictionary<State[]> = Object.create(null);  // states that are nullable

    constructor(
        private ruleMap: Dictionary<GrammarRule[]>,
        public index: number
    ) { }


    process() {
        let w = 0;
        let state: State;
        while (state = this.states[w++]) { // nb. we push() during iteration
            if (state.isComplete) {
                state.finish();
                if (state.data !== EarleyParser.reject) {
                    const { wantedBy } = state;
                    for (let i = wantedBy.length; i--;) { // this line is hot
                        this.complete(wantedBy[i], state);
                    }

                    // special-case nullables
                    if (state.reference === this.index) {
                        const { name } = state.rule;
                        this.completed[name] = this.completed[name] || [];
                        this.completed[name].push(state);
                    }
                }
            } else {
                const exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }

                // predict
                if (this.wants[exp]) {
                    this.wants[exp].push(state);

                    if (this.completed[exp]) {
                        for (const right of this.completed[exp]) {
                            this.complete(state, right);
                        }
                    }
                } else {
                    this.wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }

    predict(exp: string) {
        if (!this.ruleMap[exp])
            return;

        for (const rule of this.ruleMap[exp]) {
            this.states.push(new State(rule, 0, this.index, this.wants[exp]));
        }
    }

    private complete(left: State, right: State) {
        const copy = left.nextState(right);
        this.states.push(copy);
    }
}

class State {
    isComplete: boolean;
    data: any = [];
    left: State;
    right: State | StateToken;
    // a State is a rule at a position from a given starting point in the input stream (reference)
    constructor(
        public rule: GrammarRule,
        public dot: number,
        public reference: number,
        public wantedBy: State[]
    ) {
        this.isComplete = this.dot === rule.symbols.length;
    }

    nextState(child: State | StateToken) {
        const state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
            // Having right set here will prevent the right state and its children
            // form being garbage collected
            state.right = undefined;
        }
        return state;
    }


    finish() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess({
                rule: this.rule,
                data: this.data,
                reference: this.reference,
                dot: this.dot,
                reject: EarleyParser.reject
            });
        }
    }

    protected build() {
        const children = [];
        let node: State = this;
        do {
            children[node.dot - 1] = node.right.data;
            node = node.left;
        } while (node.left);
        return children;
    }
}

interface StateToken {
    data: any,
    token: any,
    isToken: boolean,
    reference: number
}