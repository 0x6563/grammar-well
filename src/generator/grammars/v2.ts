// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well
// @ts-nocheck



class grammar {
    artifacts =  {
        grammar: {
            rules: {
                POSTPROCESSOR: [
                    { name: "POSTPROCESSOR", postprocess: ({data}) => { return ({ template: data[2].value + data[3].map(v=>v.value).join('').trim() + data[4].value}); }, symbols: [ { literal: "=>" }, "_", { literal: "(" }, "POSTPROCESSOR$RPT0Nx1", { literal: ")" } ] },
                    { name: "POSTPROCESSOR", postprocess: ({data}) => { return ({ template: data[2].value + data[3].map(v=>v.value).join('').trim() + data[4].value}); }, symbols: [ { literal: "=>" }, "_", { literal: "{" }, "POSTPROCESSOR$RPT0Nx2", { literal: "}" } ] },
                    { name: "POSTPROCESSOR", postprocess: ({data}) => { return ({ template: data[2].value + data[3].map(v=>v.value).join('').trim() + data[4].value}); }, symbols: [ { literal: "=>" }, "_", { literal: "[" }, "POSTPROCESSOR$RPT0Nx3", { literal: "]" } ] },
                    { name: "POSTPROCESSOR", postprocess: ({data}) => { return ({ js: data[3].map(v=>v.value).join('').trim() }); }, symbols: [ { literal: "=>" }, "_", { literal: "${" }, "POSTPROCESSOR$RPT0Nx4", { literal: "}" } ] }
                ],
                POSTPROCESSOR$RPT0Nx1: [
                    { name: "POSTPROCESSOR$RPT0Nx1", symbols: [ ] },
                    { name: "POSTPROCESSOR$RPT0Nx1", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "POSTPROCESSOR$RPT0Nx1", { token: "T_JSBODY" } ] }
                ],
                POSTPROCESSOR$RPT0Nx2: [
                    { name: "POSTPROCESSOR$RPT0Nx2", symbols: [ ] },
                    { name: "POSTPROCESSOR$RPT0Nx2", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "POSTPROCESSOR$RPT0Nx2", { token: "T_JSBODY" } ] }
                ],
                POSTPROCESSOR$RPT0Nx3: [
                    { name: "POSTPROCESSOR$RPT0Nx3", symbols: [ ] },
                    { name: "POSTPROCESSOR$RPT0Nx3", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "POSTPROCESSOR$RPT0Nx3", { token: "T_JSBODY" } ] }
                ],
                POSTPROCESSOR$RPT0Nx4: [
                    { name: "POSTPROCESSOR$RPT0Nx4", symbols: [ ] },
                    { name: "POSTPROCESSOR$RPT0Nx4", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "POSTPROCESSOR$RPT0Nx4", { token: "T_JSBODY" } ] }
                ],
                T_INTEGER: [
                    { name: "T_INTEGER", postprocess: ({data}) => { return (data[0].value); }, symbols: [ { token: "T_INTEGER" } ] }
                ],
                T_JS: [
                    { name: "T_JS", postprocess: ({data}) => { return ({ js: data[1].map(v=>v.value).join('') }); }, symbols: [ { literal: "{" }, "T_JS$RPT0Nx1", { literal: "}" } ] }
                ],
                T_JS$RPT0Nx1: [
                    { name: "T_JS$RPT0Nx1", symbols: [ ] },
                    { name: "T_JS$RPT0Nx1", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "T_JS$RPT0Nx1", { token: "T_JSBODY" } ] }
                ],
                T_REGEX: [
                    { name: "T_REGEX", postprocess: ({data}) => { return ({ regex: data[3].value.slice(1,-1), flags: data[1].map(v => v.value).join('').trim(), quote: data[3].value[0] }); }, symbols: [ { literal: "\\r" }, "T_REGEX$RPT0Nx1", "_", { token: "T_REGEX" } ] }
                ],
                T_REGEX$RPT0Nx1: [
                    { name: "T_REGEX$RPT0Nx1", symbols: [ ] },
                    { name: "T_REGEX$RPT0Nx1", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "T_REGEX$RPT0Nx1", /[gmiuy]/ ] }
                ],
                T_SECTWORD: [
                    { name: "T_SECTWORD", postprocess: ({data}) => { return (data[0].value.substring(1, data[0].value.length-1).trim()); }, symbols: [ { token: "T_SECTWORD" } ] }
                ],
                T_STRING: [
                    { name: "T_STRING", postprocess: ({data}) => { return (JSON.parse(data[0].value)); }, symbols: [ { token: "T_STRING" } ] }
                ],
                T_WORD: [
                    { name: "T_WORD", postprocess: ({data}) => { return (data[0].value); }, symbols: [ { token: "T_WORD" } ] }
                ],
                _: [
                    { name: "_", postprocess: ({data}) => { return (null); }, symbols: [ "_$RPT0Nx1" ] }
                ],
                _$RPT0Nx1: [
                    { name: "_$RPT0Nx1", symbols: [ ] },
                    { name: "_$RPT0Nx1", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "_$RPT0Nx1", "_$RPT0Nx1$SUBx1" ] }
                ],
                _$RPT0Nx1$SUBx1: [
                    { name: "_$RPT0Nx1$SUBx1", symbols: [ { token: "T_WS" } ] },
                    { name: "_$RPT0Nx1$SUBx1", symbols: [ { token: "T_COMMENT" } ] }
                ],
                __: [
                    { name: "__", postprocess: ({data}) => { return (null); }, symbols: [ "__$RPT1Nx1" ] }
                ],
                __$RPT1Nx1: [
                    { name: "__$RPT1Nx1", symbols: [ "__$RPT1Nx1$SUBx1" ] },
                    { name: "__$RPT1Nx1", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "__$RPT1Nx1", "__$RPT1Nx1$SUBx2" ] }
                ],
                __$RPT1Nx1$SUBx1: [
                    { name: "__$RPT1Nx1$SUBx1", symbols: [ { token: "T_WS" } ] },
                    { name: "__$RPT1Nx1$SUBx1", symbols: [ { token: "T_COMMENT" } ] }
                ],
                __$RPT1Nx1$SUBx2: [
                    { name: "__$RPT1Nx1$SUBx2", symbols: [ { token: "T_WS" } ] },
                    { name: "__$RPT1Nx1$SUBx2", symbols: [ { token: "T_COMMENT" } ] }
                ],
                expression: [
                    { name: "expression", postprocess: ({data}) => { return ({ symbols: data[0] }); }, symbols: [ "expression_symbol_list" ] },
                    { name: "expression", postprocess: ({data}) => { return ({ symbols: data[0], postprocess: data[2] }); }, symbols: [ "expression_symbol_list", "_", "POSTPROCESSOR" ] }
                ],
                expression_list: [
                    { name: "expression_list", postprocess: ({data}) => { return ([data[0]]); }, symbols: [ "expression" ] },
                    { name: "expression_list", postprocess: ({data}) => { return ([data[2]]); }, symbols: [ { literal: "|" }, "_", "expression" ] },
                    { name: "expression_list", postprocess: ({data}) => { return (data[0].concat([data[4]])); }, symbols: [ "expression_list", "_", { literal: "|" }, "_", "expression" ] }
                ],
                expression_repeater: [
                    { name: "expression_repeater", postprocess: ({data}) => { return (data[0].value); }, symbols: [ { literal: "?" } ] },
                    { name: "expression_repeater", postprocess: ({data}) => { return (data[0].value); }, symbols: [ { literal: "+" } ] },
                    { name: "expression_repeater", postprocess: ({data}) => { return (data[0].value); }, symbols: [ { literal: "*" } ] }
                ],
                expression_symbol: [
                    { name: "expression_symbol", postprocess: ({data}) => { return (data[0]); }, symbols: [ "expression_symbol_match" ] },
                    { name: "expression_symbol", postprocess: ({data}) => { return ({ ...data[0],  alias: data[2] }); }, symbols: [ "expression_symbol_match", { literal: "@" }, "T_WORD" ] },
                    { name: "expression_symbol", postprocess: ({data}) => { return ({ expression: data[0], repeat: data[1] }); }, symbols: [ "expression_symbol_match", "expression_repeater" ] },
                    { name: "expression_symbol", postprocess: ({data}) => { return ({ expression: data[0], repeat: data[1], alias: data[4] }); }, symbols: [ "expression_symbol_match", "expression_repeater", { literal: "@" }, "T_WORD" ] }
                ],
                expression_symbol_list: [
                    { name: "expression_symbol_list", symbols: [ "expression_symbol" ] },
                    { name: "expression_symbol_list", postprocess: ({data}) => { return (data[0].concat([data[2]])); }, symbols: [ "expression_symbol_list", "__", "expression_symbol" ] }
                ],
                expression_symbol_match: [
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ rule: data[0] }); }, symbols: [ "T_WORD" ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ literal: data[0], insensitive: false }); }, symbols: [ "T_STRING" ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ literal: data[2], insensitive: true }); }, symbols: [ { literal: "\\i" }, "_", "T_STRING" ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ token: data[2]}); }, symbols: [ { literal: "<" }, "_", "T_WORD", "_", { literal: ">" } ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ token: data[2]}); }, symbols: [ { literal: "<" }, "_", "T_STRING", "_", { literal: ">" } ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return (data[0]); }, symbols: [ "T_REGEX" ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ subexpression: data[2] }); }, symbols: [ { literal: "(" }, "_", "expression_list", "_", { literal: ")" } ] }
                ],
                grammar: [
                    { name: "grammar", postprocess: ({data}) => { return ({ config: Object.assign(...data[0]), rules: data[2] }); }, symbols: [ "kv_list", "_", "grammar_rule_list" ] },
                    { name: "grammar", postprocess: ({data}) => { return ({ rules: data[0] }); }, symbols: [ "grammar_rule_list" ] }
                ],
                grammar_rule: [
                    { name: "grammar_rule", postprocess: ({data}) => { return ({ name: data[0], expressions: data[2] }); }, symbols: [ "grammar_rule_name", "_", "expression_list" ] },
                    { name: "grammar_rule", postprocess: ({data}) => { return ({ name: data[0], expressions: data[4], postprocess: data[2] }); }, symbols: [ "grammar_rule_name", "__", "POSTPROCESSOR", "_", "expression_list" ] }
                ],
                grammar_rule_list: [
                    { name: "grammar_rule_list", postprocess: ({data}) => { return ([data[0]]); }, symbols: [ "grammar_rule" ] },
                    { name: "grammar_rule_list", postprocess: ({data}) => { return ([data[0]].concat(data[2])); }, symbols: [ "grammar_rule", "_", "grammar_rule_list" ] }
                ],
                grammar_rule_name: [
                    { name: "grammar_rule_name", postprocess: ({data}) => { return (data[0]); }, symbols: [ "T_SECTWORD" ] }
                ],
                kv: [
                    { name: "kv", postprocess: ({data}) => { return ({ [data[0]]: data[4][0] }); }, symbols: [ "T_WORD", "_", { literal: ":" }, "_", "kv$SUBx1" ] }
                ],
                kv$SUBx1: [
                    { name: "kv$SUBx1", symbols: [ "T_WORD" ] },
                    { name: "kv$SUBx1", symbols: [ "T_STRING" ] },
                    { name: "kv$SUBx1", symbols: [ "T_INTEGER" ] },
                    { name: "kv$SUBx1", symbols: [ "T_JS" ] }
                ],
                kv_list: [
                    { name: "kv_list", postprocess: ({data}) => { return (data); }, symbols: [ "kv" ] },
                    { name: "kv_list", postprocess: ({data}) => { return ([data[0]].concat(data[2])); }, symbols: [ "kv", "_", "kv_list" ] }
                ],
                lexer: [
                    { name: "lexer", postprocess: ({data}) => { return (data[0].concat({ states: data[2] })); }, symbols: [ "kv_list", "_", "state_list" ] },
                    { name: "lexer", postprocess: ({data}) => { return ([{ states: data[0] }]); }, symbols: [ "state_list" ] }
                ],
                main: [
                    { name: "main", postprocess: ({data}) => { return (data[1]); }, symbols: [ "_", "section_list", "_" ] }
                ],
                section: [
                    { name: "section", postprocess: ({data}) => { return ({ config: Object.assign(...data[4]) }); }, symbols: [ { literal: "config" }, "_", { literal: "{" }, "_", "kv_list", "_", { literal: "}" } ] },
                    { name: "section", postprocess: ({data}) => { return ({ import: data[6] }); }, symbols: [ { literal: "import" }, "_", { literal: "*" }, "_", { literal: "from" }, "__", "T_WORD", "_", { literal: ";" } ] },
                    { name: "section", postprocess: ({data}) => { return ({ import: data[6], path: true }); }, symbols: [ { literal: "import" }, "_", { literal: "*" }, "_", { literal: "from" }, "__", "T_STRING", "_", { literal: ";" } ] },
                    { name: "section", postprocess: ({data}) => { return ({ import: data[10], alias: data[6]}); }, symbols: [ { literal: "import" }, "_", { literal: "*" }, "_", { literal: "as" }, "_", "T_WORD", "_", { literal: "from" }, "__", "T_WORD", "_", { literal: ";" } ] },
                    { name: "section", postprocess: ({data}) => { return ({ import: data[10], path: true, alias: data[6]}); }, symbols: [ { literal: "import" }, "_", { literal: "*" }, "_", { literal: "as" }, "_", "T_WORD", "_", { literal: "from" }, "__", "T_STRING", "_", { literal: ";" } ] },
                    { name: "section", postprocess: ({data}) => { return ({ lexer: Object.assign(...data[4]) }); }, symbols: [ { literal: "lexer" }, "_", { literal: "{" }, "_", "lexer", "_", { literal: "}" } ] },
                    { name: "section", postprocess: ({data}) => { return ({ grammar: data[4] }); }, symbols: [ { literal: "grammar" }, "_", { literal: "{" }, "_", "grammar", "_", { literal: "}" } ] },
                    { name: "section", postprocess: ({data}) => { return ({ lifecycle: data[2], js: data[4] }); }, symbols: [ /on/, { literal: ":" }, "T_WORD", "_", "T_JS" ] },
                    { name: "section", postprocess: ({data}) => { return ({ lifecycle: data[2], js: data[4], path: true }); }, symbols: [ /on/, { literal: ":" }, "T_WORD", "_", "T_STRING" ] }
                ],
                section_list: [
                    { name: "section_list", postprocess: ({data}) => { return ([data[0]]); }, symbols: [ "section" ] },
                    { name: "section_list", postprocess: ({data}) => { return ([data[0]].concat(data[2])); }, symbols: [ "section", "__", "section_list" ] }
                ],
                state: [
                    { name: "state", postprocess: ({data}) => { return ({ name: data[0], state: data[2] }); }, symbols: [ "T_SECTWORD", "_", "state_definition" ] }
                ],
                state_config: [
                    { name: "state_config", postprocess: ({data}) => { return ({[data[0]]: Object.assign(...data[4]) }); }, symbols: [ "T_WORD", "_", { literal: ":" }, "_", "token_definition_list", "_", { literal: ";" } ] }
                ],
                state_config_list: [
                    { name: "state_config_list", postprocess: ({data}) => { return (data[0]); }, symbols: [ "state_config" ] },
                    { name: "state_config_list", postprocess: ({data}) => { return (Object.assign(data[0], data[2])); }, symbols: [ "state_config", "_", "state_config_list" ] }
                ],
                state_definition: [
                    { name: "state_definition", postprocess: ({data}) => { return (Object.assign(data[0], { rules: data[2] })); }, symbols: [ "state_config_list", "_", "token_list" ] },
                    { name: "state_definition", postprocess: ({data}) => { return ({ rules: data[0] }); }, symbols: [ "token_list" ] },
                    { name: "state_definition", postprocess: ({data}) => { return ({ config: Object.assign(...data[4]), span: data[6]}); }, symbols: [ { literal: "span" }, "_", { literal: "{" }, "_", "kv_list", "_", "state_list", "_", { literal: "}" } ] },
                    { name: "state_definition", postprocess: ({data}) => { return ({ span: data[4]}); }, symbols: [ { literal: "span" }, "_", { literal: "{" }, "_", "state_list", "_", { literal: "}" } ] }
                ],
                state_list: [
                    { name: "state_list", postprocess: ({data}) => { return ([data[0]]); }, symbols: [ "state" ] },
                    { name: "state_list", postprocess: ({data}) => { return ([data[0]].concat(data[2])); }, symbols: [ "state", "_", "state_list" ] }
                ],
                string_list: [
                    { name: "string_list", postprocess: ({data}) => { return ([data[0]]); }, symbols: [ "T_STRING" ] },
                    { name: "string_list", postprocess: ({data}) => { return ([data[0]].concat(data[4])); }, symbols: [ "T_STRING", "_", { literal: "," }, "_", "string_list" ] }
                ],
                token: [
                    { name: "token", postprocess: ({data}) => { return ({ import: data[4] }); }, symbols: [ { literal: "-" }, "_", { literal: "import" }, "_", "word_list" ] },
                    { name: "token", postprocess: ({data}) => { return (Object.assign(...data[2])); }, symbols: [ { literal: "-" }, "_", "token_definition_list" ] }
                ],
                token_definition: [
                    { name: "token_definition", postprocess: ({data}) => { return ({ open: data[2] }); }, symbols: [ { literal: "open" }, "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ close: data[2] }); }, symbols: [ { literal: "close" }, "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ tag: data[2] }); }, symbols: [ { literal: "tag" }, "_", "string_list" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2] }); }, symbols: [ { literal: "when" }, "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2] }); }, symbols: [ { literal: "when" }, "_", "T_REGEX" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2], before: true }); }, symbols: [ { literal: "before" }, "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2], before: true }); }, symbols: [ { literal: "before" }, "_", "T_REGEX" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2], skip: true }); }, symbols: [ { literal: "skip" }, "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2], skip: true }); }, symbols: [ { literal: "skip" }, "_", "T_REGEX" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ stay: true }); }, symbols: [ { literal: "stay" } ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ pop: 1 }); }, symbols: [ { literal: "pop" } ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ pop: parseInt(data[2]) }); }, symbols: [ { literal: "pop" }, "_", "T_INTEGER" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ pop: "all" }); }, symbols: [ { literal: "pop" }, "_", { literal: "all" } ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ highlight: data[2] }); }, symbols: [ { literal: "highlight" }, "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ embed: data[2] }); }, symbols: [ { literal: "embed" }, "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ unembed: true }); }, symbols: [ { literal: "unembed" } ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ inset: 1 }); }, symbols: [ { literal: "inset" } ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ inset: parseInt(data[2]) }); }, symbols: [ { literal: "inset" }, "_", "T_INTEGER" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ set: data[2] }); }, symbols: [ { literal: "set" }, "_", "T_WORD" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ goto: data[2] }); }, symbols: [ { literal: "goto" }, "_", "T_WORD" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ type: data[2] }); }, symbols: [ { literal: "type" }, "_", "T_STRING" ] }
                ],
                token_definition_list: [
                    { name: "token_definition_list", postprocess: ({data}) => { return (data); }, symbols: [ "token_definition" ] },
                    { name: "token_definition_list", postprocess: ({data}) => { return ([data[0]].concat(data[2])); }, symbols: [ "token_definition", "_", "token_definition_list" ] }
                ],
                token_list: [
                    { name: "token_list", postprocess: ({data}) => { return (data); }, symbols: [ "token" ] },
                    { name: "token_list", postprocess: ({data}) => { return ([data[0]].concat(data[2])); }, symbols: [ "token", "_", "token_list" ] }
                ],
                word_list: [
                    { name: "word_list", postprocess: ({data}) => { return ([data[0]]); }, symbols: [ "T_WORD" ] },
                    { name: "word_list", postprocess: ({data}) => { return ([data[0]].concat(data[4])); }, symbols: [ "T_WORD", "_", { literal: "," }, "_", "word_list" ] }
                ]
            },
            start: "main"
        },
        lexer: {
            start: "main",
            states: {
                comment: {
                    regex: /(?:(?:(\/\/[^\n]*)))/ym,
                    rules: [
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ }
                    ]
                },
                config: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { set: "config$span", when: "{" }
                    ]
                },
                config$span: {
                    regex: /(?:(?:(\/\/[^\n]*))|(?:(\"(?:[^\"\\\r\n]|\\.)*\"))|(?:(\s+))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;)))|(?:((?:\}))))/ym,
                    rules: [
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ },
                        { highlight: "string", tag: ["T_STRING"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ },
                        { tag: ["T_WS"], when: /\s+/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { when: ";" },
                        { pop: 1, when: "}" }
                    ]
                },
                config$start: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { set: "config$span", when: "{" }
                    ]
                },
                config$stop: {
                    regex: /(?:(?:((?:\}))))/ym,
                    rules: [
                        { pop: 1, when: "}" }
                    ]
                },
                grammar: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { set: "grammar$span", when: "{" }
                    ]
                },
                grammar$span: {
                    regex: /(?:(?:(\/\/[^\n]*))|(?:(\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]))|(?:((?:=>)))|(?:(\s+))|(?:((?:\\i)))|(?:((?:\\r)))|(?:((?:\?)))|(?:((?:\+)))|(?:((?:\*)))|(?:(\"(?:[^\"\\\r\n]|\\.)*\"))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;)))|(?:((?:@)))|(?:((?:,)))|(?:((?:\|)))|(?:((?:\()))|(?:((?:\))))|(?:((?:<)))|(?:((?:>)))|(?:((?:\->)))|(?:((?:\$)))|(?:((?:\-)))|(?:((?:\}))))/ym,
                    rules: [
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ },
                        { highlight: "type.identifier", tag: ["T_SECTWORD"], when: /\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]/ },
                        { goto: "js_template_inner", highlight: "annotation", when: "=>" },
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "constant", when: "\\i" },
                        { goto: "regex$span", highlight: "constant", when: "\\r" },
                        { when: "?" },
                        { when: "+" },
                        { when: "*" },
                        { highlight: "string", tag: ["T_STRING"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { when: ";" },
                        { highlight: "keyword", when: "@" },
                        { when: "," },
                        { highlight: "keyword", when: "|" },
                        { when: "(" },
                        { when: ")" },
                        { when: "<" },
                        { when: ">" },
                        { highlight: "keyword", when: "->" },
                        { when: "$" },
                        { when: "-" },
                        { pop: 1, when: "}" }
                    ]
                },
                grammar$start: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { set: "grammar$span", when: "{" }
                    ]
                },
                grammar$stop: {
                    regex: /(?:(?:((?:\}))))/ym,
                    rules: [
                        { pop: 1, when: "}" }
                    ]
                },
                insensitive: {
                    regex: /(?:(?:((?:\\i))))/ym,
                    rules: [
                        { highlight: "constant", when: "\\i" }
                    ]
                },
                integer: {
                    regex: /(?:(?:(\d+)))/ym,
                    rules: [
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ }
                    ]
                },
                js_body: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "annotation", set: "js_literal", tag: ["T_JSBODY"], when: "{" }
                    ]
                },
                js_literal: {
                    regex: /(?:(?:(\"(?:[^\"\\\r\n]|\\.)*\"))|(?:('(?:[^'\\\r\n]|\\.)*'))|(?:(`(?:[^`\\]|\\.)*`))|(?:(\/(?:[^/\\\r\n]|\\.)+\/[gmiyu]*))|(?:(\/\/[^\n]*))|(?:(\/\*.*\*\/))|(?:((?:\{)))|(?:((?:\})))|(?:((?:\()))|(?:((?:\))))|(?:((?:\[)))|(?:((?:\]))))/gm,
                    rules: [
                        { tag: ["T_JSBODY"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ },
                        { tag: ["T_JSBODY"], when: /'(?:[^'\\\r\n]|\\.)*'/ },
                        { tag: ["T_JSBODY"], when: /`(?:[^`\\]|\\.)*`/ },
                        { tag: ["T_JSBODY"], when: /\/(?:[^/\\\r\n]|\\.)+\/[gmiyu]*/ },
                        { tag: ["T_JSBODY"], when: /\/\/[^\n]*/ },
                        { tag: ["T_JSBODY"], when: /\/\*.*\*\// },
                        { goto: "js_literal", highlight: "annotation", tag: ["T_JSBODY"], when: "{" },
                        { highlight: "annotation", pop: 1, tag: ["T_JSBODY"], when: "}" },
                        { goto: "js_literal", highlight: "annotation", tag: ["T_JSBODY"], when: "(" },
                        { highlight: "annotation", pop: 1, tag: ["T_JSBODY"], when: ")" },
                        { goto: "js_literal", highlight: "annotation", tag: ["T_JSBODY"], when: "[" },
                        { highlight: "annotation", pop: 1, tag: ["T_JSBODY"], when: "]" }
                    ],
                    unmatched: { tag: ["T_JSBODY"] }
                },
                js_template: {
                    regex: /(?:(?:((?:=>))))/ym,
                    rules: [
                        { goto: "js_template_inner", highlight: "annotation", when: "=>" }
                    ]
                },
                js_template_inner: {
                    regex: /(?:(?:(\s+))|(?:((?:\$\{)))|(?:((?:\()))|(?:((?:\{)))|(?:((?:\[))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "annotation", set: "js_literal", when: "${" },
                        { highlight: "annotation", set: "js_literal", when: "(" },
                        { highlight: "annotation", set: "js_literal", when: "{" },
                        { highlight: "annotation", set: "js_literal", when: "[" }
                    ]
                },
                jsignore: {
                    regex: /(?:(?:(\"(?:[^\"\\\r\n]|\\.)*\"))|(?:('(?:[^'\\\r\n]|\\.)*'))|(?:(`(?:[^`\\]|\\.)*`))|(?:(\/(?:[^/\\\r\n]|\\.)+\/[gmiyu]*))|(?:(\/\/[^\n]*))|(?:(\/\*.*\*\/)))/ym,
                    rules: [
                        { tag: ["T_JSBODY"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ },
                        { tag: ["T_JSBODY"], when: /'(?:[^'\\\r\n]|\\.)*'/ },
                        { tag: ["T_JSBODY"], when: /`(?:[^`\\]|\\.)*`/ },
                        { tag: ["T_JSBODY"], when: /\/(?:[^/\\\r\n]|\\.)+\/[gmiyu]*/ },
                        { tag: ["T_JSBODY"], when: /\/\/[^\n]*/ },
                        { tag: ["T_JSBODY"], when: /\/\*.*\*\// }
                    ]
                },
                kv: {
                    regex: /(?:(?:(\"(?:[^\"\\\r\n]|\\.)*\"))|(?:(\s+))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;))))/ym,
                    rules: [
                        { highlight: "string", tag: ["T_STRING"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ },
                        { tag: ["T_WS"], when: /\s+/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { when: ";" }
                    ]
                },
                l_abracketl: {
                    regex: /(?:(?:((?:<))))/ym,
                    rules: [
                        { when: "<" }
                    ]
                },
                l_abracketr: {
                    regex: /(?:(?:((?:>))))/ym,
                    rules: [
                        { when: ">" }
                    ]
                },
                l_arrow: {
                    regex: /(?:(?:((?:\->))))/ym,
                    rules: [
                        { highlight: "keyword", when: "->" }
                    ]
                },
                l_at: {
                    regex: /(?:(?:((?:@))))/ym,
                    rules: [
                        { highlight: "keyword", when: "@" }
                    ]
                },
                l_colon: {
                    regex: /(?:(?:((?::))))/ym,
                    rules: [
                        { highlight: "keyword", when: ":" }
                    ]
                },
                l_comma: {
                    regex: /(?:(?:((?:,))))/ym,
                    rules: [
                        { when: "," }
                    ]
                },
                l_dash: {
                    regex: /(?:(?:((?:\-))))/ym,
                    rules: [
                        { when: "-" }
                    ]
                },
                l_dsign: {
                    regex: /(?:(?:((?:\$))))/ym,
                    rules: [
                        { when: "$" }
                    ]
                },
                l_parenl: {
                    regex: /(?:(?:((?:\())))/ym,
                    rules: [
                        { when: "(" }
                    ]
                },
                l_parenr: {
                    regex: /(?:(?:((?:\)))))/ym,
                    rules: [
                        { when: ")" }
                    ]
                },
                l_pipe: {
                    regex: /(?:(?:((?:\|))))/ym,
                    rules: [
                        { highlight: "keyword", when: "|" }
                    ]
                },
                l_plus: {
                    regex: /(?:(?:((?:\+))))/ym,
                    rules: [
                        { when: "+" }
                    ]
                },
                l_qmark: {
                    regex: /(?:(?:((?:\?))))/ym,
                    rules: [
                        { when: "?" }
                    ]
                },
                l_scolon: {
                    regex: /(?:(?:((?:;))))/ym,
                    rules: [
                        { when: ";" }
                    ]
                },
                l_star: {
                    regex: /(?:(?:((?:\*))))/ym,
                    rules: [
                        { when: "*" }
                    ]
                },
                lexer: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { set: "lexer$span", when: "{" }
                    ]
                },
                lexer$span: {
                    regex: /(?:(?:(\s+))|(?:(\/\/[^\n]*))|(?:(\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]))|(?:((?:\\r)))|(?:((?:,)))|(?:((?:\->)))|(?:((?:\-)))|(?:(\"(?:[^\"\\\r\n]|\\.)*\"))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;)))|(?:((?:\{)))|(?:((?:\}))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ },
                        { highlight: "type.identifier", tag: ["T_SECTWORD"], when: /\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]/ },
                        { goto: "regex$span", highlight: "constant", when: "\\r" },
                        { when: "," },
                        { highlight: "keyword", when: "->" },
                        { when: "-" },
                        { highlight: "string", tag: ["T_STRING"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { when: ";" },
                        { goto: "lexer_span$span", when: "{" },
                        { pop: 1, when: "}" }
                    ]
                },
                lexer$start: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { set: "lexer$span", when: "{" }
                    ]
                },
                lexer$stop: {
                    regex: /(?:(?:((?:\}))))/ym,
                    rules: [
                        { pop: 1, when: "}" }
                    ]
                },
                lexer_span: {
                    regex: /(?:(?:((?:\{))))/ym,
                    rules: [
                        { goto: "lexer_span$span", when: "{" }
                    ]
                },
                lexer_span$span: {
                    regex: /(?:(?:(\s+))|(?:(\/\/[^\n]*))|(?:(\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]))|(?:((?:\\r)))|(?:((?:,)))|(?:((?:\->)))|(?:((?:\-)))|(?:(\"(?:[^\"\\\r\n]|\\.)*\"))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;)))|(?:((?:\}))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ },
                        { highlight: "type.identifier", tag: ["T_SECTWORD"], when: /\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]/ },
                        { goto: "regex$span", highlight: "constant", when: "\\r" },
                        { when: "," },
                        { highlight: "keyword", when: "->" },
                        { when: "-" },
                        { highlight: "string", tag: ["T_STRING"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { when: ";" },
                        { pop: 1, when: "}" }
                    ]
                },
                lexer_span$start: {
                    regex: /(?:(?:((?:\{))))/ym,
                    rules: [
                        { goto: "lexer_span$span", when: "{" }
                    ]
                },
                lexer_span$stop: {
                    regex: /(?:(?:((?:\}))))/ym,
                    rules: [
                        { pop: 1, when: "}" }
                    ]
                },
                lifecycle: {
                    regex: /(?:(?:(on(?![a-zA-Z\d_]))))/ym,
                    rules: [
                        { goto: "lifecycle$span", highlight: "tag", tag: ["T_WORD"], when: /on(?![a-zA-Z\d_])/ }
                    ]
                },
                lifecycle$span: {
                    regex: /(?:(?:(\s+))|(?:((?:\{)))|(?:((?::)))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:([\'"`])))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "annotation", set: "js_literal", tag: ["T_JSBODY"], when: "{" },
                        { highlight: "keyword", when: ":" },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { before: true, pop: 1, when: /[\'"`]/ }
                    ]
                },
                lifecycle$start: {
                    regex: /(?:(?:(on(?![a-zA-Z\d_]))))/ym,
                    rules: [
                        { goto: "lifecycle$span", highlight: "tag", tag: ["T_WORD"], when: /on(?![a-zA-Z\d_])/ }
                    ]
                },
                lifecycle$stop: {
                    regex: /(?:(?:([\'"`])))/ym,
                    rules: [
                        { before: true, pop: 1, when: /[\'"`]/ }
                    ]
                },
                main: {
                    regex: /(?:(?:(\"(?:[^\"\\\r\n]|\\.)*\"))|(?:(\s+))|(?:(\/\/[^\n]*))|(?:((?:\*)))|(?:(on(?![a-zA-Z\d_])))|(?:(lexer(?![a-zA-Z\d_])))|(?:(grammar(?![a-zA-Z\d_])))|(?:(config(?![a-zA-Z\d_])))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;))))/ym,
                    rules: [
                        { highlight: "string", tag: ["T_STRING"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ },
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ },
                        { when: "*" },
                        { goto: "lifecycle$span", highlight: "tag", tag: ["T_WORD"], when: /on(?![a-zA-Z\d_])/ },
                        { goto: "lexer", highlight: "tag", tag: ["T_WORD"], when: /lexer(?![a-zA-Z\d_])/ },
                        { goto: "grammar", highlight: "tag", tag: ["T_WORD"], when: /grammar(?![a-zA-Z\d_])/ },
                        { goto: "config", highlight: "tag", tag: ["T_WORD"], when: /config(?![a-zA-Z\d_])/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { when: ";" }
                    ]
                },
                regex: {
                    regex: /(?:(?:((?:\\r))))/ym,
                    rules: [
                        { goto: "regex$span", highlight: "constant", when: "\\r" }
                    ]
                },
                regex$span: {
                    regex: /(?:(?:(\s+))|(?:([a-z]))|(?:(\"(?:[^\"\\\r\n]|\\.)*\"))|(?:('(?:[^'\\\r\n]|\\.)*'))|(?:(`(?:[^`\\]|\\.)*`)))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "constant", when: /[a-z]/ },
                        { highlight: "regexp", pop: 1, tag: ["T_REGEX"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ },
                        { highlight: "regexp", pop: 1, tag: ["T_REGEX"], when: /'(?:[^'\\\r\n]|\\.)*'/ },
                        { highlight: "regexp", pop: 1, tag: ["T_REGEX"], when: /`(?:[^`\\]|\\.)*`/ }
                    ]
                },
                regex$start: {
                    regex: /(?:(?:((?:\\r))))/ym,
                    rules: [
                        { goto: "regex$span", highlight: "constant", when: "\\r" }
                    ]
                },
                regex$stop: {
                    regex: /(?:(?:(\"(?:[^\"\\\r\n]|\\.)*\"))|(?:('(?:[^'\\\r\n]|\\.)*'))|(?:(`(?:[^`\\]|\\.)*`)))/ym,
                    rules: [
                        { highlight: "regexp", pop: 1, tag: ["T_REGEX"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ },
                        { highlight: "regexp", pop: 1, tag: ["T_REGEX"], when: /'(?:[^'\\\r\n]|\\.)*'/ },
                        { highlight: "regexp", pop: 1, tag: ["T_REGEX"], when: /`(?:[^`\\]|\\.)*`/ }
                    ]
                },
                section_word: {
                    regex: /(?:(?:(\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\])))/ym,
                    rules: [
                        { highlight: "type.identifier", tag: ["T_SECTWORD"], when: /\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]/ }
                    ]
                },
                string: {
                    regex: /(?:(?:(\"(?:[^\"\\\r\n]|\\.)*\")))/ym,
                    rules: [
                        { highlight: "string", tag: ["T_STRING"], when: /\"(?:[^\"\\\r\n]|\\.)*\"/ }
                    ]
                },
                word: {
                    regex: /(?:(?:([a-zA-Z_][a-zA-Z_\d]*)))/ym,
                    rules: [
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ }
                    ]
                },
                ws: {
                    regex: /(?:(?:(\s+)))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ }
                    ]
                }
            }
        }
    }
    constructor(){}
}

export default grammar;