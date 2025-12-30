import type { ASTDirectives, GeneratorContext, GeneratorOptions, GeneratorOutputOptions, GenerateOptions } from "../typings/index.ts";
import { GeneratorState } from "./state.ts";
export declare function Generate(source: string, config?: GenerateOptions): Promise<ReturnType<Generator['output']>>;
export declare function Generate(directive: ASTDirectives, config?: GenerateOptions): Promise<ReturnType<Generator['output']>>;
export declare function Generate(directives: ASTDirectives[], config?: GenerateOptions): Promise<ReturnType<Generator['output']>>;
export declare const NAME_DELIMITER = ".";
export declare class Generator {
    private state;
    private config;
    private context;
    private aliasPrefix;
    constructor(config?: GeneratorOptions, context?: GeneratorContext, aliasPrefix?: string);
    import(source: string): Promise<void>;
    import(directive: ASTDirectives): Promise<void>;
    import(directives: ASTDirectives[]): Promise<void>;
    import(directives: string | ASTDirectives | (ASTDirectives[])): Promise<void>;
    output(options: GeneratorOutputOptions): string | {
        state: GeneratorState;
        output: GeneratorOutputOptions;
    };
    private processImportDirective;
    private processLifecycleDirective;
    private processConfigDirective;
    private processLexerDirective;
    private importLexerStates;
    private importLexerState;
    private buildLexerSpanStates;
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
