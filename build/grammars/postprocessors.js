function Grammar() {
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
    return {
        lexer: undefined,
        rules: [],
        start: ""
    };
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Grammar;
}
else {
    window.grammar = Grammar;
}
//# sourceMappingURL=postprocessors.js.map