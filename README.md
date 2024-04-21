# Grammar Well

Grammar Well is a cross-platform compiler, parser, and/or interpreter. It originated as a port of the popular library [Nearley](https://github.com/kach/nearley) to TypeScript but has since evolved to include additional functionality, such as a built-in lexer and support for various parsing algorithms including LR0 and CKY. It also offers a range of quality of life features.

Check out the Demo/Live Editor https://0x6563.github.io/grammar-well-editor

# Quick Start
### Install
`npm i grammar-well`

### Example

```Javascript
import { Compile, Parse } from 'grammar-well';

async function GrammarWellRunner(source, input) {
    function Evalr(source) {
        const module = { exports: null };
        eval(source);
        return module.exports;
    }
    const compiled = await Compile(source, { exportName: 'grammar' });
    return Parse(Evalr(compiled)(), input, { algorithm: 'earley' });
}


const source = `lexer: {{
    start: "json"

    json ->
        - when: /\s+/ tag: "space"
        - when: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/ tag: "number"
        - when: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/ tag: "string"
        - when: "{" tag: "{"
        - when: "}" tag: "}"
        - when: "[" tag: "["
        - when: "]" tag: "]"
        - when: "," tag: ","
        - when: ":" tag: ":"
        - when: "true" tag: "true"
        - when: "false" tag: "false"
        - when: "null" tag: "null"
}}

grammar: {{
    json -> _ (object | array) _ : {{ $1[0] }}

    object -> "{" _ "}" : {{ {} }}
        | "{" _ pair (_ "," _ pair)* _ "}" : \${ extractObject }

    array -> "[" _ "]" : {{ [] }}
        | "[" _ value (_ "," _ value)* _ "]" : \${ extractArray }

    value : {{ $0 }} ->
        object
        | array
        | number
        | string
        | "true" : {{ true }}
        | "false" : {{ false }}
        | "null" : {{ null }}

    number -> $number : {{ parseFloat($0.value) }}

    string -> $string : {{ JSON.parse($0.value) }}

    pair -> key:k _ ":" _ value:v : {{ [$k, $v] }}

    key -> string : {{ $0 }}

    _ -> $space? : {{ null }}
}}

head: \${

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
}
`

const input = `{"a":"string","b":true,"c":2}`


console.log(await GrammarWellRunner(source, input))
```

# Quick Guide
Below is a quick guide highlighting some of the grammars features.

# Terminology
Thse are some terms you may find used around the documentation.
#### Word
A **word** refers to an alphanumeric string that matches `/[a-zA-Z_][a-zA-Z_\d]*/`

#### Symbol
A **Symbol** refers to **Terminals** and **Non Terminals** found in EBNF expressions.

# Grammar Sections
Grammar Well's grammar is broken into 4 sections **head**, **body**, **lexer**, and **grammar** 
.
## Head/Body
Both the **head** and **body** section have the same syntax. These sections refer to literal javascript to embed in the compiled version of the grammar. The difference between the two is that **head** will be placed outside of the parse function and the **body** will be plaed within the parse function. This allows to have static variables that are persisted across executions, or not, depending on your use case.

_example using both head and body to keep track the number of parses_
```
head: ${
    let parses = 0;

    export function GetParseCount(){
        return parses;
    }
}

body :${
    parses++;
}
```


## Lexer
Grammar Well utilizes a stateful lexer, which is optional but highly recommended due to its significant assistance in constructing production rules for the grammar. The lexer configuration comprises two subsections: config and states. It is important to note that the configuration section must be placed at the top. **Currently**, the sole configuration option available is the optional setting start, which determines the initial lexer state to begin with.

 ```
 lexer: {{
    start: "root"

    root ->
        - import: string, ws
        - when: /\/(?:[^\/\\\r\n]|\\.)+\// tag: "REGEX" highlight: "regexp"
        - when: "{" tag: "CURLY_L" goto: body

    body->
        - import: string, ws
        - when: "}" tag: "CURLY_R" pop: 1

    string ->
        - when: /"(?:[^"\\\r\n]|\\.)*"/ tag: "T_STRING" highlight: "string"

    ws ->
        - when: /\s+/ tag: "T_WS"
 }}
 ```
In the above example, we start with a state named `root` followed by `-` delimited list of rules. There are two type of rules _import_ rules and _token matching_ rules. Order is important.

### Import Rule
```
- import: string, ws
```
The first rule we see is in the example is an _import_ rule. The import rule expects a comma delimited list of states whose rules are to be imported in to this state. This is a convenient way of keeping your rules DRY.

### Token Matching Rule
```
- when: /\/(?:[^\/\\\r\n]|\\.)+\// tag: "REGEX" highlight: "regexp"
- when: "{" tag: "CURLY_L" goto: body

```
This other rules we see in the example are _token matching_ rules. As the name implies, we declare what to match in the input stream. Below is a list of fields that are available.

#### Fields
- `when` [ _string | regex_] **required, exclusive with before** what to match in the input stream
- `before` [_string | regex_] **required, exclusive with when** what to match but does not consume the input stream, should be used in conjunction with stack manipulation
- `tag` [_comma delimited strings_] Applies tags to the matched token, these can be referenced in the grammar
- `goto` [_word_] Moves to the defined state and adds the current state onto the stack
- `pop` [_number|nothing_] Pops 1 or the number of states off the stack
- `highlight` [_string_] This isn't used directly but can be used to help generate syntax highlighting.
- `inset` [_number|nothing_] Adds the current state onto the stack 1 or the number of times defined.

# Grammar
The **grammar** section is heavily based on the EBNF notation with some additional syntax to help with generating output. If you aren't familiar with EBNF it would be good to start there before continuing. 

The basic syntax is a **Rule Name** followed by `->` and then a **Expression** (combinations of **Terminals** and **Non Terminals**). Multiple expressions can be declared for a rule by seperating them with a `|`. Depending on the parsing algorithm you choose there maybe additional constraints on the expression.

_In this example.
There are 4 Non Terminals; `Start`, `HelloGoodbye`, `Target`, and `__`. 
As well as 5 Terminals; `"Hello"`, `"Goodbye"`, `"World"`, `/[a-zA-Z]+/`, and `$ws`_
``` 
Start -> HelloGoodbye __ Target

HelloGoodbye -> "Hello"
    | "Goodbye"

Target -> "World" 
    | /[a-zA-Z]+/

__ -> $ws
```
### Post Processors
In addition to the standard anatomy of EBNF. Grammar Well supports **Post Processors**. **Post Processors** are used to either evaluate or transform a matched expression. They can follow a rule name but before the `->` seperator to apply to each expression as the default but overridable postprocessor. They can follow an expression to only apply to that segment.

_In this example, you see two different types of post processors_
```
Target : ${ ({data}) => data[0].value } -> 
    "World"
    | /[a-zA-Z]+/ : {{ $0.value }}
```
 
**JavaScript Literal** ` : ${ JavaScriptFunction }`

The JavaScript Literal versions expects a JavaScript function.

**JavaScript Template** ` : {{ JavaScriptFunctionBody }}`

**Ordinal References**

The Javascript Template version expects a function body and is provided a variable `data`. It will also do simple string replacements. For example any `$` followed by a number will be replaced with `data[number]`.

_example displaying different syntax but equal functionality_
```
Rule -> "Hello" : {{ $0.value }}

Rule -> "Hello" : ${ ({data}) => data[0].value }
```

**Aliased References**

Keeping tracking of the ordinal index of your symbols in an expression can be tedious, so Grammar Well also provides aliasing. Any symbol in an expression can be suffixed with `:word`. That **word** can then be referenced in the template. 

_example displaying different syntax but equal functionality_
```
Rule-> "Hello":hello : {{ $hello.value }}

Rule-> "Hello" : ${ ({data}) => data[0].value }
```



### Rule Name
The name of a rule must be a **word** (regex: `/[a-zA-Z_][a-zA-Z_\d]+/`)


### Expression
Besides having Terminals and Non Terminals. Each expression can also be followed by a **PostProcessor**.

_example of a rule with 2 expressions with postprocessors for each_
```
Target -> "World" : ${ (data) => data[0].value }
    | /[a-zA-Z]+/ : {{ $0.value }}
```

### Non Terminals
**Non Terminals** are simple. They are **word**s that refer to another rule. 

### Terminals
There are three different types of terminals that Grammar Well supports:

**Literals**

Literals are double quoted strings that are case strings that are matched in the lexer stream. Optionaly strings can be modified to allow case insensitive matching by appending an `i` after the end quote. 

_example of having a case insensitive literal_
```
Rule-> "Hello"i
```
**Regular Expressions** 

Grammar Well is written in TypeScript, which leads two things.
1. The syntax for regex matches that of JavaScript.
2. It is limited to the capabilities of JavaScript's regex.

```
Rule-> /[a-zA-Z]+/
```

**Token Tags** 

If the lexer is used than you can refer to the tags defined by prefixing their name with an `$`

```
Rule-> $token
```

### Grouping
Symbols can be grouped with `()` seperating each option with a `|`
```
Rule -> ("Hello" | "Goodbye")
```
### Modifiers
EBNF modifiers like `?`,`*`, and `+` are all supported 
```
Whitespace -> " "*
```
### Aliasing
As noted above in post processors alias allow named references to symbols to be used with in a template
```
Rule-> "Hello":hello : {{ $hello.value }}
```

# The Big Example 
_Grammar Well's Grammar File_

```
lexer: {{
    start: "start"

    start ->
        - import: string, js, ws, comment, l_scolon, l_star
        - when: /lexer(?![a-zA-Z\d_])/ tag: "T_WORD" goto: lexer highlight: "type"
        - when: /grammar(?![a-zA-Z\d_])/ tag: "T_WORD" goto: grammar highlight: "type"
        - when: /config(?![a-zA-Z\d_])/ tag: "T_WORD" goto: config highlight: "type"
        - import: kv
    config ->
        - import: ws, l_colon
        - when: "{{" tag: "L_TEMPLATEL" set: config_inner
    config_inner ->
        - import: comment, kv
        - when: "}}" tag: "L_TEMPLATER" pop: 1
    grammar ->
        - import: ws, l_colon
        - when: "{{" tag: "L_TEMPLATEL" set: grammar_inner
    grammar_inner ->
        - import: comment, js, js_template, ws, regex, l_qmark, l_plus, l_star, kv, l_colon, l_comma, l_pipe, l_parenl, l_parenr, l_arrow, l_dsign, l_dash
        - when: "}}" tag: "L_TEMPLATER" pop: 1
    lexer ->
        - import: ws, l_colon
        - when: "{{" tag: "L_TEMPLATEL" set: lexer_inner
    lexer_inner ->
        - import: ws, comment, regex, l_comma, l_arrow, l_dash, kv, js
        - when: "}}" tag: "L_TEMPLATER" pop: 1
    js ->
        - when: "${" tag: "L_JSL" goto: js_wrap
    js_wrap ->
        default: "T_JSBODY"
        unmatched: "T_JSBODY"
        - import: jsignore
        - when: "{" tag: "T_JSBODY" goto: js_literal
        - when: "}" tag: "L_JSR" pop: 1
    js_literal ->
        default: "T_JSBODY"
        unmatched: "T_JSBODY"
        - import: jsignore
        - when: "{" tag: "T_JSBODY" goto: js_literal
        - when: "}" tag: "T_JSBODY" pop: 1
    js_template ->
        - when: "{{" tag: "L_TEMPLATEL" goto: js_template_inner
    js_template_inner ->
        default: "T_JSBODY"
        unmatched: "T_JSBODY"
        - import: jsignore
        - when: "{" tag: "T_JSBODY" goto: js_literal
        - when: "}}" tag: "L_TEMPLATER" pop: 1
    kv ->
        - import: string, ws, word, l_colon, integer
    jsignore ->
        - when: /"(?:[^"\\\r\n]|\\.)*"/ tag: "T_JSBODY"
        - when: /'(?:[^'\\\r\n]|\\.)*'/ tag: "T_JSBODY"
        - when: /`(?:[^`\\]|\\.)*`/ tag: "T_JSBODY"
        - when: /\/(?:[^\/\\\r\n]|\\.)+\/[gmiyu]*/ tag: "T_JSBODY"
        - when: /\/\/[^\n]*/ tag: "T_JSBODY"
        - when: /\/\*.*\*\// tag: "T_JSBODY"
    string ->
        - when: /"(?:[^"\\\r\n]|\\.)*"/ tag: "T_STRING" highlight: "string"
    string2 ->
        - when: /'(?:[^'\\\r\n]|\\.)*'/ tag: "T_STRING" highlight: "string"
    string3 ->
        - when: /`(?:[^`\\]|\\.)*`/ tag: "T_STRING" highlight: "string"
    regex ->
        - when: /\/(?:[^\/\\\r\n]|\\.)+\// tag: "T_REGEX" highlight: "regexp"
    integer ->
        - when: /\d+/ tag: "T_INTEGER" highlight: "number"
    word ->
        - when: /[a-zA-Z_][a-zA-Z_\d]*/ tag: "T_WORD"
    ws ->
        - when: /\s+/ tag: "T_WS"
    l_colon ->
        - when: ":" tag: "L_COLON" highlight: "keyword"
    l_scolon ->
        - when: ";" tag: "L_SCOLON"
    l_qmark ->
        - when: "?" tag: "L_QMARK"
    l_plus ->
        - when: "+" tag: "L_PLUS"
    l_star ->
        - when: "*" tag: "L_STAR"
    l_comma ->
        - when: "," tag: "L_COMMA"
    l_pipe ->
        - when: "|" tag: "L_PIPE" highlight: "keyword"
    l_parenl ->
        - when: "(" tag: "L_PARENL"
    l_parenr ->
        - when: ")" tag: "L_PARENR"
    l_templatel ->
        - when: "{{" tag: "L_TEMPLATEL"
    l_templater ->
        - when: "}}" tag: "L_TEMPLATER"
    l_arrow ->
        - when: "->" tag: "L_ARROW" highlight: "keyword"
    l_dsign ->
        - when: "$" tag: "L_DSIGN"
    l_dash ->
        - when: "-" tag: "L_DASH"
    comment ->
        - when: /\/\/[^\n]*/ tag: "T_COMMENT" highlight: "comment"
    commentmulti ->
        - when: /\/\*.*\*\// tag: "T_COMMENT" highlight: "comment"

}}

grammar: {{

    main ->
        _ section_list _ : {{ $1 }}

    section_list ->
        section : {{ [$0] }}
        | section T_WS section_list : {{ [$0].concat($2) }}

    section ->
        K_CONFIG _ L_COLON _ L_TEMPLATEL _ kv_list:list _ L_TEMPLATER : {{ { config: Object.assign(...$list) } }}
        | K_IMPORT _ L_STAR _ K_FROM __ T_WORD:import _ L_SCOLON : {{ { import: $import } }}
        | K_IMPORT _ L_STAR _ K_FROM __ T_STRING:import _ L_SCOLON : {{ { import: $import, path: true } }}
        | K_LEXER _ L_COLON _ L_TEMPLATEL _ lexer:lexer _ L_TEMPLATER : {{ { lexer: Object.assign(...$lexer) } }}
        | K_GRAMMAR _ L_COLON _ L_TEMPLATEL _ grammar:grammar _ L_TEMPLATER : {{ { grammar: $grammar } }}
        | K_BODY _ L_COLON _ T_JS:js : {{ { body: $js } }}
        | K_BODY _ L_COLON _ T_STRING:js : {{ { body: $js, path: true } }}
        | K_HEAD _ L_COLON _ T_JS:js : {{ { head: $js } }}
        | K_HEAD _ L_COLON _ T_STRING:js : {{ { head: $js, path: true } }}

    lexer ->
        kv_list _ state_list : {{ $0.concat({ states: $2 }) }}
        | state_list : {{ [{ states: $0 }] }}

    state_list ->
        state : {{ data }}
        | state _ state_list : {{ [$0].concat($2) }}

    state ->
        state_declare _ state_definition : {{ Object.assign({ name: $0 }, $2) }}

    state_declare ->
        T_WORD _ L_ARROW : {{ $0 }}

    state_definition ->
        kv_list _ token_list : {{ Object.assign(...$0, { rules: $2 }) }}
        | token_list : {{ { rules: $0 } }}

    token_list ->
        token : {{ data }}
        | token _ token_list : {{ [$0].concat($2) }}

    token ->
        L_DASH _ K_IMPORT _ L_COLON _ word_list : {{ { import: $6 } }}
        | L_DASH _ token_definition_list : {{ Object.assign(...$2) }}

    token_definition_list ->
        token_definition : {{ data }}
        | token_definition _ token_definition_list : {{ [$0].concat($2) }}

    token_definition ->
        K_TAG _ L_COLON _ string_list : {{ { tag: $4 } }}
        | K_WHEN _ L_COLON _ T_STRING : {{ { when: $4 } }}
        | K_WHEN _ L_COLON _ T_REGEX : {{ { when: $4 } }}
        | K_POP : {{ { pop: 1 } }}
        | K_POP _ L_COLON _ T_INTEGER : {{ { pop: parseInt($4) } }}
        | K_POP _ L_COLON _ K_ALL : {{ { pop: "all" } }}
        | K_HIGHLIGHT _ L_COLON _ T_STRING : {{ { highlight: $4 } }}
        | K_INSET : {{ { inset: 1 } }}
        | K_INSET _ L_COLON _ T_INTEGER : {{ { inset: parseInt($4) } }}
        | K_SET _ L_COLON _ T_WORD : {{ { set: $4 } }}
        | K_GOTO _ L_COLON _ T_WORD : {{ { goto: $4 } }}
        | K_TYPE _ L_COLON _ T_STRING : {{ { type: $4 } }}

    grammar ->
        kv_list _ grammar_rule_list : {{ { config: Object.assign(...$0), rules: $2 } }}
        | grammar_rule_list : {{ { rules: $0 } }}

    grammar_rule_list ->
        grammar_rule : {{ [$0] }}
        | grammar_rule _ grammar_rule_list : {{ [$0].concat($2) }}

    grammar_rule ->
        T_WORD _ L_ARROW _ expression_list : {{ { name: $0, expressions: $4 } }}
        | T_WORD  __ L_COLON _ T_JS:js _ L_ARROW _ expression_list:expressions : {{ { name: $0, expressions: $expressions, postprocess: $js } }}
        | T_WORD  __ L_COLON _ T_GRAMMAR_TEMPLATE:template _ L_ARROW _ expression_list:expressions : {{ { name: $0, expressions: $expressions, postprocess: $template } }}

    expression_list ->
        expression
        | expression_list _ L_PIPE _ expression : {{ $0.concat([$4]) }}

    expression ->
        expression_symbol_list : {{ { symbols: $0 } }}
        | expression_symbol_list __ L_COLON _ T_JS:js : {{ { symbols: $0, postprocess: $js } }}
        | expression_symbol_list __ L_COLON _ T_GRAMMAR_TEMPLATE:template : {{ { symbols: $0, postprocess: $template } }}

    expression_symbol_list ->
        expression_symbol
        | expression_symbol_list T_WS expression_symbol : {{ $0.concat([$2]) }}


    expression_symbol ->
        expression_symbol_match : {{ $0 }}
        | expression_symbol_match L_COLON T_WORD : {{ { ...$0,  alias: $2 } }}
        | expression_symbol_match expression_repeater : {{ { expression: $0, repeat: $1 } }}
        | expression_symbol_match expression_repeater L_COLON T_WORD : {{ { expression: $0, repeat: $1, alias: $4 } }}


    expression_symbol_match ->
        T_WORD : {{ { rule: $0 } }}
        | T_STRING "i"? : {{ { literal: $0, insensitive: !!$1 } }}
        | L_DSIGN T_WORD : {{ { token: $1} }}
        | L_DSIGN T_STRING : {{ { token: $1} }}
        | T_REGEX : {{ $0 }}
        | L_PARENL _ expression_list _ L_PARENR : {{ { subexpression: $2 } }}
        | T_JS : {{ $0 }}

    expression_repeater : {{ $0[0].value }} ->
        L_QMARK
        | L_PLUS
        | L_STAR

    kv_list ->
        kv : {{ data }}
        | kv _ kv_list : {{ [$0].concat($2) }}

    kv ->
        T_WORD _ L_COLON _ ( T_WORD| T_STRING| T_INTEGER | T_JS | T_GRAMMAR_TEMPLATE) : {{ { [$0]: $4[0] } }}

    string_list ->
        T_STRING : {{ [$0] }}
        | T_STRING _ L_COMMA _ string_list : {{ [$0].concat($4) }}

    word_list ->
        T_WORD : {{ [$0] }}
        | T_WORD _ L_COMMA _ word_list : {{ [$0].concat($4) }}

    _ ->
        ( T_WS | T_COMMENT )* : {{ null }}

    __ ->
        ( T_WS | T_COMMENT )+ : {{ null }}

    L_COLON -> $L_COLON
    L_SCOLON -> $L_SCOLON
    L_QMARK -> $L_QMARK
    L_PLUS -> $L_PLUS
    L_STAR -> $L_STAR
    L_COMMA -> $L_COMMA
    L_PIPE -> $L_PIPE
    L_PARENL -> $L_PARENL
    L_PARENR -> $L_PARENR
    L_TEMPLATEL -> $L_TEMPLATEL
    L_TEMPLATER -> $L_TEMPLATER
    L_ARROW -> $L_ARROW
    L_DSIGN -> $L_DSIGN
    L_DASH -> $L_DASH

    K_ALL -> "all"
    K_TAG -> "tag"
    K_FROM -> "from"
    K_TYPE -> "type"
    K_WHEN -> "when"
    K_POP -> "pop"
    K_HIGHLIGHT -> "highlight"
    K_INSET -> "inset"
    K_SET -> "set"
    K_GOTO -> "goto"
    K_CONFIG -> "config"
    K_LEXER -> "lexer"
    K_GRAMMAR -> "grammar"
    K_IMPORT -> "import"
    K_BODY -> "body"
    K_HEAD -> "head"

    T_JS -> $L_JSL $T_JSBODY* $L_JSR : {{ { js: $1.map(v=>v.value).join('') } }}
    T_GRAMMAR_TEMPLATE -> $L_TEMPLATEL _ $T_JSBODY* _ $L_TEMPLATER : {{ { template: $2.map(v=>v.value).join('').trim() } }}
    T_STRING -> $T_STRING : {{ JSON.parse($0.value) }}
    T_WORD -> $T_WORD : {{ $0.value }}
    T_REGEX -> $T_REGEX /[gmiuy]/* : {{ { regex: $0.value.replace(/\\\\\//g,'/').slice(1,-1), flags: $1.map(v=>v.value).join('').trim() } }}
    T_COMMENT -> $T_COMMENT
    T_INTEGER -> $T_INTEGER : {{ $0.value }}
    T_WS -> $T_WS : {{ null }}
}}

```