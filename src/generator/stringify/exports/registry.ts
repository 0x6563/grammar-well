
import { ESMOutput, CJSOutput } from "./javascript";
import { TypescriptFormat } from "./typescript";
import { JSONFormatter } from "./json";


export const ExportsRegistry = {
    _default: CJSOutput,
    object: (grammar, exportName) => ({ grammar, exportName }),
    json: JSONFormatter,
    js: CJSOutput,
    javascript: CJSOutput,
    module: ESMOutput,
    esmodule: ESMOutput,
    esm: ESMOutput,
    ts: TypescriptFormat,
    typescript: TypescriptFormat
}
