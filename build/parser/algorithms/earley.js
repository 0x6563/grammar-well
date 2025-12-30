import { TextFormatter } from "../../utility/text-format.js";
import { ParserUtility } from "../../utility/parsing.js";
export function Earley(language, options = {}) {
    const { tokens } = language;
    const { rules, start } = language.artifacts.grammar;
    const StateClass = options.postProcessing === 'eager' ? EagerState : LazyState;
    const column = new Column(rules, 0, StateClass);
    const table = [column];
    column.wants[start] = [];
    column.predict(start);
    column.process();
    let current = 0;
    for (const token of tokens) {
        const previousColumn = table[current];
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
function PostProcess(ast, clone) {
    if (!Array.isArray(ast))
        return clone ? { ...ast } : ast;
    const data = [];
    for (let i = 0; i < ast[1].length; i++) {
        data[i] = PostProcess(ast[1][i], clone);
    }
    return ParserUtility.PostProcess(ast[0], data, ast[2]);
}
class Column {
    data;
    states = [];
    wants = Object.create(null);
    scannable = [];
    completed = Object.create(null);
    rules;
    index;
    StateClass;
    constructor(rules, index, StateClass) {
        this.rules = rules;
        this.index = index;
        this.StateClass = StateClass;
    }
    process() {
        let w = 0;
        let state;
        while (state = this.states[w++]) {
            if (state.isComplete) {
                state.finish();
                const { wantedBy } = state;
                for (let i = wantedBy.length; i--;) {
                    this.complete(wantedBy[i], state);
                }
                if (state.reference === this.index) {
                    const { name } = state.rule;
                    this.completed[name] = this.completed[name] || [];
                    this.completed[name].push(state);
                }
            }
            else {
                const exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }
                if (this.wants[exp]) {
                    this.wants[exp].push(state);
                    if (this.completed[exp]) {
                        for (const right of this.completed[exp]) {
                            this.complete(state, right);
                        }
                    }
                }
                else {
                    this.wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }
    predict(exp) {
        if (!this.rules[exp])
            return;
        for (const rule of this.rules[exp]) {
            this.states.push(new this.StateClass(rule, 0, this.index, this.wants[exp]));
        }
    }
    expects() {
        const result = [];
        for (const state of this.states) {
            if (state.rule.symbols[state.dot] && typeof state.rule.symbols[state.dot] !== 'string') {
                result.push({ ...state.rule, index: state.dot });
            }
        }
        return result;
    }
    complete(left, right) {
        const copy = left.nextState(right);
        this.states.push(copy);
    }
}
class State {
    isComplete;
    data = [];
    left;
    right;
    rule;
    dot;
    reference;
    wantedBy;
    constructor(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
    }
    nextState(child) {
        const state = new this.constructor(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
            state.right = undefined;
        }
        return state;
    }
    build() {
        const children = [];
        let node = this;
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
//# sourceMappingURL=earley.js.map