import { RuleDefinition, RuleDefinitionList } from "../typings";
import { CompilerState } from "./compile";
export interface GrammarBuilderState {
    rules: any[];
    body: any[];
    customTokens: any[];
    config: any;
    macros: {};
    start: string;
    version: string;
}
export declare class GrammarBuilder {
    private config;
    private compilerState;
    private names;
    private interpreter;
    private state;
    constructor(config: {
        noscript?: boolean;
        version?: string;
    }, compilerState: CompilerState);
    import(rules: string | RuleDefinition | RuleDefinitionList): void;
    export(): GrammarBuilderState;
    private subGrammar;
    private merge;
    private uuid;
    private buildRules;
    private buildRule;
    private buildToken;
    private buildStringToken;
    private buildSubExpressionToken;
    private buildEBNFToken;
    private buildMacroCallToken;
}
