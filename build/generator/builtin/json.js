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
class grammar {
    artifacts = {
        grammar: {
            rules: {
                _: [
                    { name: "_", postprocess: ({ data }) => { return (null); }, symbols: ["_$RPT01x1"] }
                ],
                _$RPT01x1: [
                    { name: "_$RPT01x1", postprocess: ({ data }) => data[0], symbols: [{ token: "whitespace" }] },
                    { name: "_$RPT01x1", postprocess: () => null, symbols: [] }
                ],
                __: [
                    { name: "__", postprocess: ({ data }) => { return (null); }, symbols: ["__$RPT1Nx1"] }
                ],
                __$RPT1Nx1: [
                    { name: "__$RPT1Nx1", symbols: [{ token: "whitespace" }] },
                    { name: "__$RPT1Nx1", postprocess: ({ data }) => data[0].concat([data[1]]), symbols: ["__$RPT1Nx1", { token: "whitespace" }] }
                ],
                array: [
                    { name: "array", postprocess: ({ data }) => { return ([]); }, symbols: [{ literal: "[" }, "_", { literal: "]" }] },
                    { name: "array", postprocess: extractArray, symbols: [{ literal: "[" }, "_", "value", "array$RPT0Nx1", "_", { literal: "]" }] }
                ],
                array$RPT0Nx1: [
                    { name: "array$RPT0Nx1", symbols: [] },
                    { name: "array$RPT0Nx1", postprocess: ({ data }) => data[0].concat([data[1]]), symbols: ["array$RPT0Nx1", "array$RPT0Nx1$SUBx1"] }
                ],
                array$RPT0Nx1$SUBx1: [
                    { name: "array$RPT0Nx1$SUBx1", symbols: ["_", { literal: "," }, "_", "value"] }
                ],
                json: [
                    { name: "json", postprocess: ({ data }) => { return (data[1][0]); }, symbols: ["_", "json$SUBx1", "_"] }
                ],
                json$SUBx1: [
                    { name: "json$SUBx1", symbols: ["object"] },
                    { name: "json$SUBx1", symbols: ["array"] }
                ],
                key: [
                    { name: "key", postprocess: ({ data }) => { return (data[0]); }, symbols: ["string"] }
                ],
                number: [
                    { name: "number", postprocess: ({ data }) => { return (parseFloat(data[0].value)); }, symbols: [{ token: "number" }] }
                ],
                object: [
                    { name: "object", postprocess: ({ data }) => { return ({}); }, symbols: [{ literal: "{" }, "_", { literal: "}" }] },
                    { name: "object", postprocess: extractObject, symbols: [{ literal: "{" }, "_", "pair", "object$RPT0Nx1", "_", { literal: "}" }] }
                ],
                object$RPT0Nx1: [
                    { name: "object$RPT0Nx1", symbols: [] },
                    { name: "object$RPT0Nx1", postprocess: ({ data }) => data[0].concat([data[1]]), symbols: ["object$RPT0Nx1", "object$RPT0Nx1$SUBx1"] }
                ],
                object$RPT0Nx1$SUBx1: [
                    { name: "object$RPT0Nx1$SUBx1", symbols: ["_", { literal: "," }, "_", "pair"] }
                ],
                pair: [
                    { name: "pair", postprocess: ({ data }) => { return ([data[0], data[4]]); }, symbols: ["key", "_", { literal: ":" }, "_", "value"] }
                ],
                string: [
                    { name: "string", postprocess: ({ data }) => { return (JSON.parse(data[0].value)); }, symbols: [{ token: "string" }] }
                ],
                value: [
                    { name: "value", postprocess: ({ data }) => { return (data[0]); }, symbols: ["object"] },
                    { name: "value", postprocess: ({ data }) => { return (data[0]); }, symbols: ["array"] },
                    { name: "value", postprocess: ({ data }) => { return (data[0]); }, symbols: ["number"] },
                    { name: "value", postprocess: ({ data }) => { return (data[0]); }, symbols: ["string"] },
                    { name: "value", postprocess: ({ data }) => { return (true); }, symbols: [{ literal: "true" }] },
                    { name: "value", postprocess: ({ data }) => { return (false); }, symbols: [{ literal: "false" }] },
                    { name: "value", postprocess: ({ data }) => { return (null); }, symbols: [{ literal: "null" }] }
                ]
            },
            start: "json"
        },
        lexer: {
            start: "json",
            states: {
                json: {
                    regex: /(?:(?:(\s+))|(?:(-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b))|(?:(\"(?:\\[\"bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^\"\\])*\"))|(?:((?:\{)))|(?:((?:\})))|(?:((?:\[)))|(?:((?:\])))|(?:((?:,)))|(?:((?::)))|(?:((?:true)))|(?:((?:false)))|(?:((?:null))))/ym,
                    rules: [
                        { tag: ["whitespace"], when: /\s+/ },
                        { tag: ["number"], when: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/ },
                        { tag: ["string"], when: /\"(?:\\[\"bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^\"\\])*\"/ },
                        { tag: ["{"], when: "{" },
                        { tag: ["}"], when: "}" },
                        { tag: ["["], when: "[" },
                        { tag: ["]"], when: "]" },
                        { tag: [","], when: "," },
                        { tag: [":"], when: ":" },
                        { tag: ["true"], when: "true" },
                        { tag: ["false"], when: "false" },
                        { tag: ["null"], when: "null" }
                    ]
                },
                whitespace: {
                    regex: /(?:(?:(\s+)))/ym,
                    rules: [
                        { tag: ["whitespace"], when: /\s+/ }
                    ]
                }
            }
        }
    };
    constructor() { }
}
export default grammar;
//# sourceMappingURL=json.js.map