import { ESMOutput, JavascriptOutput } from "./outputs/javascript";
import { TypescriptFormat } from "./outputs/typescript";
import { CompileOptions, OutputFormat, LanguageDirective } from "../typings";
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
    private state;
    private grammarBuilder;
    constructor(config?: CompileOptions);
    import(rule: LanguageDirective): Promise<void>;
    import(rules: LanguageDirective[]): Promise<void>;
    import(source: string): Promise<void>;
    import(source: string | LanguageDirective | (LanguageDirective[])): Promise<void>;
    export<T extends OutputFormat = '_default'>(format: T, name?: string): ReturnType<typeof OutputFormats[T]>;
}
export {};
