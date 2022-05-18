import { Dictionary, GrammarBuilderRule, RuleDefinition, RuleDefinitionList } from "../typings";
import { CompilerState } from "./compiler";
export interface GrammarBuilderState {
    rules: GrammarBuilderRule[];
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
export interface SerializedGrammarBuilderState extends Omit<GrammarBuilderState, 'customTokens'> {
    customTokens: string[];
}
export declare class GrammarBuilder {
    private config;
    private compilerState;
    private names;
    private neInterpreter;
    private grmrInterpreter;
    private state;
    constructor(config: {
        noscript?: boolean;
        version?: string;
    }, compilerState: CompilerState);
    import(source: string, language: 'nearley' | 'grammar-well'): Promise<void>;
    import(rule: RuleDefinition): Promise<void>;
    import(rules: RuleDefinitionList): Promise<void>;
    import(rules: string | RuleDefinition | RuleDefinitionList, language?: 'nearley' | 'grammar-well'): Promise<void>;
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
