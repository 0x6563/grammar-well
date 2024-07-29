import { JavaScriptGenerator } from "../javascript.js";
import { CJSOutput, ESMOutput } from "./javascript.js";
import { JSONFormatter } from "./json.js";
import { TypescriptFormat } from "./typescript.js";
export declare const ExportsRegistry: {
    object: (generator: JavaScriptGenerator) => {
        state: import("../../state.js").GeneratorState;
        export: import("../../../index.js").GeneratorExportOptions;
    };
    json: typeof JSONFormatter;
    js: typeof CJSOutput;
    cjs: typeof CJSOutput;
    javascript: typeof CJSOutput;
    commonjs: typeof CJSOutput;
    module: typeof ESMOutput;
    esmodule: typeof ESMOutput;
    esm: typeof ESMOutput;
    ts: typeof TypescriptFormat;
    typescript: typeof TypescriptFormat;
};
