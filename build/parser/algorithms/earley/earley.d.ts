import { Dictionary, ParserAlgorithm, GrammarRule, LanguageDefinition } from "../../../typings";
import { TokenQueue } from "../../../lexers/token-queue";
export interface ParserOptions {
    keepHistory?: boolean;
}
export declare class EarleyParser implements ParserAlgorithm {
    static reject: symbol;
    private keepHistory;
    private start;
    private errorService;
    private rules;
    current: number;
    tokenQueue: TokenQueue;
    table: Column[];
    results: any;
    constructor({ grammar, tokenQueue }: LanguageDefinition & {
        tokenQueue: TokenQueue;
    }, options?: ParserOptions);
    feed(input: string): any;
}
declare class Column {
    private ruleMap;
    index: number;
    data: any;
    states: State[];
    wants: Dictionary<State[]>;
    scannable: State[];
    completed: Dictionary<State[]>;
    constructor(ruleMap: Dictionary<GrammarRule[]>, index: number);
    process(): void;
    predict(exp: string): void;
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
