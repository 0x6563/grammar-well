import { Dictionary, Rule, RuleDefinition, RuleDefinitionList } from "../typings";
import { CompilerState } from "./compile";
export interface GrammarBuilderState {
    rules: Rule[];
    body: string[];
    customTokens: Set<string>;
    config: Dictionary<string>;
    macros: Dictionary<{
        args: any;
        exprs: any;
    }>;
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
    private includeBuiltIn;
    private includeGrammar;
    private mergeGrammarString;
    private merge;
    private uuid;
    private buildRules;
    private buildRule;
    private buildSymbol;
    private buildStringToken;
    private buildSubExpressionToken;
    private buildEBNFToken;
    private buildMacroCallToken;
}
