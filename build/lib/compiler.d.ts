import { ImportResolver, ImportResolverConstructor } from "./import-resolver";
import { CoffeescriptOutput } from "../formats/coffeescript";
import { ESMOutput, JavascriptOutput } from "../formats/javascript";
import { TypescriptFormat } from "../formats/typescript";
import { RuleDefinition, RuleDefinitionList } from "../typings";
import { JSONFormatter } from "../formats/json";
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
    cs: typeof CoffeescriptOutput;
    coffee: typeof CoffeescriptOutput;
    coffeescript: typeof CoffeescriptOutput;
    ts: typeof TypescriptFormat;
    typescript: typeof TypescriptFormat;
};
export declare function Compile(rules: string | RuleDefinition | RuleDefinitionList, config?: CompileOptions): string | {
    grammar: any;
    exportName: any;
};
export declare class Compiler {
    private state;
    private grammarBuilder;
    constructor(config?: CompileOptions);
    import(source: string): any;
    import(rule: RuleDefinition): any;
    import(rules: RuleDefinitionList): any;
    import(val: string | RuleDefinition | RuleDefinitionList): any;
    export<T extends keyof typeof OutputFormats = '_default'>(format: T, name?: string): ReturnType<typeof OutputFormats[OutputFormat<T>]>;
}
declare type OutputFormat<T> = T extends keyof typeof OutputFormats ? T : "_default";
export interface CompileOptions {
    version?: string;
    noscript?: boolean;
    basedir?: string;
    resolver?: ImportResolverConstructor;
    resolverInstance?: ImportResolver;
    exportName?: string;
    format?: keyof typeof OutputFormats;
}
export interface CompilerState {
    alreadycompiled: Set<string>;
    resolver: ImportResolver;
    builtinResolver: ImportResolver;
}
export {};
