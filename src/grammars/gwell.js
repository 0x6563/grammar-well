// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well

    function Insensitive({ literal }) {
        const symbols = [];
        for (let i = 0; i < literal.length; i++) {
            const c = literal.charAt(i);
            if (c.toUpperCase() !== c || c.toLowerCase() !== c) {
                symbols.push(new RegExp("[" + c.toLowerCase() + c.toUpperCase() + "]"));
            } else {
                symbols.push({ literal: c });
            }
        }
        return { subexpression: [{ symbols, postprocess: ({data}) => data.join('') }] };
    }

    function Rollup(ary){
        const r = {};
        for(const i of ary){
            for(const k in i){
                r[k] = i[k];
            }
        }
        return r;
    };

    function TemplatePostProcess(str){
        return "({data}) => { return " + str.replace(/\$(\d+)/g, "data[$1]") + "; }";
    }

function GWLanguage(){
    
    return {
        grammar: {
            start: "main",
            rules: {
                main: [
                    { name: "main", symbols: [ "_", "section_list", "_" ], postprocess: ({data}) => { return data[1]; } }
                ],
                section_list: [
                    { name: "section_list", symbols: [ "section" ], postprocess: ({data}) => { return [data[0]]; } },
                    { name: "section_list", symbols: [ "section", "T_WS", "section_list" ], postprocess: ({data}) => { return [data[0]].concat(data[2]); } }
                ],
                section: [
                    { name: "section", symbols: [ "K_CONFIG", "_", "L_TEMPLATEL", "_", "kv_list", "_", "L_TEMPLATER" ], postprocess: ({data}) => { return { config: Rollup(data[4]) }; } },
                    { name: "section", symbols: [ "K_LEXER", "_", "L_TEMPLATEL", "_", "lexer", "_", "L_TEMPLATER" ], postprocess: ({data}) => { return { lexer: Rollup(data[4]) }; } },
                    { name: "section", symbols: [ "K_GRAMMAR", "_", "L_TEMPLATEL", "_", "grammar", "_", "L_TEMPLATER" ], postprocess: ({data}) => { return { grammar: data[4] }; } },
                    { name: "section", symbols: [ "K_IMPORT", "_", "T_WORD" ], postprocess: ({data}) => { return { import: data[2] }; } },
                    { name: "section", symbols: [ "K_BODY", "_", "T_JS" ], postprocess: ({data}) => { return { body: data[2] }; } },
                    { name: "section", symbols: [ "K_HEAD", "_", "T_JS" ], postprocess: ({data}) => { return { head: data[2] }; } },
                    { name: "section", symbols: [ "K_IMPORT", "_", "T_STRING" ], postprocess: ({data}) => { return { import: data[2], path: true }; } },
                    { name: "section", symbols: [ "K_BODY", "_", "T_STRING" ], postprocess: ({data}) => { return { body: data[2], path: true }; } },
                    { name: "section", symbols: [ "K_HEAD", "_", "T_STRING" ], postprocess: ({data}) => { return { head: data[2], path: true }; } }
                ],
                lexer: [
                    { name: "lexer", symbols: [ "kv_list", "_", "state_list" ], postprocess: ({data}) => { return data[0].concat({ states: data[2] }); } },
                    { name: "lexer", symbols: [ "state_list" ], postprocess: ({data}) => { return [{ states: data[0] }]; } }
                ],
                state_list: [
                    { name: "state_list", symbols: [ "state" ], postprocess: ({data}) => { return data; } },
                    { name: "state_list", symbols: [ "state", "_", "state_list" ], postprocess: ({data}) => { return [data[0]].concat(data[2]); } }
                ],
                state: [
                    { name: "state", symbols: [ "state_declare", "_", "state_definition" ], postprocess: ({data}) => { return Rollup([{ name: data[0] }].concat(data[2])); } }
                ],
                state_declare: [
                    { name: "state_declare", symbols: [ "T_WORD", "_", "L_ARROW" ], postprocess: ({data}) => { return data[0]; } }
                ],
                state_definition: [
                    { name: "state_definition", symbols: [ "kv_list", "_", "token_list" ], postprocess: ({data}) => { return Rollup(data[0].concat([{rules: data[2]}])); } },
                    { name: "state_definition", symbols: [ "token_list" ], postprocess: ({data}) => { return { rules: data[0] }; } }
                ],
                token_list: [
                    { name: "token_list", symbols: [ "token" ], postprocess: ({data}) => { return data; } },
                    { name: "token_list", symbols: [ "token", "_", "token_list" ], postprocess: ({data}) => { return [data[0]].concat(data[2]); } }
                ],
                token: [
                    { name: "token", symbols: [ "L_DASH", "_", "K_IMPORT", "_", "L_COLON", "_", "word_list" ], postprocess: ({data}) => { return { import: data[6] }; } },
                    { name: "token", symbols: [ "L_DASH", "_", "token_definition_list" ], postprocess: ({data}) => { return Rollup(data[2]); } }
                ],
                token_definition_list: [
                    { name: "token_definition_list", symbols: [ "token_definition" ], postprocess: ({data}) => { return data; } },
                    { name: "token_definition_list", symbols: [ "token_definition", "_", "token_definition_list" ], postprocess: ({data}) => { return [data[0]].concat(data[2]); } }
                ],
                token_definition: [
                    { name: "token_definition", symbols: [ "K_TAG", "_", "L_COLON", "_", "string_list" ], postprocess: ({data}) => { return { tag: data[4] }; } },
                    { name: "token_definition", symbols: [ "K_WHEN", "_", "L_COLON", "_", "T_STRING" ], postprocess: ({data}) => { return { when: data[4] }; } },
                    { name: "token_definition", symbols: [ "K_WHEN", "_", "L_COLON", "_", "T_REGEX" ], postprocess: ({data}) => { return { when: data[4] }; } },
                    { name: "token_definition", symbols: [ "K_POP" ], postprocess: ({data}) => { return { pop: 1 }; } },
                    { name: "token_definition", symbols: [ "K_POP", "_", "L_COLON", "_", "T_INTEGER" ], postprocess: ({data}) => { return { pop: parseInt(data[4]) }; } },
                    { name: "token_definition", symbols: [ "K_POP", "_", "L_COLON", "_", "K_ALL" ], postprocess: ({data}) => { return { pop: "all" }; } },
                    { name: "token_definition", symbols: [ "K_INSET" ], postprocess: ({data}) => { return { inset: 1 }; } },
                    { name: "token_definition", symbols: [ "K_INSET", "_", "L_COLON", "_", "T_INTEGER" ], postprocess: ({data}) => { return { inset: parseInt(data[4]) }; } },
                    { name: "token_definition", symbols: [ "K_SET", "_", "L_COLON", "_", "T_WORD" ], postprocess: ({data}) => { return { set: data[4] }; } },
                    { name: "token_definition", symbols: [ "K_GOTO", "_", "L_COLON", "_", "T_WORD" ], postprocess: ({data}) => { return { goto: data[4] }; } },
                    { name: "token_definition", symbols: [ "K_TYPE", "_", "L_COLON", "_", "T_STRING" ], postprocess: ({data}) => { return { type: data[4] }; } }
                ],
                grammar: [
                    { name: "grammar", symbols: [ "kv_list", "_", "grammar_rule_list" ], postprocess: ({data}) => { return { config: Rollup(data[0]), rules: data[2] }; } },
                    { name: "grammar", symbols: [ "grammar_rule_list" ], postprocess: ({data}) => { return { rules: data[0] }; } }
                ],
                grammar_rule_list: [
                    { name: "grammar_rule_list", symbols: [ "grammar_rule" ], postprocess: ({data}) => { return [data[0]]; } },
                    { name: "grammar_rule_list", symbols: [ "grammar_rule", "_", "grammar_rule_list" ], postprocess: ({data}) => { return [data[0]].concat(data[2]); } }
                ],
                grammar_rule: [
                    { name: "grammar_rule", symbols: [ "T_WORD", "_", "L_ARROW", "_", "expression_list" ], postprocess: ({data}) => { return { name: data[0], rules: data[4] }; } }
                ],
                expression_list: [
                    { name: "expression_list", symbols: [ "expression" ] },
                    { name: "expression_list", symbols: [ "expression_list", "_", "L_PIPE", "_", "expression" ], postprocess: ({data}) => { return data[0].concat([data[4]]); } }
                ],
                expression: [
                    { name: "expression", symbols: [ "expression_symbol_list" ], postprocess: ({data}) => { return { symbols: data[0] }; } },
                    { name: "expression", symbols: [ "expression_symbol_list", "_", "T_JS" ], postprocess: ({data}) => { return { symbols: data[0], postprocess: data[2] }; } },
                    { name: "expression", symbols: [ "expression_symbol_list", "_", "T_GRAMMAR_TEMPLATE" ], postprocess: ({data}) => { return { symbols: data[0], postprocess: TemplatePostProcess(data[2]) }; } }
                ],
                expression_symbol_list: [
                    { name: "expression_symbol_list", symbols: [ "expression_symbol" ] },
                    { name: "expression_symbol_list", symbols: [ "expression_symbol_list", "T_WS", "expression_symbol" ], postprocess: ({data}) => { return data[0].concat([data[2]]); } }
                ],
                expression_symbol: [
                    { name: "expression_symbol", symbols: [ "T_WORD" ], postprocess: ({data}) => { return { rule: data[0] }; } },
                    { name: "expression_symbol", symbols: [ "T_STRING", "expression_symbol$RPT01x1" ], postprocess: ({data}) => { return data[1] ? Insensitive(data[0]) : { literal: data[0] }; } },
                    { name: "expression_symbol", symbols: [ "L_DSIGN", "T_WORD" ], postprocess: ({data}) => { return { token: data[1]}; } },
                    { name: "expression_symbol", symbols: [ "L_DSIGN", "T_STRING" ], postprocess: ({data}) => { return { token: data[1]}; } },
                    { name: "expression_symbol", symbols: [ "T_CHARCLASS" ], postprocess: ({data}) => { return { regex: data[0] }; } },
                    { name: "expression_symbol", symbols: [ "L_PARENL", "_", "expression_list", "_", "L_PARENR" ], postprocess: ({data}) => { return { subexpression: data[2] }; } },
                    { name: "expression_symbol", symbols: [ "expression_symbol", "expression_repeater" ], postprocess: ({data}) => { return { expression: data[0], repeat: data[1] }; } }
                ],
                expression_symbol$RPT01x1: [
                    { name: "expression_symbol$RPT01x1", symbols: [ {"literal":"i"} ], postprocess: ({data}) => data[0] },
                    { name: "expression_symbol$RPT01x1", symbols: [ ], postprocess: () => null }
                ],
                expression_repeater: [
                    { name: "expression_repeater", symbols: [ "L_REPEAT_01" ], postprocess: ({data}) => { return data[0][0].value; } },
                    { name: "expression_repeater", symbols: [ "L_REPEAT_1N" ], postprocess: ({data}) => { return data[0][0].value; } },
                    { name: "expression_repeater", symbols: [ "L_REPEAT_0N" ], postprocess: ({data}) => { return data[0][0].value; } }
                ],
                kv_list: [
                    { name: "kv_list", symbols: [ "kv" ], postprocess: ({data}) => { return data; } },
                    { name: "kv_list", symbols: [ "kv", "_", "kv_list" ], postprocess: ({data}) => { return [data[0]].concat(data[2]); } }
                ],
                kv$SUBx1: [
                    { name: "kv$SUBx1", symbols: [ "T_WORD" ] },
                    { name: "kv$SUBx1", symbols: [ "T_STRING" ] },
                    { name: "kv$SUBx1", symbols: [ "T_INTEGER" ] }
                ],
                kv: [
                    { name: "kv", symbols: [ "T_WORD", "_", "L_COLON", "_", "kv$SUBx1" ], postprocess: ({data}) => { return { [data[0]]: data[4][0] }; } }
                ],
                string_list: [
                    { name: "string_list", symbols: [ "T_STRING" ], postprocess: ({data}) => { return [data[0]]; } },
                    { name: "string_list", symbols: [ "T_STRING", "_", "L_COMMA", "_", "string_list" ], postprocess: ({data}) => { return [data[0]].concat(data[4]); } }
                ],
                word_list: [
                    { name: "word_list", symbols: [ "T_WORD" ], postprocess: ({data}) => { return [data[0]]; } },
                    { name: "word_list", symbols: [ "T_WORD", "_", "L_COMMA", "_", "word_list" ], postprocess: ({data}) => { return [data[0]].concat(data[4]); } }
                ],
                _$RPT01x1: [
                    { name: "_$RPT01x1", symbols: [ "T_WS" ], postprocess: ({data}) => data[0] },
                    { name: "_$RPT01x1", symbols: [ ], postprocess: () => null }
                ],
                _: [
                    { name: "_", symbols: [ "_$RPT01x1" ], postprocess: ({data}) => { return null; } }
                ],
                L_COLON: [
                    { name: "L_COLON", symbols: [ { token: "L_COLON" } ] }
                ],
                L_REPEAT_01: [
                    { name: "L_REPEAT_01", symbols: [ { token: "L_REPEAT_01" } ] }
                ],
                L_REPEAT_1N: [
                    { name: "L_REPEAT_1N", symbols: [ { token: "L_REPEAT_1N" } ] }
                ],
                L_REPEAT_0N: [
                    { name: "L_REPEAT_0N", symbols: [ { token: "L_REPEAT_0N" } ] }
                ],
                L_COMMA: [
                    { name: "L_COMMA", symbols: [ { token: "L_COMMA" } ] }
                ],
                L_PIPE: [
                    { name: "L_PIPE", symbols: [ { token: "L_PIPE" } ] }
                ],
                L_PARENL: [
                    { name: "L_PARENL", symbols: [ { token: "L_PARENL" } ] }
                ],
                L_PARENR: [
                    { name: "L_PARENR", symbols: [ { token: "L_PARENR" } ] }
                ],
                L_TEMPLATEL: [
                    { name: "L_TEMPLATEL", symbols: [ { token: "L_TEMPLATEL" } ] }
                ],
                L_TEMPLATER: [
                    { name: "L_TEMPLATER", symbols: [ { token: "L_TEMPLATER" } ] }
                ],
                L_ARROW: [
                    { name: "L_ARROW", symbols: [ { token: "L_ARROW" } ] }
                ],
                L_DSIGN: [
                    { name: "L_DSIGN", symbols: [ { token: "L_DSIGN" } ] }
                ],
                L_DASH: [
                    { name: "L_DASH", symbols: [ { token: "L_DASH" } ] }
                ],
                K_ALL: [
                    { name: "K_ALL", symbols: [ {"literal":"all"} ] }
                ],
                K_TAG: [
                    { name: "K_TAG", symbols: [ {"literal":"tag"} ] }
                ],
                K_TYPE: [
                    { name: "K_TYPE", symbols: [ {"literal":"type"} ] }
                ],
                K_WHEN: [
                    { name: "K_WHEN", symbols: [ {"literal":"when"} ] }
                ],
                K_POP: [
                    { name: "K_POP", symbols: [ {"literal":"pop"} ] }
                ],
                K_INSET: [
                    { name: "K_INSET", symbols: [ {"literal":"inset"} ] }
                ],
                K_SET: [
                    { name: "K_SET", symbols: [ {"literal":"set"} ] }
                ],
                K_GOTO: [
                    { name: "K_GOTO", symbols: [ {"literal":"goto"} ] }
                ],
                K_CONFIG: [
                    { name: "K_CONFIG", symbols: [ {"literal":"config"} ] }
                ],
                K_LEXER: [
                    { name: "K_LEXER", symbols: [ {"literal":"lexer"} ] }
                ],
                K_GRAMMAR: [
                    { name: "K_GRAMMAR", symbols: [ {"literal":"grammar"} ] }
                ],
                K_IMPORT: [
                    { name: "K_IMPORT", symbols: [ {"literal":"import"} ] }
                ],
                K_BODY: [
                    { name: "K_BODY", symbols: [ {"literal":"body"} ] }
                ],
                K_HEAD: [
                    { name: "K_HEAD", symbols: [ {"literal":"head"} ] }
                ],
                T_JS$RPT0Nx1: [
                    { name: "T_JS$RPT0Nx1", symbols: [ ] },
                    { name: "T_JS$RPT0Nx1", symbols: [ "T_JS$RPT0Nx1", { token: "T_JSBODY" } ], postprocess: ({data}) => data[0].concat([data[1]]) }
                ],
                T_JS: [
                    { name: "T_JS", symbols: [ { token: "L_JSL" }, "T_JS$RPT0Nx1", { token: "L_JSR" } ], postprocess: ({data}) => { return data[1].map(v=>v.value).join(''); } }
                ],
                T_GRAMMAR_TEMPLATE$RPT0Nx1: [
                    { name: "T_GRAMMAR_TEMPLATE$RPT0Nx1", symbols: [ ] },
                    { name: "T_GRAMMAR_TEMPLATE$RPT0Nx1", symbols: [ "T_GRAMMAR_TEMPLATE$RPT0Nx1", { token: "T_JSBODY" } ], postprocess: ({data}) => data[0].concat([data[1]]) }
                ],
                T_GRAMMAR_TEMPLATE: [
                    { name: "T_GRAMMAR_TEMPLATE", symbols: [ { token: "L_TEMPLATEL" }, "_", "T_GRAMMAR_TEMPLATE$RPT0Nx1", "_", { token: "L_TEMPLATER" } ], postprocess: ({data}) => { return data[2].map(v=>v.value).join('').trim(); } }
                ],
                T_STRING: [
                    { name: "T_STRING", symbols: [ { token: "T_STRING" } ], postprocess: ({data}) => { return JSON.parse(data[0].value); } }
                ],
                T_WORD: [
                    { name: "T_WORD", symbols: [ { token: "T_WORD" } ], postprocess: ({data}) => { return data[0].value; } }
                ],
                T_REGEX$RPT0Nx1: [
                    { name: "T_REGEX$RPT0Nx1", symbols: [ ] },
                    { name: "T_REGEX$RPT0Nx1", symbols: [ "T_REGEX$RPT0Nx1", /[gmiuy]/ ], postprocess: ({data}) => data[0].concat([data[1]]) }
                ],
                T_REGEX: [
                    { name: "T_REGEX", symbols: [ { token: "T_REGEX" }, "T_REGEX$RPT0Nx1" ], postprocess: ({data}) => { return { regex: data[0].value.slice(1,-1), flags: data[1].join('') }; } }
                ],
                T_COMMENT: [
                    { name: "T_COMMENT", symbols: [ { token: "T_COMMENT" } ] }
                ],
                T_CHARCLASS: [
                    { name: "T_CHARCLASS", symbols: [ { token: "T_CHARCLASS" } ], postprocess: ({data}) => { return data[0].value; } }
                ],
                T_INTEGER: [
                    { name: "T_INTEGER", symbols: [ { token: "T_INTEGER" } ], postprocess: ({data}) => { return data[0].value; } }
                ],
                T_WS: [
                    { name: "T_WS", symbols: [ { token: "T_WS" } ], postprocess: ({data}) => { return null; } }
                ]
            }
        },
        lexer: {
            start: "start",
            states: {
                start: {
                    name: "start",
                    rules: [
                        { import: ["string","js","ws","comment"] },
                        { when: /lexer(?![a-zA-Z\d_])/, type: "T_WORD", goto: "lexer" },
                        { when: /grammar(?![a-zA-Z\d_])/, type: "T_WORD", goto: "grammar" },
                        { when: /config(?![a-zA-Z\d_])/, type: "T_WORD", goto: "config" },
                        { import: ["kv"] }
                    ]
                },
                config: {
                    name: "config",
                    rules: [
                        { import: ["ws"] },
                        { when: "{{", type: "L_TEMPLATEL", set: "config_inner" }
                    ]
                },
                config_inner: {
                    name: "config_inner",
                    rules: [
                        { import: ["comment","kv"] },
                        { when: "}}", type: "L_TEMPLATER", pop: 1 }
                    ]
                },
                grammar: {
                    name: "grammar",
                    rules: [
                        { import: ["ws"] },
                        { when: "{{", type: "L_TEMPLATEL", set: "grammar_inner" }
                    ]
                },
                grammar_inner: {
                    name: "grammar_inner",
                    rules: [
                        { import: ["comment","js","js_template","ws","regex","charclass","l_repeat_01","l_repeat_1n","l_repeat_0n","kv","l_colon","l_comma","l_pipe","l_parenl","l_parenr","l_arrow","l_dsign","l_dash"] },
                        { when: "}}", type: "L_TEMPLATER", pop: 1 }
                    ]
                },
                lexer: {
                    name: "lexer",
                    rules: [
                        { import: ["ws"] },
                        { when: "{{", type: "L_TEMPLATEL", set: "lexer_inner" }
                    ]
                },
                lexer_inner: {
                    name: "lexer_inner",
                    rules: [
                        { import: ["ws","comment","regex","l_comma","l_arrow","l_dash","kv","js"] },
                        { when: "}}", type: "L_TEMPLATER", pop: 1 }
                    ]
                },
                js: {
                    name: "js",
                    rules: [
                        { when: "${", type: "L_JSL", goto: "js_wrap" }
                    ]
                },
                js_wrap: {
                    name: "js_wrap",
                    default: "T_JSBODY",
                    unmatched: "T_JSBODY",
                    rules: [
                        { import: ["jsignore"] },
                        { when: "{", type: "T_JSBODY", goto: "js_literal" },
                        { when: "}", type: "L_JSR", pop: 1 }
                    ]
                },
                js_literal: {
                    name: "js_literal",
                    default: "T_JSBODY",
                    unmatched: "T_JSBODY",
                    rules: [
                        { import: ["jsignore"] },
                        { when: "{", type: "T_JSBODY", goto: "js_literal" },
                        { when: "}", type: "T_JSBODY", pop: 1 }
                    ]
                },
                js_template: {
                    name: "js_template",
                    rules: [
                        { when: "{{", type: "L_TEMPLATEL", goto: "js_template_inner" }
                    ]
                },
                js_template_inner: {
                    name: "js_template_inner",
                    default: "T_JSBODY",
                    unmatched: "T_JSBODY",
                    rules: [
                        { import: ["jsignore"] },
                        { when: "{", type: "T_JSBODY", goto: "js_literal" },
                        { when: "}}", type: "L_TEMPLATER", pop: 1 }
                    ]
                },
                kv: {
                    name: "kv",
                    rules: [
                        { import: ["string","ws","word","l_colon","integer"] }
                    ]
                },
                jsignore: {
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
                string: {
                    name: "string",
                    rules: [
                        { when: /"(?:[^"\\\r\n]|\\.)*"/, type: "T_STRING" }
                    ]
                },
                string2: {
                    name: "string2",
                    rules: [
                        { when: /'(?:[^'\\\r\n]|\\.)*'/, type: "T_STRING" }
                    ]
                },
                string3: {
                    name: "string3",
                    rules: [
                        { when: /`(?:[^`\\]|\\.)*`/, type: "T_STRING" }
                    ]
                },
                charclass: {
                    name: "charclass",
                    rules: [
                        { when: /\[(?:[^\]\\]|\\.)+\]/, type: "T_CHARCLASS" }
                    ]
                },
                regex: {
                    name: "regex",
                    rules: [
                        { when: /\/(?:[^\/\\\r\n]|\\.)+\//, type: "T_REGEX" }
                    ]
                },
                integer: {
                    name: "integer",
                    rules: [
                        { when: /\d+/, type: "T_INTEGER" }
                    ]
                },
                word: {
                    name: "word",
                    rules: [
                        { when: /[a-zA-Z_][a-zA-Z_\d]*/, type: "T_WORD" }
                    ]
                },
                ws: {
                    name: "ws",
                    rules: [
                        { when: /\s+/, type: "T_WS" }
                    ]
                },
                l_colon: {
                    name: "l_colon",
                    rules: [
                        { when: ":", type: "L_COLON" }
                    ]
                },
                l_repeat_01: {
                    name: "l_repeat_01",
                    rules: [
                        { when: "?", type: "L_REPEAT_01" }
                    ]
                },
                l_repeat_1n: {
                    name: "l_repeat_1n",
                    rules: [
                        { when: "+", type: "L_REPEAT_1N" }
                    ]
                },
                l_repeat_0n: {
                    name: "l_repeat_0n",
                    rules: [
                        { when: "*", type: "L_REPEAT_0N" }
                    ]
                },
                l_comma: {
                    name: "l_comma",
                    rules: [
                        { when: ",", type: "L_COMMA" }
                    ]
                },
                l_pipe: {
                    name: "l_pipe",
                    rules: [
                        { when: "|", type: "L_PIPE" }
                    ]
                },
                l_parenl: {
                    name: "l_parenl",
                    rules: [
                        { when: "(", type: "L_PARENL" }
                    ]
                },
                l_parenr: {
                    name: "l_parenr",
                    rules: [
                        { when: ")", type: "L_PARENR" }
                    ]
                },
                l_templatel: {
                    name: "l_templatel",
                    rules: [
                        { when: "{{", type: "L_TEMPLATEL" }
                    ]
                },
                l_templater: {
                    name: "l_templater",
                    rules: [
                        { when: "}}", type: "L_TEMPLATER" }
                    ]
                },
                l_arrow: {
                    name: "l_arrow",
                    rules: [
                        { when: "->", type: "L_ARROW" }
                    ]
                },
                l_dsign: {
                    name: "l_dsign",
                    rules: [
                        { when: "$", type: "L_DSIGN" }
                    ]
                },
                l_dash: {
                    name: "l_dash",
                    rules: [
                        { when: "-", type: "L_DASH" }
                    ]
                },
                comment: {
                    name: "comment",
                    rules: [
                        { when: /\/\/[\n]*/, type: "T_COMMENT" }
                    ]
                },
                commentmulti: {
                    name: "commentmulti",
                    rules: [
                        { when: /\/\*.*\*\//, type: "T_COMMENT" }
                    ]
                }
            }
        }
    }
}

export default GWLanguage;