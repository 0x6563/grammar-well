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
            rules: {
                json$SUBx1: [
                    { name: "json$SUBx1", symbols: ["object"] },
                    { name: "json$SUBx1", symbols: ["array"] }
                ],
                json: [
                    { name: "json", symbols: ["_", "json$SUBx1", "_"], postprocess: ({ data }) => { return data[1][0]; } }
                ],
                object: [
                    { name: "object", symbols: [{ literal: "{" }, "_", { literal: "}" }], postprocess: ({ data }) => { return {}; } },
                    { name: "object", symbols: [{ literal: "{" }, "_", "pair", "object$RPT0Nx1", "_", { literal: "}" }], postprocess: extractObject }
                ],
                object$RPT0Nx1: [
                    { name: "object$RPT0Nx1", symbols: [] },
                    { name: "object$RPT0Nx1", symbols: ["object$RPT0Nx1", "object$RPT0Nx1$SUBx1"], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                object$RPT0Nx1$SUBx1: [
                    { name: "object$RPT0Nx1$SUBx1", symbols: ["_", { literal: "," }, "_", "pair"] }
                ],
                array: [
                    { name: "array", symbols: [{ literal: "[" }, "_", { literal: "]" }], postprocess: ({ data }) => { return []; } },
                    { name: "array", symbols: [{ literal: "[" }, "_", "value", "array$RPT0Nx1", "_", { literal: "]" }], postprocess: extractArray }
                ],
                array$RPT0Nx1: [
                    { name: "array$RPT0Nx1", symbols: [] },
                    { name: "array$RPT0Nx1", symbols: ["array$RPT0Nx1", "array$RPT0Nx1$SUBx1"], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                array$RPT0Nx1$SUBx1: [
                    { name: "array$RPT0Nx1$SUBx1", symbols: ["_", { literal: "," }, "_", "value"] }
                ],
                value: [
                    { name: "value", symbols: ["object"], postprocess: ({ data }) => { return data[0]; } },
                    { name: "value", symbols: ["array"], postprocess: ({ data }) => { return data[0]; } },
                    { name: "value", symbols: ["number"], postprocess: ({ data }) => { return data[0]; } },
                    { name: "value", symbols: ["string"], postprocess: ({ data }) => { return data[0]; } },
                    { name: "value", symbols: [{ literal: "true" }], postprocess: ({ data }) => { return true; } },
                    { name: "value", symbols: [{ literal: "false" }], postprocess: ({ data }) => { return false; } },
                    { name: "value", symbols: [{ literal: "null" }], postprocess: ({ data }) => { return null; } }
                ],
                number: [
                    { name: "number", symbols: [{ token: "number" }], postprocess: ({ data }) => { return parseFloat(data[0].value); } }
                ],
                string: [
                    { name: "string", symbols: [{ token: "string" }], postprocess: ({ data }) => { return JSON.parse(data[0].value); } }
                ],
                pair: [
                    { name: "pair", symbols: ["key", "_", { literal: ":" }, "_", "value"], postprocess: ({ data }) => { return [data[0], data[4]]; } }
                ],
                key: [
                    { name: "key", symbols: ["string"], postprocess: ({ data }) => { return data[0]; } }
                ],
                _$RPT01x1: [
                    { name: "_$RPT01x1", symbols: [{ token: "space" }], postprocess: ({ data }) => data[0] },
                    { name: "_$RPT01x1", symbols: [], postprocess: () => null }
                ],
                _: [
                    { name: "_", symbols: ["_$RPT01x1"], postprocess: ({ data }) => { return null; } }
                ]
            }
        },
        lexer: {
            start: "start",
            states: {
                start: {
                    name: "start",
                    rules: [
                        { when: /\s+/, tag: ["space"] },
                        { when: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/, tag: ["number"] },
                        { when: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/, tag: ["string"] },
                        { when: "{", tag: ["{"] },
                        { when: "}", tag: ["}"] },
                        { when: "[", tag: ["["] },
                        { when: "]", tag: ["]"] },
                        { when: ",", tag: [","] },
                        { when: ":", tag: [":"] },
                        { when: "true", tag: ["true"] },
                        { when: "false", tag: ["false"] },
                        { when: "null", tag: ["null"] }
                    ]
                }
            }
        }
    };
}
exports.default = GWLanguage;
//# sourceMappingURL=json.js.map