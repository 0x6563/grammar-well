function Grammar() {
    function id(x) { return x[0]; }
    return {
        lexer: undefined,
        rules: [
            { "name": "dqstring$ebnf$1", "symbols": [] },
            { "name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "dqstring", "symbols": [{ "literal": "\"" }, "dqstring$ebnf$1", { "literal": "\"" }], "postprocess": function (d) { return d[1].join(""); } },
            { "name": "sqstring$ebnf$1", "symbols": [] },
            { "name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "sqstring", "symbols": [{ "literal": "'" }, "sqstring$ebnf$1", { "literal": "'" }], "postprocess": function (d) { return d[1].join(""); } },
            { "name": "btstring$ebnf$1", "symbols": [] },
            { "name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "btstring", "symbols": [{ "literal": "`" }, "btstring$ebnf$1", { "literal": "`" }], "postprocess": function (d) { return d[1].join(""); } },
            { "name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id },
            { "name": "dstrchar", "symbols": [{ "literal": "\\" }, "strescape"], "postprocess": function (d) {
                    return JSON.parse("\"" + d.join("") + "\"");
                }
            },
            { "name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id },
            { "name": "sstrchar", "symbols": [{ "literal": "\\" }, "strescape"], "postprocess": function (d) { return JSON.parse("\"" + d.join("") + "\""); } },
            { "name": "sstrchar$string$1", "symbols": [{ "literal": "\\" }, { "literal": "'" }], "postprocess": function joiner(d) { return d.join(''); } },
            { "name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function (d) { return "'"; } },
            { "name": "strescape", "symbols": [/["\\/bfnrt]/], "postprocess": id },
            { "name": "strescape", "symbols": [{ "literal": "u" }, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": function (d) {
                    return d.join("");
                }
            }
        ],
        start: "dqstring"
    };
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Grammar;
}
else {
    window.grammar = Grammar;
}
//# sourceMappingURL=string.js.map