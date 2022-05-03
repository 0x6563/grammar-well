(function () {
    function id(x) { return x[0]; }
    var grammar = {
        lexer: undefined,
        rules: [
            { "name": "cow$string$1", "symbols": [{ "literal": "M" }, { "literal": "O" }], "postprocess": function joiner(d) { return d.join(''); } },
            { "name": "cow$ebnf$1", "symbols": [{ "literal": "O" }] },
            { "name": "cow$ebnf$1", "symbols": ["cow$ebnf$1", { "literal": "O" }], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "cow", "symbols": ["cow$string$1", "cow$ebnf$1"], "transform": (r) => console.log(r) }
        ],
        start: "cow"
    };
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = grammar;
    }
    else {
        window.grammar = grammar;
    }
})();
//# sourceMappingURL=transform.js.map