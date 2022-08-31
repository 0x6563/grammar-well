# http://www.json.org/
# http://www.asciitable.com/
@{%

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

%}

@lexer lexer

json -> _ (object | array) _ {% function({data}) { return data[1][0]; } %}

object -> "{" _ "}" {% function({data}) { return {}; } %}
    | "{" _ pair (_ "," _ pair):* _ "}" {% extractObject %}

array -> "[" _ "]" {% function({data}) { return []; } %}
    | "[" _ value (_ "," _ value):* _ "]" {% extractArray %}

value ->
      object {% id %}
    | array {% id %}
    | number {% id %}
    | string {% id %}
    | "true" {% function({data}) { return true; } %}
    | "false" {% function({data}) { return false; } %}
    | "null" {% function({data}) { return null; } %}

number -> %number {% function({data}) { return parseFloat(data[0].value) } %}

string -> %string {% function({data}) { return JSON.parse(data[0].value) } %}

pair -> key _ ":" _ value {% function({data}) { return [data[0], data[4]]; } %}

key -> string {% id %}

_ -> null | %space {% function({data}) { return null; } %}

@{%

function extractPair(kv, output) {
    if(kv[0]) { output[kv[0]] = kv[1]; }
}

function extractObject({data}) {
    let output = {};

    extractPair(data[2], output);

    for (let i in data[3]) {
        extractPair(data[3][i][3], output);
    }

    return output;
}

function extractArray({data}) {
    let output = [data[2]];

    for (let i in data[3]) {
        output.push(data[3][i][3]);
    }

    return output;
}

%}
