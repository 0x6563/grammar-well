import type { Dictionary, RuntimeGrammarProductionRule, RuntimeLexerToken, RuntimeParserClass } from "../../typings/index.ts";
import { TokenBuffer } from "../../lexers/token-buffer.ts";
import { TextFormatter } from "../../utility/text-format.ts";
import { ParserUtility } from "../../utility/parsing.ts";

export interface EarleyParserOptions {
    keepHistory?: boolean;
    postProcessing?: 'eager' | 'lazy';
}

export function Earley(language: RuntimeParserClass & { tokens: TokenBuffer }, options: EarleyParserOptions = {}) {
    const { tokens } = language;
    const { rules, start } = language.artifacts.grammar;
    const StateClass = options.postProcessing === 'eager' ? EagerState : LazyState;
    const column = new Column(rules, 0, StateClass);
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

        const nextColumn = new Column(rules, current, StateClass);
        table.push(nextColumn);

        const literal = token.value;
        const data = token;
        nextColumn.data = literal;
        const { scannable } = previousColumn;
        let w = scannable.length;
        while (w--) {
            const state = scannable[w];
            const symbol = state.rule.symbols[state.dot];
            if (ParserUtility.SymbolMatchesToken(symbol, token)) {
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

    if (StateClass == LazyState) {
        const clone = results.length > 1;
        for (let i = 0; i < results.length; i++) {
            results[i] = PostProcess(results[i], clone);
        }
    }
    return { results, info: { table } };
}

function PostProcess(ast: PreAST | RuntimeLexerToken, clone?: boolean) {
    if (!Array.isArray(ast))
        return clone ? { ...ast } : ast;
    const data = [];
    for (let i = 0; i < ast[1].length; i++) {
        data[i] = PostProcess(ast[1][i], clone);
    }
    return ParserUtility.PostProcess(ast[0], data, ast[2]);
}

class Column {
    data: any;
    states: State[] = [];
    wants: Dictionary<State[]> = Object.create(null);// states indexed by the non-terminal they expect
    scannable: State[] = [];// list of states that expect a token
    completed: Dictionary<State[]> = Object.create(null);  // states that are nullable
    private rules: Dictionary<RuntimeGrammarProductionRule[]>;
    public index: number;
    private StateClass: Concrete<typeof State>;

    constructor(
        rules: Dictionary<RuntimeGrammarProductionRule[]>,
        index: number,
        StateClass: Concrete<typeof State>
    ) {
        this.rules = rules;
        this.index = index;
        this.StateClass = StateClass;
    }


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
            this.states.push(new this.StateClass(rule, 0, this.index, this.wants[exp]));
        }
    }

    expects(): RuntimeGrammarProductionRule[] {
        const result: RuntimeGrammarProductionRule[] = [];
        for (const state of this.states) {
            if (state.rule.symbols[state.dot] && typeof state.rule.symbols[state.dot] !== 'string') {
                result.push({ ...state.rule, index: state.dot } as any)
            }
        }
        return result;
    }

    private complete(left: State, right: State) {
        const copy = left.nextState(right);
        this.states.push(copy);
    }
}

abstract class State {
    isComplete: boolean;
    data: any = [];
    left: State;
    right: State | StateToken;
    public rule: RuntimeGrammarProductionRule;
    public dot: number;
    public reference: number;
    public wantedBy: State[];
    constructor(
        rule: RuntimeGrammarProductionRule,
        dot: number,
        reference: number,
        wantedBy: State[]
    ) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
    }

    nextState(child: State | StateToken) {
        const state = new (this.constructor as any)(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
            state.right = undefined;
        }
        return state;
    }


    abstract finish(): void;

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

class EagerState extends State {
    finish() {
        this.data = ParserUtility.PostProcess(this.rule, this.data, { reference: this.reference, dot: this.dot });
    }
}

class LazyState extends State {
    finish() {
        this.data = [this.rule, this.data, { reference: this.reference, dot: this.dot }];
    }
}

interface StateToken {
    data: any,
    token: any,
    isToken: boolean,
    reference: number
}

type PreAST = [RuntimeGrammarProductionRule, (RuntimeLexerToken | PreAST)[], { reference: number, dot: number }];
type Concrete<T extends abstract new (...args: any) => any> =
    new (...args: ConstructorParameters<T>) => InstanceType<T>;