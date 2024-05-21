"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportsRegistry = void 0;
const javascript_1 = require("./javascript");
const json_1 = require("./json");
const typescript_1 = require("./typescript");
exports.ExportsRegistry = {
    _default: javascript_1.CJSOutput,
    object: (grammar, exportName) => ({ grammar, exportName }),
    json: json_1.JSONFormatter,
    js: javascript_1.CJSOutput,
    javascript: javascript_1.CJSOutput,
    module: javascript_1.ESMOutput,
    esmodule: javascript_1.ESMOutput,
    esm: javascript_1.ESMOutput,
    ts: typescript_1.TypescriptFormat,
    typescript: typescript_1.TypescriptFormat
};
//# sourceMappingURL=registry.js.map