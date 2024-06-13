// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well

function GWLanguage(){
    
    return {
        grammar: {
            rules: {
                ABRACKET_L: [
                    { name: "ABRACKET_L", symbols: [ { token: "ABRACKET_L" } ] }
                ],
                ABRACKET_R: [
                    { name: "ABRACKET_R", symbols: [ { token: "ABRACKET_R" } ] }
                ],
                CBRACKET_L: [
                    { name: "CBRACKET_L", symbols: [ { token: "CBRACKET_L" } ] }
                ],
                CBRACKET_R: [
                    { name: "CBRACKET_R", symbols: [ { token: "CBRACKET_R" } ] }
                ],
                DCBRACKET_L: [
                    { name: "DCBRACKET_L", symbols: [ { token: "DCBRACKET_L" } ] }
                ],
                DCBRACKET_R: [
                    { name: "DCBRACKET_R", symbols: [ { token: "DCBRACKET_R" } ] }
                ],
                K_ALL: [
                    { name: "K_ALL", symbols: [ { literal: "all" } ] }
                ],
                K_BEFORE: [
                    { name: "K_BEFORE", symbols: [ { literal: "before" } ] }
                ],
                K_BODY: [
                    { name: "K_BODY", symbols: [ { literal: "body" } ] }
                ],
                K_CLOSE: [
                    { name: "K_CLOSE", symbols: [ { literal: "close" } ] }
                ],
                K_CONFIG: [
                    { name: "K_CONFIG", symbols: [ { literal: "config" } ] }
                ],
                K_EMBED: [
                    { name: "K_EMBED", symbols: [ { literal: "embed" } ] }
                ],
                K_FROM: [
                    { name: "K_FROM", symbols: [ { literal: "from" } ] }
                ],
                K_GOTO: [
                    { name: "K_GOTO", symbols: [ { literal: "goto" } ] }
                ],
                K_GRAMMAR: [
                    { name: "K_GRAMMAR", symbols: [ { literal: "grammar" } ] }
                ],
                K_HEAD: [
                    { name: "K_HEAD", symbols: [ { literal: "head" } ] }
                ],
                K_HIGHLIGHT: [
                    { name: "K_HIGHLIGHT", symbols: [ { literal: "highlight" } ] }
                ],
                K_IMPORT: [
                    { name: "K_IMPORT", symbols: [ { literal: "import" } ] }
                ],
                K_INSET: [
                    { name: "K_INSET", symbols: [ { literal: "inset" } ] }
                ],
                K_LEXER: [
                    { name: "K_LEXER", symbols: [ { literal: "lexer" } ] }
                ],
                K_OPEN: [
                    { name: "K_OPEN", symbols: [ { literal: "open" } ] }
                ],
                K_POP: [
                    { name: "K_POP", symbols: [ { literal: "pop" } ] }
                ],
                K_SET: [
                    { name: "K_SET", symbols: [ { literal: "set" } ] }
                ],
                K_SKIP: [
                    { name: "K_SKIP", symbols: [ { literal: "skip" } ] }
                ],
                K_TAG: [
                    { name: "K_TAG", symbols: [ { literal: "tag" } ] }
                ],
                K_TYPE: [
                    { name: "K_TYPE", symbols: [ { literal: "type" } ] }
                ],
                K_UNEMBED: [
                    { name: "K_UNEMBED", symbols: [ { literal: "unembed" } ] }
                ],
                K_WHEN: [
                    { name: "K_WHEN", symbols: [ { literal: "when" } ] }
                ],
                L_ARROW: [
                    { name: "L_ARROW", symbols: [ { token: "L_ARROW" } ] }
                ],
                L_COLON: [
                    { name: "L_COLON", symbols: [ { token: "L_COLON" } ] }
                ],
                L_COMMA: [
                    { name: "L_COMMA", symbols: [ { token: "L_COMMA" } ] }
                ],
                L_DASH: [
                    { name: "L_DASH", symbols: [ { token: "L_DASH" } ] }
                ],
                L_DSIGN: [
                    { name: "L_DSIGN", symbols: [ { token: "L_DSIGN" } ] }
                ],
                L_PARENL: [
                    { name: "L_PARENL", symbols: [ { token: "L_PARENL" } ] }
                ],
                L_PARENR: [
                    { name: "L_PARENR", symbols: [ { token: "L_PARENR" } ] }
                ],
                L_PIPE: [
                    { name: "L_PIPE", symbols: [ { token: "L_PIPE" } ] }
                ],
                L_PLUS: [
                    { name: "L_PLUS", symbols: [ { token: "L_PLUS" } ] }
                ],
                L_QMARK: [
                    { name: "L_QMARK", symbols: [ { token: "L_QMARK" } ] }
                ],
                L_SCOLON: [
                    { name: "L_SCOLON", symbols: [ { token: "L_SCOLON" } ] }
                ],
                L_STAR: [
                    { name: "L_STAR", symbols: [ { token: "L_STAR" } ] }
                ],
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
                T_COMMENT: [
                    { name: "T_COMMENT", symbols: [ { token: "T_COMMENT" } ] }
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
                    { name: "T_REGEX", postprocess: ({data}) => { return ({ regex: data[0].value.slice(1,-1), flags: data[1].map(v=>v.value).join('').trim() }); }, symbols: [ { token: "T_REGEX" }, "T_REGEX$RPT0Nx1" ] }
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
                T_WS: [
                    { name: "T_WS", postprocess: ({data}) => { return (null); }, symbols: [ { token: "T_WS" } ] }
                ],
                _: [
                    { name: "_", postprocess: ({data}) => { return (null); }, symbols: [ "_$RPT0Nx1" ] }
                ],
                _$RPT0Nx1: [
                    { name: "_$RPT0Nx1", symbols: [ ] },
                    { name: "_$RPT0Nx1", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "_$RPT0Nx1", "_$RPT0Nx1$SUBx1" ] }
                ],
                _$RPT0Nx1$SUBx1: [
                    { name: "_$RPT0Nx1$SUBx1", symbols: [ "T_WS" ] },
                    { name: "_$RPT0Nx1$SUBx1", symbols: [ "T_COMMENT" ] }
                ],
                __: [
                    { name: "__", postprocess: ({data}) => { return (null); }, symbols: [ "__$RPT1Nx1" ] }
                ],
                __$RPT1Nx1: [
                    { name: "__$RPT1Nx1", symbols: [ "__$RPT1Nx1$SUBx1" ] },
                    { name: "__$RPT1Nx1", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "__$RPT1Nx1", "__$RPT1Nx1$SUBx2" ] }
                ],
                __$RPT1Nx1$SUBx1: [
                    { name: "__$RPT1Nx1$SUBx1", symbols: [ "T_WS" ] },
                    { name: "__$RPT1Nx1$SUBx1", symbols: [ "T_COMMENT" ] }
                ],
                __$RPT1Nx1$SUBx2: [
                    { name: "__$RPT1Nx1$SUBx2", symbols: [ "T_WS" ] },
                    { name: "__$RPT1Nx1$SUBx2", symbols: [ "T_COMMENT" ] }
                ],
                expression: [
                    { name: "expression", postprocess: ({data}) => { return ({ symbols: data[0] }); }, symbols: [ "expression_symbol_list" ] },
                    { name: "expression", postprocess: ({data}) => { return ({ symbols: data[0], postprocess: data[2] }); }, symbols: [ "expression_symbol_list", "_", "POSTPROCESSOR" ] }
                ],
                expression_list: [
                    { name: "expression_list", postprocess: ({data}) => { return ([data[0]]); }, symbols: [ "expression" ] },
                    { name: "expression_list", postprocess: ({data}) => { return ([data[2]]); }, symbols: [ "L_PIPE", "_", "expression" ] },
                    { name: "expression_list", postprocess: ({data}) => { return (data[0].concat([data[4]])); }, symbols: [ "expression_list", "_", "L_PIPE", "_", "expression" ] }
                ],
                expression_repeater: [
                    { name: "expression_repeater", postprocess: ({data}) => { return (data[0][0].value); }, symbols: [ "L_QMARK" ] },
                    { name: "expression_repeater", postprocess: ({data}) => { return (data[0][0].value); }, symbols: [ "L_PLUS" ] },
                    { name: "expression_repeater", postprocess: ({data}) => { return (data[0][0].value); }, symbols: [ "L_STAR" ] }
                ],
                expression_symbol: [
                    { name: "expression_symbol", postprocess: ({data}) => { return (data[0]); }, symbols: [ "expression_symbol_match" ] },
                    { name: "expression_symbol", postprocess: ({data}) => { return ({ ...data[0],  alias: data[2] }); }, symbols: [ "expression_symbol_match", "L_COLON", "T_WORD" ] },
                    { name: "expression_symbol", postprocess: ({data}) => { return ({ expression: data[0], repeat: data[1] }); }, symbols: [ "expression_symbol_match", "expression_repeater" ] },
                    { name: "expression_symbol", postprocess: ({data}) => { return ({ expression: data[0], repeat: data[1], alias: data[4] }); }, symbols: [ "expression_symbol_match", "expression_repeater", "L_COLON", "T_WORD" ] }
                ],
                expression_symbol_list: [
                    { name: "expression_symbol_list", symbols: [ "expression_symbol" ] },
                    { name: "expression_symbol_list", postprocess: ({data}) => { return (data[0].concat([data[2]])); }, symbols: [ "expression_symbol_list", "T_WS", "expression_symbol" ] }
                ],
                expression_symbol_match: [
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ rule: data[0] }); }, symbols: [ "T_WORD" ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ literal: data[0], insensitive: !!data[1] }); }, symbols: [ "T_STRING", "expression_symbol_match$RPT01x1" ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ token: data[2]}); }, symbols: [ "ABRACKET_L", "_", "T_WORD", "_", "ABRACKET_R" ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ token: data[2]}); }, symbols: [ "ABRACKET_L", "_", "T_STRING", "_", "ABRACKET_R" ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return (data[0]); }, symbols: [ "T_REGEX" ] },
                    { name: "expression_symbol_match", postprocess: ({data}) => { return ({ subexpression: data[2] }); }, symbols: [ "L_PARENL", "_", "expression_list", "_", "L_PARENR" ] }
                ],
                expression_symbol_match$RPT01x1: [
                    { name: "expression_symbol_match$RPT01x1", postprocess: ({data}) => data[0], symbols: [ { literal: "i" } ] },
                    { name: "expression_symbol_match$RPT01x1", postprocess: () => null, symbols: [ ] }
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
                    { name: "section", postprocess: ({data}) => { return ({ config: Object.assign(...data[4]) }); }, symbols: [ "K_CONFIG", "_", "CBRACKET_L", "_", "kv_list", "_", "CBRACKET_R" ] },
                    { name: "section", postprocess: ({data}) => { return ({ import: data[6] }); }, symbols: [ "K_IMPORT", "_", "L_STAR", "_", "K_FROM", "__", "T_WORD", "_", "L_SCOLON" ] },
                    { name: "section", postprocess: ({data}) => { return ({ import: data[6], path: true }); }, symbols: [ "K_IMPORT", "_", "L_STAR", "_", "K_FROM", "__", "T_STRING", "_", "L_SCOLON" ] },
                    { name: "section", postprocess: ({data}) => { return ({ import: data[10], alias: data[6]}); }, symbols: [ "K_IMPORT", "_", "L_STAR", "_", { literal: "as" }, "_", "T_WORD", "_", "K_FROM", "__", "T_WORD", "_", "L_SCOLON" ] },
                    { name: "section", postprocess: ({data}) => { return ({ import: data[10], path: true, alias: data[6]}); }, symbols: [ "K_IMPORT", "_", "L_STAR", "_", { literal: "as" }, "_", "T_WORD", "_", "K_FROM", "__", "T_STRING", "_", "L_SCOLON" ] },
                    { name: "section", postprocess: ({data}) => { return ({ lexer: Object.assign(...data[4]) }); }, symbols: [ "K_LEXER", "_", "CBRACKET_L", "_", "lexer", "_", "CBRACKET_R" ] },
                    { name: "section", postprocess: ({data}) => { return ({ grammar: data[4] }); }, symbols: [ "K_GRAMMAR", "_", "CBRACKET_L", "_", "grammar", "_", "CBRACKET_R" ] },
                    { name: "section", postprocess: ({data}) => { return ({ body: data[2] }); }, symbols: [ "K_BODY", "_", "T_JS" ] },
                    { name: "section", postprocess: ({data}) => { return ({ body: data[2], path: true }); }, symbols: [ "K_BODY", "_", "T_STRING" ] },
                    { name: "section", postprocess: ({data}) => { return ({ head: data[2] }); }, symbols: [ "K_HEAD", "_", "T_JS" ] },
                    { name: "section", postprocess: ({data}) => { return ({ head: data[2], path: true }); }, symbols: [ "K_HEAD", "_", "T_STRING" ] }
                ],
                section_list: [
                    { name: "section_list", postprocess: ({data}) => { return ([data[0]]); }, symbols: [ "section" ] },
                    { name: "section_list", postprocess: ({data}) => { return ([data[0]].concat(data[2])); }, symbols: [ "section", "T_WS", "section_list" ] }
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
                    { name: "state_definition", postprocess: ({data}) => { return ({ sections: data[4]}); }, symbols: [ { literal: "sections" }, "_", { literal: "{" }, "_", "state_list", "_", { literal: "}" } ] }
                ],
                state_list: [
                    { name: "state_list", postprocess: ({data}) => { return ([data[0]]); }, symbols: [ "state" ] },
                    { name: "state_list", postprocess: ({data}) => { return ([data[0]].concat(data[2])); }, symbols: [ "state", "_", "state_list" ] }
                ],
                string_list: [
                    { name: "string_list", postprocess: ({data}) => { return ([data[0]]); }, symbols: [ "T_STRING" ] },
                    { name: "string_list", postprocess: ({data}) => { return ([data[0]].concat(data[4])); }, symbols: [ "T_STRING", "_", "L_COMMA", "_", "string_list" ] }
                ],
                token: [
                    { name: "token", postprocess: ({data}) => { return ({ import: data[4] }); }, symbols: [ "L_DASH", "_", "K_IMPORT", "_", "word_list" ] },
                    { name: "token", postprocess: ({data}) => { return (Object.assign(...data[2])); }, symbols: [ "L_DASH", "_", "token_definition_list" ] }
                ],
                token_definition: [
                    { name: "token_definition", postprocess: ({data}) => { return ({ open: data[2] }); }, symbols: [ "K_OPEN", "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ close: data[2] }); }, symbols: [ "K_CLOSE", "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ tag: data[2] }); }, symbols: [ "K_TAG", "_", "string_list" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2] }); }, symbols: [ "K_WHEN", "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2] }); }, symbols: [ "K_WHEN", "_", "T_REGEX" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2], before: true }); }, symbols: [ "K_BEFORE", "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2], before: true }); }, symbols: [ "K_BEFORE", "_", "T_REGEX" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2], skip: true }); }, symbols: [ "K_SKIP", "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ when: data[2], skip: true }); }, symbols: [ "K_SKIP", "_", "T_REGEX" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ pop: 1 }); }, symbols: [ "K_POP" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ pop: parseInt(data[2]) }); }, symbols: [ "K_POP", "_", "T_INTEGER" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ pop: "all" }); }, symbols: [ "K_POP", "_", "K_ALL" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ highlight: data[2] }); }, symbols: [ "K_HIGHLIGHT", "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ embed: data[2] }); }, symbols: [ "K_EMBED", "_", "T_STRING" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ unembed: true }); }, symbols: [ "K_UNEMBED" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ inset: 1 }); }, symbols: [ "K_INSET" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ inset: parseInt(data[2]) }); }, symbols: [ "K_INSET", "_", "T_INTEGER" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ set: data[2] }); }, symbols: [ "K_SET", "_", "T_WORD" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ goto: data[2] }); }, symbols: [ "K_GOTO", "_", "T_WORD" ] },
                    { name: "token_definition", postprocess: ({data}) => { return ({ type: data[2] }); }, symbols: [ "K_TYPE", "_", "T_STRING" ] }
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
                    { name: "word_list", postprocess: ({data}) => { return ([data[0]].concat(data[4])); }, symbols: [ "T_WORD", "_", "L_COMMA", "_", "word_list" ] }
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
                        { skip: true, when: /\s+/ },
                        { goto: "config$body", tag: ["CBRACKET_L"], when: "{" }
                    ]
                },
                config$body: {
                    regex: /(?:(?:(\/\/[^\n]*))|(?:("(?:[^"\\\r\n]|\\.)*"))|(?:(\s+))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;)))|(?:((?:\}))))/ym,
                    rules: [
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ },
                        { highlight: "string", tag: ["T_STRING"], when: /"(?:[^"\\\r\n]|\\.)*"/ },
                        { tag: ["T_WS"], when: /\s+/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", tag: ["L_COLON"], when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { tag: ["L_SCOLON"], when: ";" },
                        { set: "main", tag: ["CBRACKET_R"], when: "}" }
                    ]
                },
                config$opener: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { skip: true, when: /\s+/ },
                        { goto: "config$body", tag: ["CBRACKET_L"], when: "{" }
                    ]
                },
                grammar: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { skip: true, when: /\s+/ },
                        { goto: "grammar$body", tag: ["CBRACKET_L"], when: "{" }
                    ]
                },
                grammar$body: {
                    regex: /(?:(?:(\/\/[^\n]*))|(?:(\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]))|(?:((?:=>)))|(?:(\s+))|(?:(\/(?:[^\/\\\r\n]|\\.)+\/))|(?:((?:\?)))|(?:((?:\+)))|(?:((?:\*)))|(?:("(?:[^"\\\r\n]|\\.)*"))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;)))|(?:((?:,)))|(?:((?:\|)))|(?:((?:\()))|(?:((?:\))))|(?:((?:<)))|(?:((?:>)))|(?:((?:\->)))|(?:((?:\$)))|(?:((?:\-)))|(?:((?:\}))))/ym,
                    rules: [
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ },
                        { highlight: "type.identifier", tag: ["T_SECTWORD"], when: /\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]/ },
                        { goto: "js_template_inner", highlight: "annotation", when: "=>" },
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "regexp", tag: ["T_REGEX"], when: /\/(?:[^\/\\\r\n]|\\.)+\// },
                        { tag: ["L_QMARK"], when: "?" },
                        { tag: ["L_PLUS"], when: "+" },
                        { tag: ["L_STAR"], when: "*" },
                        { highlight: "string", tag: ["T_STRING"], when: /"(?:[^"\\\r\n]|\\.)*"/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", tag: ["L_COLON"], when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { tag: ["L_SCOLON"], when: ";" },
                        { tag: ["L_COMMA"], when: "," },
                        { highlight: "keyword", tag: ["L_PIPE"], when: "|" },
                        { tag: ["L_PARENL"], when: "(" },
                        { tag: ["L_PARENR"], when: ")" },
                        { tag: ["ABRACKET_L"], when: "<" },
                        { tag: ["ABRACKET_R"], when: ">" },
                        { highlight: "keyword", tag: ["L_ARROW"], when: "->" },
                        { tag: ["L_DSIGN"], when: "$" },
                        { tag: ["L_DASH"], when: "-" },
                        { set: "main", tag: ["CBRACKET_R"], when: "}" }
                    ]
                },
                grammar$opener: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { skip: true, when: /\s+/ },
                        { goto: "grammar$body", tag: ["CBRACKET_L"], when: "{" }
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
                        { set: "js_literal", tag: ["T_JSBODY"], when: "{" }
                    ]
                },
                js_literal: {
                    regex: /(?:(?:("(?:[^"\\\r\n]|\\.)*"))|(?:('(?:[^'\\\r\n]|\\.)*'))|(?:(`(?:[^`\\]|\\.)*`))|(?:(\/(?:[^\/\\\r\n]|\\.)+\/[gmiyu]*))|(?:(\/\/[^\n]*))|(?:(\/\*.*\*\/))|(?:((?:\{)))|(?:((?:\})))|(?:((?:\()))|(?:((?:\)))))/gm,
                    rules: [
                        { tag: ["T_JSBODY"], when: /"(?:[^"\\\r\n]|\\.)*"/ },
                        { tag: ["T_JSBODY"], when: /'(?:[^'\\\r\n]|\\.)*'/ },
                        { tag: ["T_JSBODY"], when: /`(?:[^`\\]|\\.)*`/ },
                        { tag: ["T_JSBODY"], when: /\/(?:[^\/\\\r\n]|\\.)+\/[gmiyu]*/ },
                        { tag: ["T_JSBODY"], when: /\/\/[^\n]*/ },
                        { tag: ["T_JSBODY"], when: /\/\*.*\*\// },
                        { goto: "js_literal", highlight: "annotation", tag: ["T_JSBODY"], when: "{" },
                        { highlight: "annotation", pop: 1, tag: ["T_JSBODY"], when: "}" },
                        { goto: "js_literal", highlight: "annotation", tag: ["T_JSBODY"], when: "(" },
                        { highlight: "annotation", pop: 1, tag: ["T_JSBODY"], when: ")" }
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
                    regex: /(?:(?:("(?:[^"\\\r\n]|\\.)*"))|(?:('(?:[^'\\\r\n]|\\.)*'))|(?:(`(?:[^`\\]|\\.)*`))|(?:(\/(?:[^\/\\\r\n]|\\.)+\/[gmiyu]*))|(?:(\/\/[^\n]*))|(?:(\/\*.*\*\/)))/ym,
                    rules: [
                        { tag: ["T_JSBODY"], when: /"(?:[^"\\\r\n]|\\.)*"/ },
                        { tag: ["T_JSBODY"], when: /'(?:[^'\\\r\n]|\\.)*'/ },
                        { tag: ["T_JSBODY"], when: /`(?:[^`\\]|\\.)*`/ },
                        { tag: ["T_JSBODY"], when: /\/(?:[^\/\\\r\n]|\\.)+\/[gmiyu]*/ },
                        { tag: ["T_JSBODY"], when: /\/\/[^\n]*/ },
                        { tag: ["T_JSBODY"], when: /\/\*.*\*\// }
                    ]
                },
                kv: {
                    regex: /(?:(?:("(?:[^"\\\r\n]|\\.)*"))|(?:(\s+))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;))))/ym,
                    rules: [
                        { highlight: "string", tag: ["T_STRING"], when: /"(?:[^"\\\r\n]|\\.)*"/ },
                        { tag: ["T_WS"], when: /\s+/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", tag: ["L_COLON"], when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { tag: ["L_SCOLON"], when: ";" }
                    ]
                },
                l_abracketl: {
                    regex: /(?:(?:((?:<))))/ym,
                    rules: [
                        { tag: ["ABRACKET_L"], when: "<" }
                    ]
                },
                l_abracketr: {
                    regex: /(?:(?:((?:>))))/ym,
                    rules: [
                        { tag: ["ABRACKET_R"], when: ">" }
                    ]
                },
                l_arrow: {
                    regex: /(?:(?:((?:\->))))/ym,
                    rules: [
                        { highlight: "keyword", tag: ["L_ARROW"], when: "->" }
                    ]
                },
                l_colon: {
                    regex: /(?:(?:((?::))))/ym,
                    rules: [
                        { highlight: "keyword", tag: ["L_COLON"], when: ":" }
                    ]
                },
                l_comma: {
                    regex: /(?:(?:((?:,))))/ym,
                    rules: [
                        { tag: ["L_COMMA"], when: "," }
                    ]
                },
                l_dash: {
                    regex: /(?:(?:((?:\-))))/ym,
                    rules: [
                        { tag: ["L_DASH"], when: "-" }
                    ]
                },
                l_dsign: {
                    regex: /(?:(?:((?:\$))))/ym,
                    rules: [
                        { tag: ["L_DSIGN"], when: "$" }
                    ]
                },
                l_parenl: {
                    regex: /(?:(?:((?:\())))/ym,
                    rules: [
                        { tag: ["L_PARENL"], when: "(" }
                    ]
                },
                l_parenr: {
                    regex: /(?:(?:((?:\)))))/ym,
                    rules: [
                        { tag: ["L_PARENR"], when: ")" }
                    ]
                },
                l_pipe: {
                    regex: /(?:(?:((?:\|))))/ym,
                    rules: [
                        { highlight: "keyword", tag: ["L_PIPE"], when: "|" }
                    ]
                },
                l_plus: {
                    regex: /(?:(?:((?:\+))))/ym,
                    rules: [
                        { tag: ["L_PLUS"], when: "+" }
                    ]
                },
                l_qmark: {
                    regex: /(?:(?:((?:\?))))/ym,
                    rules: [
                        { tag: ["L_QMARK"], when: "?" }
                    ]
                },
                l_scolon: {
                    regex: /(?:(?:((?:;))))/ym,
                    rules: [
                        { tag: ["L_SCOLON"], when: ";" }
                    ]
                },
                l_star: {
                    regex: /(?:(?:((?:\*))))/ym,
                    rules: [
                        { tag: ["L_STAR"], when: "*" }
                    ]
                },
                lexer: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { skip: true, when: /\s+/ },
                        { goto: "lexer$body", tag: ["CBRACKET_L"], when: "{" }
                    ]
                },
                lexer$body: {
                    regex: /(?:(?:(\s+))|(?:(\/\/[^\n]*))|(?:(\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]))|(?:(\/(?:[^\/\\\r\n]|\\.)+\/))|(?:((?:,)))|(?:((?:\->)))|(?:((?:\-)))|(?:("(?:[^"\\\r\n]|\\.)*"))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;)))|(?:((?:\{)))|(?:((?:\}))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ },
                        { highlight: "type.identifier", tag: ["T_SECTWORD"], when: /\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]/ },
                        { highlight: "regexp", tag: ["T_REGEX"], when: /\/(?:[^\/\\\r\n]|\\.)+\// },
                        { tag: ["L_COMMA"], when: "," },
                        { highlight: "keyword", tag: ["L_ARROW"], when: "->" },
                        { tag: ["L_DASH"], when: "-" },
                        { highlight: "string", tag: ["T_STRING"], when: /"(?:[^"\\\r\n]|\\.)*"/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", tag: ["L_COLON"], when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { tag: ["L_SCOLON"], when: ";" },
                        { goto: "lexer_sections$body", tag: ["CBRACKET_L"], when: "{" },
                        { set: "main", tag: ["CBRACKET_R"], when: "}" }
                    ]
                },
                lexer$opener: {
                    regex: /(?:(?:(\s+))|(?:((?:\{))))/ym,
                    rules: [
                        { skip: true, when: /\s+/ },
                        { goto: "lexer$body", tag: ["CBRACKET_L"], when: "{" }
                    ]
                },
                lexer_sections: {
                    regex: /(?:(?:((?:\{))))/ym,
                    rules: [
                        { goto: "lexer_sections$body", tag: ["CBRACKET_L"], when: "{" }
                    ]
                },
                lexer_sections$body: {
                    regex: /(?:(?:(\s+))|(?:(\/\/[^\n]*))|(?:(\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]))|(?:(\/(?:[^\/\\\r\n]|\\.)+\/))|(?:((?:,)))|(?:((?:\->)))|(?:((?:\-)))|(?:("(?:[^"\\\r\n]|\\.)*"))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;)))|(?:((?:\}))))/ym,
                    rules: [
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ },
                        { highlight: "type.identifier", tag: ["T_SECTWORD"], when: /\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]/ },
                        { highlight: "regexp", tag: ["T_REGEX"], when: /\/(?:[^\/\\\r\n]|\\.)+\// },
                        { tag: ["L_COMMA"], when: "," },
                        { highlight: "keyword", tag: ["L_ARROW"], when: "->" },
                        { tag: ["L_DASH"], when: "-" },
                        { highlight: "string", tag: ["T_STRING"], when: /"(?:[^"\\\r\n]|\\.)*"/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", tag: ["L_COLON"], when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { tag: ["L_SCOLON"], when: ";" },
                        { pop: 1, tag: ["CBRACKET_R"], when: "}" }
                    ]
                },
                lexer_sections$closer: {
                    regex: /(?:(?:((?:\}))))/ym,
                    rules: [
                        { pop: 1, tag: ["CBRACKET_R"], when: "}" }
                    ]
                },
                lexer_sections$opener: {
                    regex: /(?:(?:((?:\{))))/ym,
                    rules: [
                        { goto: "lexer_sections$body", tag: ["CBRACKET_L"], when: "{" }
                    ]
                },
                main: {
                    regex: /(?:(?:("(?:[^"\\\r\n]|\\.)*"))|(?:(\s+))|(?:(\/\/[^\n]*))|(?:((?:\*)))|(?:(head(?![a-zA-Z\d_])))|(?:(body(?![a-zA-Z\d_])))|(?:(lexer(?![a-zA-Z\d_])))|(?:(grammar(?![a-zA-Z\d_])))|(?:(config(?![a-zA-Z\d_])))|(?:([a-zA-Z_][a-zA-Z_\d]*))|(?:((?::)))|(?:(\d+))|(?:((?:;))))/ym,
                    rules: [
                        { highlight: "string", tag: ["T_STRING"], when: /"(?:[^"\\\r\n]|\\.)*"/ },
                        { tag: ["T_WS"], when: /\s+/ },
                        { highlight: "comment", tag: ["T_COMMENT"], when: /\/\/[^\n]*/ },
                        { tag: ["L_STAR"], when: "*" },
                        { goto: "js_body", highlight: "tag", tag: ["T_WORD"], when: /head(?![a-zA-Z\d_])/ },
                        { goto: "js_body", highlight: "tag", tag: ["T_WORD"], when: /body(?![a-zA-Z\d_])/ },
                        { highlight: "tag", set: "lexer", tag: ["T_WORD"], when: /lexer(?![a-zA-Z\d_])/ },
                        { highlight: "tag", set: "grammar", tag: ["T_WORD"], when: /grammar(?![a-zA-Z\d_])/ },
                        { highlight: "tag", set: "config", tag: ["T_WORD"], when: /config(?![a-zA-Z\d_])/ },
                        { tag: ["T_WORD"], when: /[a-zA-Z_][a-zA-Z_\d]*/ },
                        { highlight: "keyword", tag: ["L_COLON"], when: ":" },
                        { highlight: "number", tag: ["T_INTEGER"], when: /\d+/ },
                        { tag: ["L_SCOLON"], when: ";" }
                    ]
                },
                regex: {
                    regex: /(?:(?:(\/(?:[^\/\\\r\n]|\\.)+\/)))/ym,
                    rules: [
                        { highlight: "regexp", tag: ["T_REGEX"], when: /\/(?:[^\/\\\r\n]|\\.)+\// }
                    ]
                },
                section_word: {
                    regex: /(?:(?:(\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\])))/ym,
                    rules: [
                        { highlight: "type.identifier", tag: ["T_SECTWORD"], when: /\[\s*[a-zA-Z_][a-zA-Z_\d]*\s*\]/ }
                    ]
                },
                string: {
                    regex: /(?:(?:("(?:[^"\\\r\n]|\\.)*")))/ym,
                    rules: [
                        { highlight: "string", tag: ["T_STRING"], when: /"(?:[^"\\\r\n]|\\.)*"/ }
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
}

export default GWLanguage;