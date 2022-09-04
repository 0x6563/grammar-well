"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractPair(kv, output) {
    if (kv[0]) {
        output[kv[0]] = kv[1];
    }
}
function extractObject({ data }) {
    let output = {};
    extractPair(data[2], output);
    for (let i in data[3]) {
        extractPair(data[3][i][3], output);
    }
    return output;
}
function extractArray({ data }) {
    let output = [data[2]];
    for (let i in data[3]) {
        output.push(data[3][i][3]);
    }
    return output;
}
function GWLanguage() {
    return {
        grammar: {
            start: "json",
            rules: [
                { name: "json$subexpression$1", symbols: ["object"] },
                { name: "json$subexpression$1", symbols: ["array"] },
                { name: "json", symbols: ["_", "json$subexpression$1", "_"], postprocess: ({ data }) => { return data[1][0]; } },
                { name: "object", symbols: [{ "literal": "{" }, "_", { "literal": "}" }], postprocess: ({ data }) => { return {}; } },
                { name: "object$ebnf$1", symbols: [] },
                { name: "object$ebnf$1$subexpression$1", symbols: ["_", { "literal": "," }, "_", "pair"] },
                { name: "object$ebnf$1", symbols: ["object$ebnf$1", "object$ebnf$1$subexpression$1"], postprocess: ({ data }) => data[0].concat([data[1]]) },
                { name: "object", symbols: [{ "literal": "{" }, "_", "pair", "object$ebnf$1", "_", { "literal": "}" }], postprocess: extractObject },
                { name: "array", symbols: [{ "literal": "[" }, "_", { "literal": "]" }], postprocess: ({ data }) => { return []; } },
                { name: "array$ebnf$1", symbols: [] },
                { name: "array$ebnf$1$subexpression$1", symbols: ["_", { "literal": "," }, "_", "value"] },
                { name: "array$ebnf$1", symbols: ["array$ebnf$1", "array$ebnf$1$subexpression$1"], postprocess: ({ data }) => data[0].concat([data[1]]) },
                { name: "array", symbols: [{ "literal": "[" }, "_", "value", "array$ebnf$1", "_", { "literal": "]" }], postprocess: extractArray },
                { name: "value", symbols: ["object"], postprocess: ({ data }) => { return data[0]; } },
                { name: "value", symbols: ["array"], postprocess: ({ data }) => { return data[0]; } },
                { name: "value", symbols: ["number"], postprocess: ({ data }) => { return data[0]; } },
                { name: "value", symbols: ["string"], postprocess: ({ data }) => { return data[0]; } },
                { name: "value", symbols: [{ "literal": "true" }], postprocess: ({ data }) => { return true; } },
                { name: "value", symbols: [{ "literal": "false" }], postprocess: ({ data }) => { return false; } },
                { name: "value", symbols: [{ "literal": "null" }], postprocess: ({ data }) => { return null; } },
                { name: "number", symbols: [{ type: "number" }], postprocess: ({ data }) => { return parseFloat(data[0].value); } },
                { name: "string", symbols: [{ type: "string" }], postprocess: ({ data }) => { return JSON.parse(data[0].value); } },
                { name: "pair", symbols: ["key", "_", { "literal": ":" }, "_", "value"], postprocess: ({ data }) => { return [data[0], data[4]]; } },
                { name: "key", symbols: ["string"], postprocess: ({ data }) => { return data[0]; } },
                { name: "_", symbols: [] },
                { name: "_", symbols: [{ type: "space" }], postprocess: ({ data }) => { return null; } }
            ]
        },
        lexer: {
            start: "start",
            states: [
                {
                    name: "start",
                    rules: [
                        { when: /\s+/, type: "space" },
                        { when: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/, type: "number" },
                        { when: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/, type: "string" },
                        { when: "{" },
                        { when: "}" },
                        { when: "[" },
                        { when: "]" },
                        { when: "," },
                        { when: ":" },
                        { when: "true" },
                        { when: "false" },
                        { when: "null" }
                    ]
                }
            ]
        }
    };
}
exports.default = GWLanguage;
//# sourceMappingURL=json.js.map