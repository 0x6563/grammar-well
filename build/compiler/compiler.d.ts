import { CompileOptions, GrammarBuilderContext, TemplateFormat, LanguageDirective } from "../typings";
import { ESMOutput, JavascriptOutput } from "./outputs/javascript";
import { TypescriptFormat } from "./outputs/typescript";
import { JSONFormatter } from "./outputs/json";
import { Generator } from "./generator/generator";
declare const TemplateFormats: {
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
    esm: typeof ESMOutput;
    ts: typeof TypescriptFormat;
    typescript: typeof TypescriptFormat;
};
export declare function Compile(rules: string | LanguageDirective | (LanguageDirective[]), config?: CompileOptions): Promise<string | {
    grammar: any;
    exportName: any;
}>;
export declare class GrammarBuilder {
    private config;
    private alias;
    private parser;
    private context;
    generator: Generator;
    constructor(config?: CompileOptions, context?: GrammarBuilderContext, alias?: string);
    export<T extends TemplateFormat = '_default'>(format: T, name?: string): ReturnType<typeof TemplateFormats[T]>;
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
    private buildRules;
    private buildRule;
    private buildSymbol;
    private buildCharacterRules;
    private buildSubExpressionRules;
    private buildRepeatRules;
}
export {};
