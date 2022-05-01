import { Rule } from "../../typings";
export declare class State {
    rule: Rule;
    dot: number;
    reference: number;
    wantedBy: State[];
    isComplete: boolean;
    data: any;
    left: State;
    right: State | StateToken;
    constructor(rule: Rule, dot: number, reference: number, wantedBy: State[]);
    nextState(child: State | StateToken): State;
    build(): any[];
    finish(): void;
}
interface StateToken {
    data: any;
    token: any;
    isToken: boolean;
    reference: number;
}
export {};
