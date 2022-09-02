import { FileSystemResolver } from "./import-resolver";
import { Generator } from "./generator";
import { ESMOutput, JavascriptOutput } from "./outputs/javascript";
import { TypescriptFormat } from "./outputs/typescript";
import { CompileOptions, CompilerState, OutputFormat, LanguageDirective } from "../typings";
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

export async function Compile(rules: string | LanguageDirective | (LanguageDirective[]), config: CompileOptions = {}) {
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


    import(rule: LanguageDirective): Promise<void>
    import(rules: LanguageDirective[]): Promise<void>
    import(source: string): Promise<void>
    import(source: string | LanguageDirective | (LanguageDirective[])): Promise<void>
    import(val: string | LanguageDirective | (LanguageDirective[])): Promise<void> {
        return this.grammarBuilder.import(val as any);
    }

    export<T extends OutputFormat = '_default'>(format: T, name: string = 'GWLanguage'): ReturnType<typeof OutputFormats[T]> {
        const grammar = this.grammarBuilder.export();
        const output = format || grammar.config.preprocessor || '_default';
        if (OutputFormats[output]) {
            return OutputFormats[output](grammar, name);
        }
        throw new Error("No such preprocessor: " + output)
    };
}
