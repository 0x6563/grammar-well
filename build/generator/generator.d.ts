import { ASTDirectives, GeneratorContext, GeneratorOptions, GeneratorExportOptions, GenerateOptions } from "../typings/index.js";
import { GeneratorState } from "./state.js";
export declare function Generate(source: string, config?: GenerateOptions): Promise<ReturnType<Generator['format']>>;
export declare function Generate(directive: ASTDirectives, config?: GenerateOptions): Promise<ReturnType<Generator['format']>>;
export declare function Generate(directives: ASTDirectives[], config?: GenerateOptions): Promise<ReturnType<Generator['format']>>;
export declare class Generator {
    private config;
    private context;
    private aliasPrefix;
    private state;
    constructor(config?: GeneratorOptions, context?: GeneratorContext, aliasPrefix?: string);
    import(source: string): Promise<void>;
    import(directive: ASTDirectives): Promise<void>;
    import(directives: ASTDirectives[]): Promise<void>;
    import(directives: string | ASTDirectives | (ASTDirectives[])): Promise<void>;
    format(options: GeneratorExportOptions): string | {
        state: GeneratorState;
        export: GeneratorExportOptions;
    };
    private processImportDirective;
    private processConfigDirective;
    private processLexerDirective;
    private importLexerStates;
    private importLexerState;
    private buildLexerStructuredStates;
    private processGrammarDirective;
    private importBuiltIn;
    private importGrammar;
    private mergeGrammar;
    private buildRules;
    private buildRule;
    private buildSymbol;
    private buildCharacterRules;
    private buildSubExpressionRules;
    private buildRepeatRules;
}
