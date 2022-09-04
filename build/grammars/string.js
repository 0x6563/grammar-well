"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GWLanguage() {
    return {
        grammar: {
            start: "dqstring",
            rules: [
                { name: "dqstring$ebnf$1", symbols: [] },
                { name: "dqstring$ebnf$1", symbols: ["dqstring$ebnf$1", "dstrchar"], postprocess: ({ data }) => data[0].concat([data[1]]) },
                { name: "dqstring", symbols: [{ "literal": "\"" }, "dqstring$ebnf$1", { "literal": "\"" }], postprocess: ({ data }) => { return data[1].join(""); } },
                { name: "sqstring$ebnf$1", symbols: [] },
                { name: "sqstring$ebnf$1", symbols: ["sqstring$ebnf$1", "sstrchar"], postprocess: ({ data }) => data[0].concat([data[1]]) },
                { name: "sqstring", symbols: [{ "literal": "'" }, "sqstring$ebnf$1", { "literal": "'" }], postprocess: ({ data }) => { return data[1].join(""); } },
                { name: "btstring$ebnf$1", symbols: [] },
                { name: "btstring$ebnf$1", symbols: ["btstring$ebnf$1", /[^`]/], postprocess: ({ data }) => data[0].concat([data[1]]) },
                { name: "btstring", symbols: [{ "literal": "`" }, "btstring$ebnf$1", { "literal": "`" }], postprocess: ({ data }) => { return data[1].join(""); } },
                { name: "dstrchar", symbols: [/[^\\"\n]/], postprocess: ({ data }) => { return data[0]; } },
                { name: "dstrchar", symbols: [{ "literal": "\\" }, "strescape"], postprocess: ({ data }) => { return JSON.parse("\"" + data.join("") + "\""); } },
                { name: "sstrchar", symbols: [/[^\\'\n]/], postprocess: ({ data }) => { return data[0]; } },
                { name: "sstrchar", symbols: [{ "literal": "\\" }, "strescape"], postprocess: ({ data }) => { return JSON.parse("\"" + data.join("") + "\""); } },
                { name: "sstrchar$string$1", symbols: [{ "literal": "\\" }, { "literal": "'" }], postprocess: ({ data }) => data.join('') },
                { name: "sstrchar", symbols: ["sstrchar$string$1"], postprocess: ({ data }) => { return "'"; } },
                { name: "strescape", symbols: [/["\\/bfnrt]/], postprocess: ({ data }) => { return data[0]; } },
                { name: "strescape", symbols: [{ "literal": "u" }, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], postprocess: ({ data }) => { return data.join(""); } }
            ]
        },
        lexer: null
    };
}
exports.default = GWLanguage;
//# sourceMappingURL=string.js.map