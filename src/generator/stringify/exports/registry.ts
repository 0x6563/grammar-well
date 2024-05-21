
import { CJSOutput, ESMOutput } from "./javascript";
import { JSONFormatter } from "./json";
import { TypescriptFormat } from "./typescript";


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
