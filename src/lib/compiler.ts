import { resolve } from "path";
import { FileSystemResolver, ImportResolver, ImportResolverConstructor } from "./import-resolver";
import { GrammarBuilder } from "./grammar-builder";
import { CoffeescriptOutput } from "../formats/coffeescript";
import { ESMOutput, JavascriptOutput } from "../formats/javascript";
import { TypescriptFormat } from "../formats/typescript";
import { RuleDefinition, RuleDefinitionList } from "../typings";
import { JSONFormatter } from "../formats/json";

const OutputFormats = {
    _default: JavascriptOutput,
    object: (grammar, exportName) => ({ grammar, exportName }),
    json: JSONFormatter,
    js: JavascriptOutput,
    javascript: JavascriptOutput,
    module: ESMOutput,
    esmodule: ESMOutput,
    cs: CoffeescriptOutput,
    coffee: CoffeescriptOutput,
    coffeescript: CoffeescriptOutput,
    ts: TypescriptFormat,
    typescript: TypescriptFormat
}

export function Compile(rules: string | RuleDefinition | RuleDefinitionList, config: CompileOptions = {}) {
    const compiler = new Compiler(config);
    compiler.import(rules);
    return compiler.export(config.format);
}

export class Compiler {
    private state: CompilerState;
    private grammarBuilder: GrammarBuilder;
    constructor(config: CompileOptions = {}) {
        this.state = {
            alreadycompiled: new Set(),
            resolver: config.resolver ? new config.resolver(config.basedir) : new FileSystemResolver(config.basedir),
            builtinResolver: new FileSystemResolver(resolve(__dirname, '../grammars/file.ne'))
        }
        this.grammarBuilder = new GrammarBuilder(config, this.state);
    }

    import(source: string)
    import(rule: RuleDefinition)
    import(rules: RuleDefinitionList)
    import(val: string | RuleDefinition | RuleDefinitionList)
    import(val: string | RuleDefinition | RuleDefinitionList) {
        this.grammarBuilder.import(val);
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
    builtinResolver: ImportResolver;
}