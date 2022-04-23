import { Rule } from "./rule";
export declare class State {
    rule: Rule;
    dot: number;
    reference: any;
    wantedBy: any;
    isComplete: boolean;
    data: any;
    left: State;
    right: StateToken;
    constructor(rule: Rule, dot: number, reference: any, wantedBy: any);
    toString(): string;
    nextState(child: StateToken): State;
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
