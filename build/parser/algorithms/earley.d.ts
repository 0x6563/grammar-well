import { Dictionary, GrammarRule, LanguageDefinition } from "../../typings";
import { TokenQueue } from "../../lexers/token-queue";
export interface EarleyParserOptions {
    keepHistory?: boolean;
}
export declare function Earley(language: LanguageDefinition & {
    tokens: TokenQueue;
}, options?: EarleyParserOptions): {
    results: any[];
    info: {
        table: Column[];
    };
};
declare class Column {
    private rules;
    index: number;
    data: any;
    states: State[];
    wants: Dictionary<State[]>;
    scannable: State[];
    completed: Dictionary<State[]>;
    constructor(rules: Dictionary<GrammarRule[]>, index: number);
    process(): void;
    predict(exp: string): void;
    expects(): GrammarRule[];
    private complete;
}
declare class State {
    rule: GrammarRule;
    dot: number;
    reference: number;
    wantedBy: State[];
    isComplete: boolean;
    data: any;
    left: State;
    right: State | StateToken;
    constructor(rule: GrammarRule, dot: number, reference: number, wantedBy: State[]);
    nextState(child: State | StateToken): State;
    finish(): void;
    protected build(): any[];
}
interface StateToken {
    data: any;
    token: any;
    isToken: boolean;
    reference: number;
}
export {};
