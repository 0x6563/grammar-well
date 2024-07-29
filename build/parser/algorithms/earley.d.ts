import { Dictionary, RuntimeGrammarProductionRule, RuntimeParserClass } from "../../typings/index.js";
import { TokenBuffer } from "../../lexers/token-buffer.js";
export interface EarleyParserOptions {
    keepHistory?: boolean;
}
export declare function Earley(language: RuntimeParserClass & {
    tokens: TokenBuffer;
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
    constructor(rules: Dictionary<RuntimeGrammarProductionRule[]>, index: number);
    process(): void;
    predict(exp: string): void;
    expects(): RuntimeGrammarProductionRule[];
    private complete;
}
declare class State {
    rule: RuntimeGrammarProductionRule;
    dot: number;
    reference: number;
    wantedBy: State[];
    isComplete: boolean;
    data: any;
    left: State;
    right: State | StateToken;
    constructor(rule: RuntimeGrammarProductionRule, dot: number, reference: number, wantedBy: State[]);
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
