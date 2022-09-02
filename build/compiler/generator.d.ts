import { CompilerState, GeneratorState, LanguageDirective } from "../typings";
export declare class Generator {
    private config;
    private compilerState;
    private names;
    private parser;
    private state;
    constructor(config: {
        noscript?: boolean;
        version?: string;
    }, compilerState: CompilerState);
    import(source: string): Promise<void>;
    import(directive: LanguageDirective): Promise<void>;
    import(directives: LanguageDirective): Promise<void>;
    export(): GeneratorState;
    private processImportDirective;
    private processConfigDirective;
    private processGrammarDirective;
    private processLexerDirective;
    private importBuiltIn;
    private importGrammar;
    private mergeLanguageDefinitionString;
    private merge;
    private uuid;
    private buildRules;
    private buildRule;
    private buildSymbol;
    private buildStringToken;
    private buildSubExpressionToken;
    private buildEBNFToken;
}
