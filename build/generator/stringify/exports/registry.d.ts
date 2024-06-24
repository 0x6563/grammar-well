import { CJSOutput, ESMOutput } from "./javascript.js";
import { JSONFormatter } from "./json.js";
import { TypescriptFormat } from "./typescript.js";
export declare const ExportsRegistry: {
    _default: typeof CJSOutput;
    object: (grammar: any, exportName: any) => {
        grammar: any;
        exportName: any;
    };
    json: typeof JSONFormatter;
    js: typeof CJSOutput;
    javascript: typeof CJSOutput;
    module: typeof ESMOutput;
    esmodule: typeof ESMOutput;
    esm: typeof ESMOutput;
    ts: typeof TypescriptFormat;
    typescript: typeof TypescriptFormat;
};
