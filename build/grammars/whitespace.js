"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Grammar() {
    return {
        grammar: {
            start: "_",
            rules: [
                { name: "_$ebnf$1", symbols: [] },
                { name: "_$ebnf$1", symbols: ["_$ebnf$1", "wschar"], postprocess: ({ data }) => data[0].concat([data[1]]) },
                { name: "_", symbols: ["_$ebnf$1"], postprocess: ({ data }) => { return null; } },
                { name: "__$ebnf$1", symbols: ["wschar"] },
                { name: "__$ebnf$1", symbols: ["__$ebnf$1", "wschar"], postprocess: ({ data }) => data[0].concat([data[1]]) },
                { name: "__", symbols: ["__$ebnf$1"], postprocess: ({ data }) => { return null; } },
                { name: "wschar", symbols: [/[\t\n\v\f]/], postprocess: ({ data }) => { return data[0]; } }
            ]
        },
        lexer: null
    };
}
exports.default = Grammar;
//# sourceMappingURL=whitespace.js.map