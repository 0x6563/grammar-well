import { CJSOutput, ESMOutput } from "./javascript";
import { JSONFormatter } from "./json";
import { TypescriptFormat } from "./typescript";
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
