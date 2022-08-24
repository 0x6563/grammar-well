import { FileSystemResolver, ImportResolver, ImportResolverConstructor } from "./import-resolver";
import { Generator } from "./generator";
import { ESMOutput, JavascriptOutput } from "./outputs/javascript";
import { TypescriptFormat } from "./outputs/typescript";
import { RuleDefinition, RuleDefinitionList } from "../typings";
import { JSONFormatter } from "./outputs/json";

const OutputFormats = {
    _default: JavascriptOutput,
    object: (grammar, exportName) => ({ grammar, exportName }),
    json: JSONFormatter,
    js: JavascriptOutput,
    javascript: JavascriptOutput,
    module: ESMOutput,
    esmodule: ESMOutput,
    ts: TypescriptFormat,
    typescript: TypescriptFormat
}

export async function Compile(rules: string | RuleDefinition | RuleDefinitionList, config: CompileOptions = {}) {
    const compiler = new Compiler(config);
    await compiler.import(rules);
    return compiler.export(config.format);
}

export class Compiler {
    private state: CompilerState;
    private grammarBuilder: Generator;
    constructor(config: CompileOptions = {}) {
        this.state = {
            alreadycompiled: new Set(),
            resolver: config.resolverInstance ? config.resolverInstance : config.resolver ? new config.resolver(config.basedir) : new FileSystemResolver(config.basedir),
        }
        this.grammarBuilder = new Generator(config, this.state);
    }


    import(rule: RuleDefinition): Promise<void>
    import(rules: RuleDefinitionList): Promise<void>
    import(source: string): Promise<void>
    import(source: string | RuleDefinition | RuleDefinitionList): Promise<void>
    import(val: string | RuleDefinition | RuleDefinitionList): Promise<void> {
        return this.grammarBuilder.import(val as any);
    }

    export<T extends keyof typeof OutputFormats = '_default'>(format: T, name: string = 'grammar'): ReturnType<typeof OutputFormats[OutputFormat<T>]> {
        const grammar = this.grammarBuilder.export();
        const output = format || grammar.config.preprocessor || '_default';
        if (OutputFormats[output]) {
            return OutputFormats[output](grammar, name);
        }
        throw new Error("No such preprocessor: " + output)
    };
}

type OutputFormat<T> = T extends keyof typeof OutputFormats ? T : "_default";
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
}