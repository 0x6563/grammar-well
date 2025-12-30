
import { JavaScriptGenerator } from "../javascript.ts";
import { CJSOutput, ESMOutput } from "./javascript.ts";
import { JSONFormatter } from "./json.ts";
import { TypescriptFormat } from "./typescript.ts";


export const ExportsRegistry = {
    object: (generator: JavaScriptGenerator) => ({ state: generator.state, output: generator.options }),
    json: JSONFormatter,
    js: CJSOutput,
    cjs: CJSOutput,
    javascript: CJSOutput,
    commonjs: CJSOutput,
    module: ESMOutput,
    esmodule: ESMOutput,
    esm: ESMOutput,
    ts: TypescriptFormat,
    typescript: TypescriptFormat
}
