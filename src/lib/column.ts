import { Grammar } from "./grammar";
import { Parser } from "./parser";
import { State } from "./state";
import { Dictionary, LexerState } from "../typings";


export class Column {
    lexerState: LexerState;
    states: State[] = [];
    wants: Dictionary<State[]> = {};// states indexed by the non-terminal they expect
    scannable: State[] = [];// list of states that expect a token
    completed: Dictionary<State[]> = {};  // states that are nullable

    constructor(
        private grammar: Grammar,
        private index: number
    ) { }


    process(nextColumn?) {
        let exp: string | RegExp;

        for (var w = 0; w < this.states.length; w++) { // nb. we push() during iteration
            var state = this.states[w];

            if (state.isComplete) {
                state.finish();
                if (state.data !== Parser.fail) {
                    // complete
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--;) { // this line is hot
                        var left = wantedBy[i];
                        this.complete(left, state);
                    }

                    // special-case nullables
                    if (state.reference === this.index) {
                        // make sure future predictors of this rule get completed.
                        exp = state.rule.name;
                        (this.completed[exp] = this.completed[exp] || []).push(state);
                    }
                }

            } else {
                // queue scannable states
                exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }

                // predict
                if (this.wants[exp]) {
                    this.wants[exp].push(state);

                    if (this.completed.hasOwnProperty(exp)) {
                        var nulls = this.completed[exp];
                        for (let i = 0; i < nulls.length; i++) {
                            var right = nulls[i];
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
        const rules = this.grammar.byName[exp] || [];

        for (let i = 0; i < rules.length; i++) {
            const r = rules[i];
            const wantedBy = this.wants[exp];
            const s = new State(r, 0, this.index, wantedBy);
            this.states.push(s);
        }
    }

    complete(left: State, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
    }
}