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
        ws: {
            match: /\s+/,
            lineBreaks: true, next: 'main' },
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

    const moostates = moo.states({
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

    const lexer = {
        next() {
            const n = moostates.next();
            console.log('next:',n);
            if (n)
                return {
                    type: n.type,
                    value: n.value,
                    offset: n.offset,
                    line: n.line,
                    column: n.col,
                };
        },
        feed(string, state) {
            return moostates.reset(string, state);
        },
        state() {
            return moostates.save();
        },
        has(s){
            return moostates.has(s)
        }
    }
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
        return { subexpression: [{ tokens, postprocess: ({data}) => data.join('') }] };
    }

%}

@lexer lexer

final ->
      _ prog _ %ws:?  {% ({data}) => { return data[1] } %}

prog -> 
    prod {% ({data}) => { return [data[0]] } %}
    | prod ws prog  {% ({data}) => { return [data[0]].concat(data[2]) } %}

prod ->
      word _ %arrow _ expression+ {% ({data}) => { return { name: data[0], rules: data[4] }} %}
    | word "[" _ wordlist _ "]" _ %arrow _ expression+ {% ({data}) => { return { macro: data[0], args: data[3], exprs: data[9] }} %}
    | "@" _ js {% ({data}) => { return { body: data[2] }} %}
    | "@body" _ js {% ({data}) => { return { body: data[2] }} %}
    | "@head" _ js {% ({data}) => { return { head: data[2] }} %}
    | "@include" _ string {% ({data}) => { return { include: data[2].literal, builtin: false }} %}
    | "@builtin" _ string {% ({data}) => { return { include: data[2].literal, builtin: true }} %}
    | "@" word ws word {% ({data}) => { return { config: data[1], value: data[3] }} %}

expression+ -> 
      completeexpression
    | expression+ _ "|" _ completeexpression {% ({data}) => { return data[0].concat([data[4]]) } %}

expressionlist ->
      completeexpression
    | expressionlist _ "," _ completeexpression {% ({data}) => { return data[0].concat([data[4]]) } %}

wordlist -> 
      word
    | wordlist _ "," _ word {% ({data}) => { return data[0].concat([data[4]]) } %}

completeexpression -> 
      expr {% ({data}) => { return { tokens: data[0] }} %}
    | expr _ js {% ({data}) => { return { tokens: data[0], postprocess: data[2] }} %}

expr_member ->
      word {% ({data}) => data[0] %}
    | "$" word {% ({data}) => { return { mixin: data[1] }} %}
    | word "[" _ expressionlist _ "]" {% ({data}) => { return { macrocall: data[0], args: data[3] }} %}
    | string "i":? {% ({data}) => { return data[1] ? insensitive(data[0]) : data[0] } %}
    | "%" word {% ({data}) => { return {token: data[1]}} %}
    | charclass {% ({data}) => data[0] %}
    | "(" _ expression+ _ ")" {% ({data}) => { return { 'subexpression': data[2] }} %}
    | expr_member _ ebnf_modifier {% ({data}) => { return { 'ebnf': data[0], 'modifier': data[2] }} %}

ebnf_modifier -> 
      ":+" {% getValue %} 
    | ":*" {% getValue %} 
    | ":?" {% getValue %}

expr ->
      expr_member
    | expr ws expr_member  {% ({data}) => { return data[0].concat([data[2]]) } %}

word ->
      %word {% getValue %}

string ->
      %string {% ({data}) => { return { literal: data[0].value} } %}
    | %btstring {% ({data}) => { return { literal: data[0].value} } %}

charclass ->
      %charclass  {% getValue %}

js -> 
      %js  {% getValue %}

_ ->
      ws:?

ws ->
      %ws
    | %ws:? %comment _

