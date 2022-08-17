// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well



function Grammar(){
    function id(x) { return x[0]; }
    
    return {
        lexer: undefined,
        rules: [
    {"name": "cow$string$1", "symbols": [{"literal":"M"}, {"literal":"O"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "cow$ebnf$1", "symbols": [{"literal":"O"}]},
    {"name": "cow$ebnf$1", "symbols": ["cow$ebnf$1", {"literal":"O"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "cow", "symbols": ["cow$string$1", "cow$ebnf$1"]}
],
        start: "cow"
    }
}

if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = Grammar;
} else {
   window.grammar = Grammar;
}
