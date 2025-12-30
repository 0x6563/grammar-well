import { JavaScriptGenerator } from "../javascript.ts";
import { CJSOutput, ESMOutput } from "./javascript.ts";
import { JSONFormatter } from "./json.ts";
import { TypescriptFormat } from "./typescript.ts";
export declare const ExportsRegistry: {
    object: (generator: JavaScriptGenerator) => {
        state: import("../../state.ts").GeneratorState;
        output: import("../../../index.ts").GeneratorOutputOptions;
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
