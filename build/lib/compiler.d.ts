import { ImportResolver, ImportResolverConstructor } from "./import-resolver";
import { CoffeescriptOutput } from "../outputs/coffeescript";
import { ESMOutput, JavascriptOutput } from "../outputs/javascript";
import { TypescriptFormat } from "../outputs/typescript";
import { RuleDefinition, RuleDefinitionList } from "../typings";
import { JSONFormatter } from "../outputs/json";
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
export declare function Compile(rules: string | RuleDefinition | RuleDefinitionList, config?: CompileOptions): Promise<string | {
    grammar: any;
    exportName: any;
}>;
export declare class Compiler {
    private state;
    private grammarBuilder;
    constructor(config?: CompileOptions);
    import(rule: RuleDefinition): Promise<void>;
    import(rules: RuleDefinitionList): Promise<void>;
    import(source: string, language: 'nearley' | 'grammar-well'): Promise<void>;
    import(source: string | RuleDefinition | RuleDefinitionList, language?: 'nearley' | 'grammar-well'): Promise<void>;
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
    language?: 'nearley' | 'grammar-well';
}
export interface CompilerState {
    alreadycompiled: Set<string>;
    resolver: ImportResolver;
}
export {};
