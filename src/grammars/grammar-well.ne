# nearley grammar
@head {%
// Head
%}


@body {%
// Body
function getValue({ data }) {
    return data[0].value;
}

function literals(list) {
    const rules = {}
    for (let lit of list) {
        rules[lit] = { match: lit, next: 'main' }
    }
    return rules;
}

const moo = require('moo');
const rules = Object.assign({
    ws: { match: /\s+/, lineBreaks: true, next: 'main' },
    comment: /\#.*/,
    arrow: { match: /[=-]+\>/, next: 'main' },
    js: {
        match: /\{\%(?:[^%]|\%[^}])*\%\}/,
        value: x => x.slice(2, -2),
        lineBreaks: true,
    }, 
    word: { match: /[\w\?\+]+/, next: 'afterWord' },
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
    "@include", "@builtin", "@head", "@body", "@",
    "]",
]));

const lexer = moo.states({
    main: Object.assign({}, rules, {
        charclass: {
            match: /\.|\[(?:\\.|[^\\\n])+?\]/,
            value: x => new RegExp(x),
        },
    }),
    // Both macro arguments and charclasses are both enclosed in [ ].
    // We disambiguate based on whether the previous token was a `word`.
    afterWord: Object.assign({}, rules, literals(['['])),
});

function insensitive({ literal }) {
    const tokens = [];
    for (let i = 0; i < literal.length; i++) {
        const c = literal.charAt(i);
        if (c.toUpperCase() !== c || c.toLowerCase() !== c) {
            tokens.push(new RegExp("[" + c.toLowerCase() + c.toUpperCase() + "]"));
        } else {
            tokens.push({ literal: c });
        }
    }
    return { subexpression: [{ tokens, postprocess: d => d.join('') }] };
}

%}

@lexer lexer

final -> _ prog _ %ws:?  {% function({data}) { return data[1]; } %}

prog -> prod  {% function({data}) { return [data[0]]; } %}
      | prod ws prog  {% function({data}) { return [data[0]].concat(data[2]); } %}

prod -> word _ %arrow _ expression+  {% function({data}) { return {name: data[0], rules: data[4]}; } %}
      | word "[" _ wordlist _ "]" _ %arrow _ expression+ {% function({data}) {return {macro: data[0], args: data[3], exprs: data[9]}} %}
      | "@" _ js {% function({data}) { return {body: data[2]}; } %}
      | "@body" _ js {% function({data}) { return {body: data[2]}; } %}
      | "@head" _ js {% function({data}) { return {head: data[2]}; } %}
      | "@include"  _ string {% function({data}) {return {include: data[2].literal, builtin: false}} %}
      | "@builtin"  _ string {% function({data}) {return {include: data[2].literal, builtin: true }} %}
      | "@" word ws word  {% function({data}) { return {config: data[1], value: data[3]}; } %}

expression+ -> completeexpression
             | expression+ _ "|" _ completeexpression  {% function({data}) { return data[0].concat([data[4]]); } %}

expressionlist -> completeexpression
             | expressionlist _ "," _ completeexpression {% function({data}) { return data[0].concat([data[4]]); } %}

wordlist -> word
            | wordlist _ "," _ word {% function({data}) { return data[0].concat([data[4]]); } %}

completeexpression -> expr  {% function({data}) { return {tokens: data[0]}; } %}
                    | expr _ js  {% function({data}) { return {tokens: data[0], transform: data[2]}; } %}

expr_member ->
      word {% ({data}) => data[0] %}
    | "$" word {% function({data}) {return {mixin: data[1]}} %}
    | word "[" _ expressionlist _ "]" {% function({data}) {return {macrocall: data[0], args: data[3]}} %}
    | string "i":? {% function({data}) { if (data[1]) {return insensitive(data[0]); } else {return data[0]; } } %}
    | "%" word {% function({data}) {return {token: data[1]}} %}
    | charclass {% ({data}) => data[0] %}
    | "(" _ expression+ _ ")" {% function({data}) {return {'subexpression': data[2]} ;} %}
    | expr_member _ ebnf_modifier {% function({data}) {return {'ebnf': data[0], 'modifier': data[2]}; } %}

ebnf_modifier -> ":+" {% getValue %} | ":*" {% getValue %} | ":?" {% getValue %}

expr -> expr_member
      | expr ws expr_member  {% function({data}){ return data[0].concat([data[2]]); } %}

word -> %word {% getValue %}

string -> %string {% ({data}) => ({literal: data[0].value}) %}
        | %btstring {% ({data}) => ({literal: data[0].value}) %}

charclass -> %charclass  {% getValue %}

js -> %js  {% getValue %}

_ -> ws:?

ws -> %ws
      | %ws:? %comment _

