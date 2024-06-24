import { CJSOutput, ESMOutput } from "./javascript.js";
import { JSONFormatter } from "./json.js";
import { TypescriptFormat } from "./typescript.js";
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
};
//# sourceMappingURL=registry.js.map