import { Parser } from "./parser";
import { Rule } from "./rule";


export class State {
    isComplete: boolean;
    data: any = [];
    left: State;
    right: StateToken;
    // a State is a rule at a position from a given starting point in the input stream (reference)
    constructor(
        public rule: Rule,
        public dot: number,
        public reference,
        public wantedBy
    ) {
        this.isComplete = this.dot === rule.symbols.length;
    }

    toString() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    }

    nextState(child: StateToken) {
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

    build() {
        const children = [];
        let node: State = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    }

    finish() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
    }

}
interface StateToken {
    data: any,
    token: any,
    isToken: boolean,
    reference: number
}