// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well



function Grammar(){
    function id(x) { return x[0]; }
    

const moo = require('moo')

let lexer = moo.compile({
    space: {match: /\s+/, lineBreaks: true},
    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
    ',': ',',
    ':': ':',
    true: 'true',
    false: 'false',
    null: 'null',
})




function extractPair(kv, output) {
    if(kv[0]) { output[kv[0]] = kv[1]; }
}

function extractObject(d) {
    let output = {};

    extractPair(d[2], output);

    for (let i in d[3]) {
        extractPair(d[3][i][3], output);
    }

    return output;
}

function extractArray(d) {
    let output = [d[2]];

    for (let i in d[3]) {
        output.push(d[3][i][3]);
    }

    return output;
}


    return {
        lexer: lexer,
        rules: [
    {"name": "json$subexpression$1", "symbols": ["object"]},
    {"name": "json$subexpression$1", "symbols": ["array"]},
    {"name": "json", "symbols": ["_", "json$subexpression$1", "_"], "postprocess": function(d) { return d[1][0]; }},
    {"name": "object", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": function(d) { return {}; }},
    {"name": "object$ebnf$1", "symbols": []},
    {"name": "object$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "pair"]},
    {"name": "object$ebnf$1", "symbols": ["object$ebnf$1", "object$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object", "symbols": [{"literal":"{"}, "_", "pair", "object$ebnf$1", "_", {"literal":"}"}], "postprocess": extractObject},
    {"name": "array", "symbols": [{"literal":"["}, "_", {"literal":"]"}], "postprocess": function(d) { return []; }},
    {"name": "array$ebnf$1", "symbols": []},
    {"name": "array$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "array$ebnf$1", "symbols": ["array$ebnf$1", "array$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "array", "symbols": [{"literal":"["}, "_", "value", "array$ebnf$1", "_", {"literal":"]"}], "postprocess": extractArray},
    {"name": "value", "symbols": ["object"], "postprocess": id},
    {"name": "value", "symbols": ["array"], "postprocess": id},
    {"name": "value", "symbols": ["number"], "postprocess": id},
    {"name": "value", "symbols": ["string"], "postprocess": id},
    {"name": "value", "symbols": [{"literal":"true"}], "postprocess": function(d) { return true; }},
    {"name": "value", "symbols": [{"literal":"false"}], "postprocess": function(d) { return false; }},
    {"name": "value", "symbols": [{"literal":"null"}], "postprocess": function(d) { return null; }},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": function(d) { return parseFloat(d[0].value) }},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": function(d) { return JSON.parse(d[0].value) }},
    {"name": "pair", "symbols": ["key", "_", {"literal":":"}, "_", "value"], "postprocess": function(d) { return [d[0], d[4]]; }},
    {"name": "key", "symbols": ["string"], "postprocess": id},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": function(d) { return null; }}
],
        start: "json"
    }
}

if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = Grammar;
} else {
   window.grammar = Grammar;
}
