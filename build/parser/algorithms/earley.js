"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Earley = void 0;
const text_format_1 = require("../../utility/text-format");
const parser_1 = require("../parser");
function Earley(language, options = {}) {
    const { tokens } = language;
    const { rules, start } = language.grammar;
    const column = new Column(rules, 0);
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
        const nextColumn = new Column(rules, current);
        table.push(nextColumn);
        const literal = token.value;
        const data = token;
        nextColumn.data = literal;
        const { scannable } = previousColumn;
        let w = scannable.length;
        while (w--) {
            const state = scannable[w];
            const symbol = state.rule.symbols[state.dot];
            if (parser_1.ParserUtility.SymbolMatchesToken(symbol, token)) {
                const next = state.nextState({ data, token, isToken: true, reference: current - 1 });
                nextColumn.states.push(next);
            }
        }
        nextColumn.process();
        if (nextColumn.states.length === 0) {
            throw text_format_1.TextFormatter.UnexpectedToken(tokens, previousColumn.expects());
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
exports.Earley = Earley;
class Column {
    constructor(rules, index) {
        this.rules = rules;
        this.index = index;
        this.states = [];
        this.wants = Object.create(null);
        this.scannable = [];
        this.completed = Object.create(null);
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
            this.states.push(new State(rule, 0, this.index, this.wants[exp]));
        }
    }
    expects() {
        const result = [];
        for (const state of this.states) {
            if (state.rule.symbols[state.dot] && typeof state.rule.symbols[state.dot] !== 'string') {
                result.push(Object.assign(Object.assign({}, state.rule), { index: state.dot }));
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
    constructor(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.wantedBy = wantedBy;
        this.data = [];
        this.isComplete = this.dot === rule.symbols.length;
    }
    nextState(child) {
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
        this.data = parser_1.ParserUtility.PostProcess(this.rule, this.data, { reference: this.reference, dot: this.dot });
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
//# sourceMappingURL=earley.js.map