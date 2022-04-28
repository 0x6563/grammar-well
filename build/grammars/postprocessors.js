(function () {
    function id(x) { return x[0]; }
    function nth(n) {
        return function (d) {
            return d[n];
        };
    }
    function $(o) {
        return function (d) {
            var ret = {};
            Object.keys(o).forEach(function (k) {
                ret[k] = d[o[k]];
            });
            return ret;
        };
    }
    var grammar = {
        Lexer: undefined,
        ParserRules: [],
        ParserStart: ""
    };
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = grammar;
    }
    else {
        window.undefined = grammar;
    }
})();
//# sourceMappingURL=postprocessors.js.map