// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well



function Grammar(){
    function id(x) { return x.data[0]; }
    
    return {
        lexer: undefined,
        rules: [
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}]},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}]},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}]},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/]},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"]},
    {"name": "sstrchar", "symbols": [/[^\\'\n]/]},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"]},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"]},
    {"name": "strescape", "symbols": [/["\\/bfnrt]/]},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/]}
],
        start: "dqstring"
    }
}

export default Grammar;
