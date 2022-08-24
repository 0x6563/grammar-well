// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well



function Grammar(){
    function id(x) { return x.data[0]; }
    
function getValue(d) {
    return d[0].value
}

function literals(list) {
    var rules = {}
    for (var lit of list) {
        rules[lit] = {match: lit, next: 'main'}
    }
    return rules
}

var moo = require('moo')
var rules = Object.assign({
    ws: {match: /\s+/, lineBreaks: true, next: 'main'},
    comment: /\#.*/,
    arrow: {match: /[=-]+\>/, next: 'main'},
    js: {
        match: /\{\%(?:[^%]|\%[^}])*\%\}/,
        value: x => x.slice(2, -2),
        lineBreaks: true,
    },
    word: {match: /[\w\?\+]+/, next: 'afterWord'},
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
    "@include", "@builtin", "@",
    "]",
]))

var lexer = moo.states({
    main: Object.assign({}, rules, {
        charclass: {
            match: /\.|\[(?:\\.|[^\\\n])+?\]/,
            value: x => new RegExp(x),
        },
    }),
    // Both macro arguments and charclasses are both enclosed in [ ].
    // We disambiguate based on whether the previous token was a `word`.
    afterWord: Object.assign({}, rules, {
        "[": {match: "[", next: 'main'},
    }),
})

function insensitive(sl) {
    var s = sl.literal;
    var result = [];
    for (var i=0; i<s.length; i++) {
        var c = s.charAt(i);
        if (c.toUpperCase() !== c || c.toLowerCase() !== c) {
            result.push(new RegExp("[" + c.toLowerCase() + c.toUpperCase() + "]"));
            } else {
            result.push({literal: c});
        }
    }
    return {subexpression: [{tokens: result, postprocess: function(d) {return d.join(""); }}]};
}


    return {
        lexer: lexer,
        rules: [
    {"name": "final$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "final$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "final", "symbols": ["_", "prog", "_", "final$ebnf$1"]},
    {"name": "prog", "symbols": ["prod"]},
    {"name": "prog", "symbols": ["prod", "ws", "prog"]},
    {"name": "prod", "symbols": ["word", "_", (lexer.has("arrow") ? {type: "arrow"} : arrow), "_", "expression+"]},
    {"name": "prod", "symbols": ["word", {"literal":"["}, "_", "wordlist", "_", {"literal":"]"}, "_", (lexer.has("arrow") ? {type: "arrow"} : arrow), "_", "expression+"]},
    {"name": "prod", "symbols": [{"literal":"@"}, "_", "js"]},
    {"name": "prod", "symbols": [{"literal":"@"}, "word", "ws", "word"]},
    {"name": "prod", "symbols": [{"literal":"@include"}, "_", "string"]},
    {"name": "prod", "symbols": [{"literal":"@builtin"}, "_", "string"]},
    {"name": "expression+", "symbols": ["completeexpression"]},
    {"name": "expression+", "symbols": ["expression+", "_", {"literal":"|"}, "_", "completeexpression"]},
    {"name": "expressionlist", "symbols": ["completeexpression"]},
    {"name": "expressionlist", "symbols": ["expressionlist", "_", {"literal":","}, "_", "completeexpression"]},
    {"name": "wordlist", "symbols": ["word"]},
    {"name": "wordlist", "symbols": ["wordlist", "_", {"literal":","}, "_", "word"]},
    {"name": "completeexpression", "symbols": ["expr"]},
    {"name": "completeexpression", "symbols": ["expr", "_", "js"]},
    {"name": "expr_member", "symbols": ["word"]},
    {"name": "expr_member", "symbols": [{"literal":"$"}, "word"]},
    {"name": "expr_member", "symbols": ["word", {"literal":"["}, "_", "expressionlist", "_", {"literal":"]"}]},
    {"name": "expr_member$ebnf$1", "symbols": [{"literal":"i"}], "postprocess": id},
    {"name": "expr_member$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "expr_member", "symbols": ["string", "expr_member$ebnf$1"]},
    {"name": "expr_member", "symbols": [{"literal":"%"}, "word"]},
    {"name": "expr_member", "symbols": ["charclass"]},
    {"name": "expr_member", "symbols": [{"literal":"("}, "_", "expression+", "_", {"literal":")"}]},
    {"name": "expr_member", "symbols": ["expr_member", "_", "ebnf_modifier"]},
    {"name": "ebnf_modifier", "symbols": [{"literal":":+"}]},
    {"name": "ebnf_modifier", "symbols": [{"literal":":*"}]},
    {"name": "ebnf_modifier", "symbols": [{"literal":":?"}]},
    {"name": "expr", "symbols": ["expr_member"]},
    {"name": "expr", "symbols": ["expr", "ws", "expr_member"]},
    {"name": "word", "symbols": [(lexer.has("word") ? {type: "word"} : word)]},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)]},
    {"name": "string", "symbols": [(lexer.has("btstring") ? {type: "btstring"} : btstring)]},
    {"name": "charclass", "symbols": [(lexer.has("charclass") ? {type: "charclass"} : charclass)]},
    {"name": "js", "symbols": [(lexer.has("js") ? {type: "js"} : js)]},
    {"name": "_$ebnf$1", "symbols": ["ws"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "ws", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "ws$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "ws$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ws", "symbols": ["ws$ebnf$1", (lexer.has("comment") ? {type: "comment"} : comment), "_"]}
],
        start: "final"
    }
}

export default Grammar;
