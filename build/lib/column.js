"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
const parser_1 = require("./parser");
const state_1 = require("./state");
class Column {
    constructor(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = Object.create(null);
        this.scannable = [];
        this.completed = Object.create(null);
    }
    process(nextColumn) {
        let w = 0;
        let state;
        while (state = this.states[w++]) {
            if (state.isComplete) {
                state.finish();
                if (state.data !== parser_1.Parser.fail) {
                    const { wantedBy } = state;
                    for (var i = wantedBy.length; i--;) {
                        this.complete(wantedBy[i], state);
                    }
                    if (state.reference === this.index) {
                        const { name } = state.rule;
                        this.completed[name] = this.completed[name] || [];
                        this.completed[name].push(state);
                    }
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
        if (!this.grammar.byName[exp])
            return;
        for (const rule of this.grammar.byName[exp]) {
            this.states.push(new state_1.State(rule, 0, this.index, this.wants[exp]));
        }
    }
    complete(left, right) {
        const copy = left.nextState(right);
        this.states.push(copy);
    }
}
exports.Column = Column;
//# sourceMappingURL=column.js.map