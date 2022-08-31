import { readFileSync, writeFileSync } from "fs";
import { CompileStates } from "./src/lexers/stateful-lexer";
const States = [
    {
        name: "start",
        rules: [
            { import: ["string", "js_pre", "ws", "comment"] },
            { when: /lexer(?![a-zA-Z\d_])/, type: "K_LEXER", goto: "lexer_pre" },
            { when: /grammar(?![a-zA-Z\d_])/, type: "K_GRAMMAR", goto: "grammar_pre" },
            { when: /config(?![a-zA-Z\d_])/, type: "K_CONFIG", goto: "config_pre" },
            { import: ["k_config", "k_import", "k_head", "k_body", "kv"] },
        ]
    },
    {
        name: "config_pre",
        rules: [
            { import: ["ws"] },
            { when: "{{", type: "L_TEMPLATEL", set: "config" }
        ],

    }, {
        name: "config",
        rules: [
            { import: ["comment", "kv"] },
            { when: "}}", type: "L_TEMPLATER", pop: 1 }
        ]
    },
    {
        name: "grammar_pre",
        rules: [
            { import: ["ws"] },
            { when: "{{", type: "L_TEMPLATEL", set: "grammar" }
        ],

    }, {
        name: "grammar",
        rules: [
            { import: ["comment", "js_pre", "js_templatepre", "ws", "regex", "charclass", "l_ebnf_0", "l_ebnf_1n", "l_ebnf_0n", "kv", "l_colon", "l_comma", "l_pipe", "l_parenl", "l_parenr", "l_arrow", "l_dsign", "l_dash",] },
            { when: "}}", type: "L_TEMPLATER", pop: 1 }
        ]
    },
    {
        name: "lexer_pre",
        rules: [
            { import: ["ws"] },
            { when: "{{", type: "L_TEMPLATEL", set: "lexer" }
        ],

    }, {
        name: "lexer",
        rules: [
            { import: ["ws", "kv", "regex", "l_comma", "l_arrow", "l_dash", "comment", "js_pre"] },
            { when: "}}", type: "L_TEMPLATER", pop: 1 }
        ]
    },
    {
        name: "js_pre",
        rules: [{ when: "${", type: "L_JSL", goto: "js_wrap" }]
    }, {
        name: "js_wrap",
        default: "T_JSBODY",
        unmatched: "T_JSBODY",
        rules: [
            { import: ["jsignore"] },
            { when: "{", goto: "js", type: "T_JSBODY" },
            { when: "}", type: "L_JSR", pop: 1 },
        ]
    },
    {
        name: "js",
        unmatched: "T_JSBODY",
        default: "T_JSBODY",
        rules: [
            { import: ["jsignore"] },
            { when: "{", goto: "js", type: "T_JSBODY" },
            { when: "}", pop: 1, type: "T_JSBODY" }
        ]
    },
    {
        name: "js_templatepre",
        rules: [{ when: "{{", type: "L_TEMPLATEL", goto: "js_templatewrap" }]
    }, {
        name: "js_templatewrap",
        unmatched: "T_JSBODY",
        default: "T_JSBODY",
        rules: [
            { import: ["jsignore"] },
            { when: "{", goto: "js", type: "T_JSBODY" },
            { when: "}}", type: "L_TEMPLATER", pop: 1 },
        ]
    },
    { name: "kv", rules: [{ import: ["string", "ws", "word", "l_colon", "integer"] }] },
    {
        name: "jsignore",
        rules: [
            { when: /"(?:[^"\\]|\\.)*"/, type: "T_JSBODY" },
            { when: /'(?:[^'\\]|\\.)*'/, type: "T_JSBODY" },
            { when: /`(?:[^`\\]|\\.)*`/, type: "T_JSBODY" },
            { when: /\/(?:[^\/\\]|\\.)+\/[gmiyu]*/, type: "T_JSBODY" },
            { when: /\/\/[\n]*/, type: "T_JSBODY" },
            { when: /\/\*.*\*\//, type: "T_JSBODY" }
        ]
    },

    { name: "string", rules: [{ when: /"(?:[^"\\]|\\.)*"/, type: "T_STRING" }] },
    { name: "string2", rules: [{ when: /'(?:[^'\\]|\\.)*'/, type: "T_STRING" }] },
    { name: "string3", rules: [{ when: /`(?:[^`\\]|\\.)*`/, type: "T_STRING" }] },
    { name: "charclass", rules: [{ when: /\[(?:[^\]\\]|\\.)+\]/, type: "T_CHARCLASS" }] },
    { name: "regex", rules: [{ when: /\/(?:[^\/\\]|\\.)+\/[gmiyu]*/, type: "T_REGEX" }] },
    { name: "integer", rules: [{ when: /\d+/, type: "integer" }] },
    { name: "word", rules: [{ when: /[a-zA-Z_][a-zA-Z_\d]*/, type: "T_WORD" }] },
    { name: "ws", rules: [{ when: /\s+/, type: "T_WS" }] },
    { name: "k_all", rules: [{ when: /all(?![a-zA-Z\d_])/, type: "K_ALL" }] },
    { name: "k_tag", rules: [{ when: /tag(?![a-zA-Z\d_])/, type: "K_TAG" }] },
    { name: "k_type", rules: [{ when: /type(?![a-zA-Z\d_])/, type: "K_TYPE" }] },
    { name: "k_when", rules: [{ when: /when(?![a-zA-Z\d_])/, type: "K_WHEN" }] },
    { name: "k_pop", rules: [{ when: /pop(?![a-zA-Z\d_])/, type: "K_POP" }] },
    { name: "k_inset", rules: [{ when: /inset(?![a-zA-Z\d_])/, type: "K_INSET" }] },
    { name: "k_set", rules: [{ when: /set(?![a-zA-Z\d_])/, type: "K_SET" }] },
    { name: "k_goto", rules: [{ when: /goto(?![a-zA-Z\d_])/, type: "K_GOTO" }] },
    { name: "k_config", rules: [{ when: /config(?![a-zA-Z\d_])/, type: "K_CONFIG" }] },
    { name: "k_lexer", rules: [{ when: /lexer(?![a-zA-Z\d_])/, type: "K_LEXER" }] },
    { name: "k_grammar", rules: [{ when: /grammar(?![a-zA-Z\d_])/, type: "K_GRAMMAR" }] },
    { name: "k_import", rules: [{ when: /import(?![a-zA-Z\d_])/, type: "K_IMPORT" }] },
    { name: "k_body", rules: [{ when: /body(?![a-zA-Z\d_])/, type: "K_BODY" }] },
    { name: "k_head", rules: [{ when: /head(?![a-zA-Z\d_])/, type: "K_HEAD" }] },

    { name: "l_colon", rules: [{ when: ":", type: "L_COLON" }] },
    { name: "l_ebnf_0", rules: [{ when: ":?", type: "L_EBNF_0" }] },
    { name: "l_ebnf_1n", rules: [{ when: ":+", type: "L_EBNF_1N" }] },
    { name: "l_ebnf_0n", rules: [{ when: ":*", type: "L_EBNF_0N" }] },
    { name: "l_comma", rules: [{ when: ",", type: "L_COMMA" }] },
    { name: "l_pipe", rules: [{ when: "|", type: "L_PIPE" }] },
    { name: "l_parenl", rules: [{ when: "(", type: "L_PARENL" }] },
    { name: "l_parenr", rules: [{ when: ")", type: "L_PARENR" }] },
    { name: "l_templatel", rules: [{ when: "{{", type: "L_TEMPLATEL" }] },
    { name: "l_templater", rules: [{ when: "}}", type: "L_TEMPLATER" }] },
    { name: "l_arrow", rules: [{ when: "->", type: "L_ARROW" }] },
    { name: "l_dsign", rules: [{ when: "$", type: "L_DSIGN" }] },
    { name: "l_dash", rules: [{ when: "-", type: "L_DASH" }] },
    { name: "comment", rules: [{ when: /\/\/[\n]*/, type: "T_COMMENT" }] },
    { name: "commentmulti", rules: [{ when: /\/\*.*\*\//, type: "T_COMMENT" }] }
]
let file = '';
for (const state of States) {
    WriteLine(`${state.name} ->`);
    if (state.default) {
        WriteLine(`\tdefault: "${state.default}"`)
    }
    if (state.unmatched) {
        WriteLine(`\tunmatched: "${state.unmatched}"`)
    }
    for (const rule of state.rules) {
        let s = '\t-';
        if ("import" in rule) {
            s += ` import: ${Print(rule.import)}`;
        }
        if ("when" in rule) {
            s += ` when: ${Print(rule.when)}`;
        }
        if ("type" in rule) {
            s += ` type: ${Print(rule.type)}`;
        }
        if ("pop" in rule) {
            s += ` pop: ${Print(rule.pop)}`;
        }
        if ("goto" in rule) {
            s += ` goto: ${rule.goto}`;
        }
        WriteLine(s);
    }
}
writeFileSync('./out.txt', file);


// const lexer = CompileStates(States, "start");
// const s = readFileSync('./src/grammars/grammar-well.gwell', 'utf-8')
// lexer.feed(s)
// let next = lexer.next();
// while (next) {
//     console.log({ type: next.type, value: next.value });
//     next = lexer.next();
// }
function WriteLine(s) {
    file += s + '\n';
}

function Print(val) {
    if (val instanceof RegExp) {
        return `/${val.source}/`;
    }
    if (typeof val == 'string') {
        return JSON.stringify(val);
    }
    if (typeof val == 'number') {
        return val;
    }
    if (Array.isArray(val)) {
        return val.join(', ');
    }
}