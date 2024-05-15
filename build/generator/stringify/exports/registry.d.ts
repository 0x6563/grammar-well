import { ESMOutput, CJSOutput } from "./javascript";
import { TypescriptFormat } from "./typescript";
import { JSONFormatter } from "./json";
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
