import { Rule } from "../../../typings";
import { EarleyParser } from "./parser";


export class State {
    isComplete: boolean;
    data: any = [];
    left: State;
    right: State | StateToken;
    // a State is a rule at a position from a given starting point in the input stream (reference)
    constructor(
        public rule: Rule,
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
        if (this.rule.transform) {
            this.data = this.rule.transform({
                data: this.data,
                reference: this.reference,
                dot: this.dot,
                name: this.rule.name,
                reject: EarleyParser.fail
            });
        } else if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, EarleyParser.fail);
        }
    }
}

interface StateToken {
    data: any,
    token: any,
    isToken: boolean,
    reference: number
}