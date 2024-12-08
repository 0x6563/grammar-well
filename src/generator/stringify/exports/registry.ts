
import { JavaScriptGenerator } from "../javascript.js";
import { CJSOutput, ESMOutput } from "./javascript.js";
import { JSONFormatter } from "./json.js";
import { TypescriptFormat } from "./typescript.js";


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
