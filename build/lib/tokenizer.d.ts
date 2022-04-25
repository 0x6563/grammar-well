import { Expression } from "../typings";
export interface TokenizerState {
    rules: any[];
    body: any[];
    customTokens: any[];
    config: any;
    macros: {};
    start: string;
    version: string;
}
export declare class Tokenizer {
    private config;
    private names;
    state: TokenizerState;
    constructor(config: {
        noscript?: boolean;
        version?: string;
    });
    merge(state: TokenizerState): void;
    feed(name: string, rules: Expression[]): void;
    private uuid;
    private buildRules;
    private buildRule;
    private buildToken;
    private buildStringToken;
    private buildSubExpressionToken;
    private buildEBNFToken;
    private buildMacroCallToken;
}
