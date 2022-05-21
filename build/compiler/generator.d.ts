import { Dictionary, GrammarBuilderRule, RuleDefinition, RuleDefinitionList } from "../typings";
import { CompilerState } from "./compiler";
export interface GeneratorState {
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
export interface SerializedGeneratorState extends Omit<GeneratorState, 'customTokens'> {
    customTokens: string[];
}
export declare class Generator {
    private config;
    private compilerState;
    private names;
    private neParser;
    private gwParser;
    private state;
    constructor(config: {
        noscript?: boolean;
        version?: string;
    }, compilerState: CompilerState);
    import(source: string, language: 'nearley' | 'grammar-well'): Promise<void>;
    import(rule: RuleDefinition): Promise<void>;
    import(rules: RuleDefinitionList): Promise<void>;
    import(rules: string | RuleDefinition | RuleDefinitionList, language?: 'nearley' | 'grammar-well'): Promise<void>;
    export(): GeneratorState;
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
