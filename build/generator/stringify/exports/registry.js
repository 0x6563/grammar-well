import { CJSOutput, ESMOutput } from "./javascript.js";
import { JSONFormatter } from "./json.js";
import { TypescriptFormat } from "./typescript.js";
export const ExportsRegistry = {
    object: (generator) => ({ state: generator.state, export: generator.options }),
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
};
//# sourceMappingURL=registry.js.map