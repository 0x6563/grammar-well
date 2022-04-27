// Generated automatically by nearley, version unknown 
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

/* This comment should exist. */
var f = 0;

var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "p", "symbols": [{"literal":"("}, "p", {"literal":")"}]},
    {"name": "p", "symbols": [/[a-z]/, "q"], "postprocess": function(d) {return 1;}},
    {"name": "q", "symbols": []},
    {"name": "q$subexpression$1$string$1", "symbols": [{"literal":"o"}, {"literal":"w"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "q$subexpression$1", "symbols": [{"literal":"c"}, "q$subexpression$1$string$1"]},
    {"name": "q", "symbols": ["q", "q$subexpression$1"]}
]
  , ParserStart: "p"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.undefined = grammar;
}
})();
