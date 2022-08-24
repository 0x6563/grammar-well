"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const parser_1 = require("./parser");
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
    build() {
        const children = [];
        let node = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    }
    finish() {
        if (this.rule.transform) {
            this.data = this.rule.transform({
                data: this.data,
                reference: this.reference,
                dot: this.dot,
                name: this.rule.name,
                reject: parser_1.NearleyParser.fail
            });
        }
    }
}
exports.State = State;
//# sourceMappingURL=state.js.map