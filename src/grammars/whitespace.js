// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well



function Grammar(){
    function id(x) { return x[0]; }
    
    return {
        lexer: undefined,
        rules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id}
],
        start: "_"
    }
}

if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = Grammar;
} else {
   window.grammar = Grammar;
}
