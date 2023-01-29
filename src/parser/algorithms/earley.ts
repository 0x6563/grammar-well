import { Dictionary, GrammarRule, LanguageDefinition } from "../../typings";
import { TokenBuffer } from "../../lexers/token-buffer";
import { TextFormatter } from "../../utility/text-format";
import { ParserUtility } from "../parser";

export interface EarleyParserOptions {
    keepHistory?: boolean;
}

export function Earley(language: LanguageDefinition & { tokens: TokenBuffer }, options: EarleyParserOptions = {}) {
    const { tokens } = language;
    const { rules, start } = language.grammar;
    const column = new Column(rules, 0);
    const table: Column[] = [column];
    column.wants[start] = [];
    column.predict(start);
    column.process();

    let current: number = 0;

    for (const token of tokens) {
        const previousColumn: Column = table[current];

        if (!(options.keepHistory)) {
            delete table[current - 1];
        }

        current++;

        const nextColumn = new Column(rules, current);
        table.push(nextColumn);

        const literal = token.value;
        const data = token;
        nextColumn.data = literal;
        const { scannable } = previousColumn;
        for (let w = scannable.length; w--;) {
            const state = scannable[w];
            const symbol = state.rule.symbols[state.dot];
            if (ParserUtility.TokenMatchesSymbol(token, symbol)) {
                const next = state.nextState({ data, token, isToken: true, reference: current - 1 });
                nextColumn.states.push(next);
            }
        }

        nextColumn.process();

        if (nextColumn.states.length === 0) {
            throw TextFormatter.UnexpectedToken(tokens, previousColumn.expects());
        }
    }

    const results = [];
    const { states } = table[table.length - 1];
    for (const { rule: { name, symbols }, dot, reference, data } of states) {
        if (name === start && dot === symbols.length && reference == 0) {
            results.push(data);
        }
    }
    return { results, info: { table } };
}


class Column {
    data: any;
    states: State[] = [];
    wants: Dictionary<State[]> = Object.create(null);// states indexed by the non-terminal they expect
    scannable: State[] = [];// list of states that expect a token
    completed: Dictionary<State[]> = Object.create(null);  // states that are nullable

    constructor(
        private rules: Dictionary<GrammarRule[]>,
        public index: number
    ) { }


    process() {
        let w = 0;
        let state: State;

        // eslint-disable-next-line no-cond-assign
        while (state = this.states[w++]) { // nb. we push() during iteration
            if (state.isComplete) {
                state.finish();
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
        if (!this.rules[exp])
            return;

        for (const rule of this.rules[exp]) {
            this.states.push(new State(rule, 0, this.index, this.wants[exp]));
        }
    }

    expects(): GrammarRule[] {
        return this.states
            .filter((state) => {
                const nextSymbol = state.rule.symbols[state.dot];
                return nextSymbol && typeof nextSymbol !== "string";
            })
            .map(v => ({ ...v.rule, index: v.dot }));
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
            state.right = undefined;
        }
        return state;
    }


    finish() {
        this.data = ParserUtility.PostProcess(this.rule, this.data, { reference: this.reference, dot: this.dot });
    }

    protected build() {
        const children = [];
        // eslint-disable-next-line @typescript-eslint/no-this-alias
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