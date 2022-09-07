import { CompileOptions, CompilerContext, OutputFormat, LanguageDirective, GeneratorState } from "../typings";
import { ESMOutput, JavascriptOutput } from "./outputs/javascript";
import { TypescriptFormat } from "./outputs/typescript";
import { JSONFormatter } from "./outputs/json";
declare const OutputFormats: {
    _default: typeof JavascriptOutput;
    object: (grammar: any, exportName: any) => {
        grammar: any;
        exportName: any;
    };
    json: typeof JSONFormatter;
    js: typeof JavascriptOutput;
    javascript: typeof JavascriptOutput;
    module: typeof ESMOutput;
    esmodule: typeof ESMOutput;
    ts: typeof TypescriptFormat;
    typescript: typeof TypescriptFormat;
};
export declare function Compile(rules: string | LanguageDirective | (LanguageDirective[]), config?: CompileOptions): Promise<string | {
    grammar: any;
    exportName: any;
}>;
export declare class Compiler {
    private config;
    private parser;
    private context;
    state: GeneratorState;
    constructor(config?: CompileOptions, context?: CompilerContext);
    export<T extends OutputFormat = '_default'>(format: T, name?: string): ReturnType<typeof OutputFormats[T]>;
    import(source: string): Promise<void>;
    import(directive: LanguageDirective): Promise<void>;
    import(directives: LanguageDirective[]): Promise<void>;
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
    private buildCharacterRules;
    private buildSubExpressionRules;
    private buildRepeatRules;
}
export {};
