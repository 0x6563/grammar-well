function Grammar() {
    function id(x) { return x.data[0]; }
    function getValue({ data }) {
        return data[0].value;
    }
    function literals(list) {
        const rules = {};
        for (let lit of list) {
            rules[lit] = { match: lit, next: 'main' };
        }
        return rules;
    }
    const moo = require('moo');
    const rules = Object.assign({
        ws: { match: /\s+/, lineBreaks: true, next: 'main' },
        comment: /\#.*/,
        arrow: { match: /[=-]+\>/, next: 'main' },
        js: {
            match: /\{\%(?:[^%]|\%[^}])*\%\}/,
            value: x => x.slice(2, -2),
            lineBreaks: true,
        },
        word: { match: /[\w\?\+]+/, next: 'afterWord' },
        string: {
            match: /"(?:[^\\"\n]|\\["\\/bfnrt]|\\u[a-fA-F0-9]{4})*"/,
            value: x => JSON.parse(x),
            next: 'main',
        },
        btstring: {
            match: /`[^`]*`/,
            value: x => x.slice(1, -1),
            next: 'main',
            lineBreaks: true,
        },
    }, literals([
        ",", "|", "$", "%", "(", ")",
        ":?", ":*", ":+",
        "@include", "@builtin", "@head", "@body", "@",
        "]",
    ]));
    const lexer = moo.states({
        main: Object.assign({}, rules, {
            charclass: {
                match: /\.|\[(?:\\.|[^\\\n])+?\]/,
                value: x => new RegExp(x),
            },
        }),
        afterWord: Object.assign({}, rules, literals(['['])),
    });
    function insensitive({ literal }) {
        const tokens = [];
        for (let i = 0; i < literal.length; i++) {
            const c = literal.charAt(i);
            if (c.toUpperCase() !== c || c.toLowerCase() !== c) {
                tokens.push(new RegExp("[" + c.toLowerCase() + c.toUpperCase() + "]"));
            }
            else {
                tokens.push({ literal: c });
            }
        }
        return { subexpression: [{ tokens, postprocess: ({data}) => data.join('') }] };
    }
    return {
        lexer: lexer,
        rules: [
            { "name": "final$ebnf$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": id },
            { "name": "final$ebnf$1", "symbols": [], "postprocess": function (d) { return null; } },
            { "name": "final", "symbols": ["_", "prog", "_", "final$ebnf$1"], "postprocess": function ({ data }) { return data[1]; } },
            { "name": "prog", "symbols": ["prod"], "postprocess": function ({ data }) { return [data[0]]; } },
            { "name": "prog", "symbols": ["prod", "ws", "prog"], "postprocess": function ({ data }) { return [data[0]].concat(data[2]); } },
            { "name": "prod", "symbols": ["word", "_", (lexer.has("arrow") ? { type: "arrow" } : arrow), "_", "expression+"], "postprocess": function ({ data }) { return { name: data[0], rules: data[4] }; } },
            { "name": "prod", "symbols": ["word", { "literal": "[" }, "_", "wordlist", "_", { "literal": "]" }, "_", (lexer.has("arrow") ? { type: "arrow" } : arrow), "_", "expression+"], "postprocess": function ({ data }) { return { macro: data[0], args: data[3], exprs: data[9] }; } },
            { "name": "prod", "symbols": [{ "literal": "@" }, "_", "js"], "postprocess": function ({ data }) { return { body: data[2] }; } },
            { "name": "prod", "symbols": [{ "literal": "@body" }, "_", "js"], "postprocess": function ({ data }) { return { body: data[2] }; } },
            { "name": "prod", "symbols": [{ "literal": "@head" }, "_", "js"], "postprocess": function ({ data }) { return { head: data[2] }; } },
            { "name": "prod", "symbols": [{ "literal": "@include" }, "_", "string"], "postprocess": function ({ data }) { return { include: data[2].literal, builtin: false }; } },
            { "name": "prod", "symbols": [{ "literal": "@builtin" }, "_", "string"], "postprocess": function ({ data }) { return { include: data[2].literal, builtin: true }; } },
            { "name": "prod", "symbols": [{ "literal": "@" }, "word", "ws", "word"], "postprocess": function ({ data }) { return { config: data[1], value: data[3] }; } },
            { "name": "expression+", "symbols": ["completeexpression"] },
            { "name": "expression+", "symbols": ["expression+", "_", { "literal": "|" }, "_", "completeexpression"], "postprocess": function ({ data }) { return data[0].concat([data[4]]); } },
            { "name": "expressionlist", "symbols": ["completeexpression"] },
            { "name": "expressionlist", "symbols": ["expressionlist", "_", { "literal": "," }, "_", "completeexpression"], "postprocess": function ({ data }) { return data[0].concat([data[4]]); } },
            { "name": "wordlist", "symbols": ["word"] },
            { "name": "wordlist", "symbols": ["wordlist", "_", { "literal": "," }, "_", "word"], "postprocess": function ({ data }) { return data[0].concat([data[4]]); } },
            { "name": "completeexpression", "symbols": ["expr"], "postprocess": function ({ data }) { return { tokens: data[0] }; } },
            { "name": "completeexpression", "symbols": ["expr", "_", "js"], "postprocess": function ({ data }) { return { tokens: data[0], transform: data[2] }; } },
            { "name": "expr_member", "symbols": ["word"], "postprocess": ({ data }) => data[0] },
            { "name": "expr_member", "symbols": [{ "literal": "$" }, "word"], "postprocess": function ({ data }) { return { mixin: data[1] }; } },
            { "name": "expr_member", "symbols": ["word", { "literal": "[" }, "_", "expressionlist", "_", { "literal": "]" }], "postprocess": function ({ data }) { return { macrocall: data[0], args: data[3] }; } },
            { "name": "expr_member$ebnf$1", "symbols": [{ "literal": "i" }], "postprocess": id },
            { "name": "expr_member$ebnf$1", "symbols": [], "postprocess": function (d) { return null; } },
            { "name": "expr_member", "symbols": ["string", "expr_member$ebnf$1"], "postprocess": function ({ data }) { if (data[1]) {
                    return insensitive(data[0]);
                }
                else {
                    return data[0];
                } } },
            { "name": "expr_member", "symbols": [{ "literal": "%" }, "word"], "postprocess": function ({ data }) { return { token: data[1] }; } },
            { "name": "expr_member", "symbols": ["charclass"], "postprocess": ({ data }) => data[0] },
            { "name": "expr_member", "symbols": [{ "literal": "(" }, "_", "expression+", "_", { "literal": ")" }], "postprocess": function ({ data }) { return { 'subexpression': data[2] }; } },
            { "name": "expr_member", "symbols": ["expr_member", "_", "ebnf_modifier"], "postprocess": function ({ data }) { return { 'ebnf': data[0], 'modifier': data[2] }; } },
            { "name": "ebnf_modifier", "symbols": [{ "literal": ":+" }], "postprocess": getValue },
            { "name": "ebnf_modifier", "symbols": [{ "literal": ":*" }], "postprocess": getValue },
            { "name": "ebnf_modifier", "symbols": [{ "literal": ":?" }], "postprocess": getValue },
            { "name": "expr", "symbols": ["expr_member"] },
            { "name": "expr", "symbols": ["expr", "ws", "expr_member"], "postprocess": function ({ data }) { return data[0].concat([data[2]]); } },
            { "name": "word", "symbols": [(lexer.has("word") ? { type: "word" } : word)], "postprocess": getValue },
            { "name": "string", "symbols": [(lexer.has("string") ? { type: "string" } : string)], "postprocess": ({ data }) => ({ literal: data[0].value }) },
            { "name": "string", "symbols": [(lexer.has("btstring") ? { type: "btstring" } : btstring)], "postprocess": ({ data }) => ({ literal: data[0].value }) },
            { "name": "charclass", "symbols": [(lexer.has("charclass") ? { type: "charclass" } : charclass)], "postprocess": getValue },
            { "name": "js", "symbols": [(lexer.has("js") ? { type: "js" } : js)], "postprocess": getValue },
            { "name": "_$ebnf$1", "symbols": ["ws"], "postprocess": id },
            { "name": "_$ebnf$1", "symbols": [], "postprocess": function (d) { return null; } },
            { "name": "_", "symbols": ["_$ebnf$1"] },
            { "name": "ws", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
            { "name": "ws$ebnf$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": id },
            { "name": "ws$ebnf$1", "symbols": [], "postprocess": function (d) { return null; } },
            { "name": "ws", "symbols": ["ws$ebnf$1", (lexer.has("comment") ? { type: "comment" } : comment), "_"] }
        ],
        start: "final"
    };
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Grammar;
}
else {
    window.grammar = Grammar;
}
//# sourceMappingURL=grammar-well.js.map