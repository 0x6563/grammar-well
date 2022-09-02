// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well

 
    function Insensitive({ literal }) {
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
            rules: [
                { name: "main", symbols: ["_", "section_list", "_"], postprocess: ({data}) => { return  data[1] ; }},
                { name: "section_list", symbols: ["section"], postprocess: ({data}) => { return  [data[0]] ; }},
                { name: "section_list", symbols: ["section", "T_WS", "section_list"], postprocess: ({data}) => { return  [data[0]].concat(data[2]) ; }},
                { name: "section", symbols: ["K_CONFIG", "_", "L_TEMPLATEL", "_", "kv_list", "_", "L_TEMPLATER"], postprocess: ({data}) => { return  ({ config: Rollup(data[4]) }) ; }},
                { name: "section", symbols: ["K_LEXER", "_", "L_TEMPLATEL", "_", "lexer", "_", "L_TEMPLATER"], postprocess: ({data}) => { return  ({ lexer: Rollup(data[4]) }) ; }},
                { name: "section", symbols: ["K_GRAMMAR", "_", "L_TEMPLATEL", "_", "grammar", "_", "L_TEMPLATER"], postprocess: ({data}) => { return  ({ grammar: data[4] }) ; }},
                { name: "section", symbols: ["K_IMPORT", "_", "T_WORD"], postprocess: ({data}) => { return  ({ import: data[2] } ) ; }},
                { name: "section", symbols: ["K_BODY", "_", "T_JS"], postprocess: ({data}) => { return  ({ body: data[2] } ) ; }},
                { name: "section", symbols: ["K_HEAD", "_", "T_JS"], postprocess: ({data}) => { return  ({ head: data[2] } ) ; }},
                { name: "section", symbols: ["K_IMPORT", "_", "T_STRING"], postprocess: ({data}) => { return  ({ import: data[2], path: true }) ; }},
                { name: "section", symbols: ["K_BODY", "_", "T_STRING"], postprocess: ({data}) => { return  ({ body: data[2], path: true }) ; }},
                { name: "section", symbols: ["K_HEAD", "_", "T_STRING"], postprocess: ({data}) => { return  ({ head: data[2], path: true }) ; }},
                { name: "lexer", symbols: ["kv_list", "_", "state_list"], postprocess: ({data}) => { return  data[0].concat({ states: data[2] }) ; }},
                { name: "lexer", symbols: ["state_list"], postprocess: ({data}) => { return  [{ states: data[0] }] ; }},
                { name: "state_list", symbols: ["state"], postprocess: ({data}) => { return  data ; }},
                { name: "state_list", symbols: ["state", "_", "state_list"], postprocess: ({data}) => { return  [data[0]].concat(data[2]) ; }},
                { name: "state", symbols: ["state_declare", "_", "state_definition"], postprocess: ({data}) => { return  Rollup([{ name: data[0] }].concat(data[2])) ; }},
                { name: "state_declare", symbols: ["T_WORD", "_", "L_ARROW"], postprocess: ({data}) => { return  data[0] ; }},
                { name: "state_definition", symbols: ["kv_list", "_", "token_list"], postprocess: ({data}) => { return  Rollup(data[0].concat([{rules: data[2]}])) ; }},
                { name: "state_definition", symbols: ["token_list"], postprocess: ({data}) => { return  ({ rules: data[0] }) ; }},
                { name: "word_list", symbols: ["T_WORD"], postprocess: ({data}) => { return  [data[0]] ; }},
                { name: "word_list", symbols: ["T_WORD", "_", "L_COMMA", "_", "word_list"], postprocess: ({data}) => { return  [data[0]].concat(data[4]) ; }},
                { name: "token_list", symbols: ["token"], postprocess: ({data}) => { return  data ; }},
                { name: "token_list", symbols: ["token", "_", "token_list"], postprocess: ({data}) => { return  [data[0]].concat(data[2]) ; }},
                { name: "token", symbols: ["L_DASH", "_", "K_IMPORT", "_", "L_COLON", "_", "word_list"], postprocess: ({data}) => { return  ({ import: data[6] }) ; }},
                { name: "token", symbols: ["L_DASH", "_", "token_definition_list"], postprocess: ({data}) => { return  Rollup(data[2]) ; }},
                { name: "token_definition_list", symbols: ["token_definition"], postprocess: ({data}) => { return  data ; }},
                { name: "token_definition_list", symbols: ["token_definition", "_", "token_definition_list"], postprocess: ({data}) => { return  [data[0]].concat(data[2]) ; }},
                { name: "token_definition", symbols: ["tag"], postprocess: ({data}) => { return  data[0] ; }},
                { name: "token_definition", symbols: ["when"], postprocess: ({data}) => { return  data[0] ; }},
                { name: "token_definition", symbols: ["pop"], postprocess: ({data}) => { return  data[0] ; }},
                { name: "token_definition", symbols: ["inset"], postprocess: ({data}) => { return  data[0] ; }},
                { name: "token_definition", symbols: ["set"], postprocess: ({data}) => { return  data[0] ; }},
                { name: "token_definition", symbols: ["goto"], postprocess: ({data}) => { return  data[0] ; }},
                { name: "token_definition", symbols: ["type"], postprocess: ({data}) => { return  data[0] ; }},
                { name: "tag", symbols: ["K_TAG", "_", "L_COLON", "_", "string_list"], postprocess: ({data}) => { return  ({ tag: data[4] }) ; }},
                { name: "when", symbols: ["K_WHEN", "_", "L_COLON", "_", "T_STRING"], postprocess: ({data}) => { return  ({ when: data[4] }) ; }},
                { name: "when", symbols: ["K_WHEN", "_", "L_COLON", "_", "T_REGEX"], postprocess: ({data}) => { return  ({ when: data[4] }) ; }},
                { name: "type", symbols: ["K_TYPE", "_", "L_COLON", "_", "T_STRING"], postprocess: ({data}) => { return  ({ type: data[4] }) ; }},
                { name: "pop", symbols: ["K_POP"], postprocess: ({data}) => { return  ({ pop: 1 }) ; }},
                { name: "pop", symbols: ["K_POP", "_", "L_COLON", "_", "T_INTEGER"], postprocess: ({data}) => { return  ({ pop: parseInt(data[4]) }) ; }},
                { name: "pop", symbols: ["K_POP", "_", "L_COLON", "_", "K_ALL"], postprocess: ({data}) => { return  ({ pop: "all" }) ; }},
                { name: "inset", symbols: ["K_INSET"], postprocess: ({data}) => { return  ({ inset: 1 }) ; }},
                { name: "inset", symbols: ["K_INSET", "_", "L_COLON", "_", "T_INTEGER"], postprocess: ({data}) => { return  ({ inset: parseInt(data[4]) }) ; }},
                { name: "set", symbols: ["K_SET", "_", "L_COLON", "_", "T_WORD"], postprocess: ({data}) => { return  ({ set: data[4] }) ; }},
                { name: "goto", symbols: ["K_GOTO", "_", "L_COLON", "_", "T_WORD"], postprocess: ({data}) => { return  ({ goto: data[4] }) ; }},
                { name: "grammar", symbols: ["kv_list", "_", "rule_list"], postprocess: ({data}) => { return  ({ config: Rollup(data[0]), rules: data[2] }) ; }},
                { name: "grammar", symbols: ["rule_list"], postprocess: ({data}) => { return  ({ rules: data[0] }) ; }},
                { name: "rule_list", symbols: ["rule"], postprocess: ({data}) => { return  [data[0]] ; }},
                { name: "rule_list", symbols: ["rule", "_", "rule_list"], postprocess: ({data}) => { return  [data[0]].concat(data[2]) ; }},
                { name: "rule", symbols: ["T_WORD", "_", "L_ARROW", "_", "expression_ext"], postprocess: ({data}) => { return  ({ name: data[0], rules: data[4] }) ; }},
                { name: "expression_ext", symbols: ["completeexpression"]},
                { name: "expression_ext", symbols: ["expression_ext", "_", "L_PIPE", "_", "completeexpression"], postprocess: ({data}) => { return  data[0].concat([data[4]]) ; }},
                { name: "completeexpression", symbols: ["expr"], postprocess: ({data}) => { return  ({ tokens: data[0] }) ; }},
                { name: "completeexpression", symbols: ["expr", "_", "T_JS"], postprocess: ({data}) => { return  ({ tokens: data[0], postprocess: data[2] }) ; }},
                { name: "completeexpression", symbols: ["expr", "_", "T_GRAMMAR_TEMPLATE"], postprocess: ({data}) => { return  ({ tokens: data[0], postprocess: TemplatePostProcess(data[2]) }) ; }},
                { name: "expr_member", symbols: ["T_WORD"], postprocess: ({data}) => { return  data[0] ; }},
                { name: "expr_member$ebnf$1", symbols: [{"literal":"i"}], postprocess: ({data}) => data[0]},
                { name: "expr_member$ebnf$1", symbols: [], postprocess: () => null},
                { name: "expr_member", symbols: ["T_STRING", "expr_member$ebnf$1"], postprocess: ({data}) => { return  data[1] ? Insensitive(data[0]) : { literal: data[0] } ; }},
                { name: "expr_member", symbols: ["L_DSIGN", "T_WORD"], postprocess: ({data}) => { return  ({ token: data[1]}) ; }},
                { name: "expr_member", symbols: ["L_DSIGN", "T_STRING"], postprocess: ({data}) => { return  ({ token: data[1]}) ; }},
                { name: "expr_member", symbols: ["T_CHARCLASS"], postprocess: ({data}) => { return  { regex: data[0] } ; }},
                { name: "expr_member", symbols: ["L_PARENL", "_", "expression_ext", "_", "L_PARENR"], postprocess: ({data}) => { return  ({ 'subexpression': data[2] }) ; }},
                { name: "expr_member", symbols: ["expr_member", "_", "ebnf_modifier"], postprocess: ({data}) => { return  ({ 'ebnf': data[0], 'modifier': data[2] }) ; }},
                { name: "ebnf_modifier", symbols: ["L_EBNF_0"], postprocess: ({data}) => { return  data[0][0].value ; }},
                { name: "ebnf_modifier", symbols: ["L_EBNF_1N"], postprocess: ({data}) => { return  data[0][0].value ; }},
                { name: "ebnf_modifier", symbols: ["L_EBNF_0N"], postprocess: ({data}) => { return  data[0][0].value ; }},
                { name: "expr", symbols: ["expr_member"]},
                { name: "expr", symbols: ["expr", "T_WS", "expr_member"], postprocess: ({data}) => { return  data[0].concat([data[2]]) ; }},
                { name: "kv_list", symbols: ["kv"], postprocess: ({data}) => { return  data ; }},
                { name: "kv_list", symbols: ["kv", "_", "kv_list"], postprocess: ({data}) => { return  [data[0]].concat(data[2]) ; }},
                { name: "kv$subexpression$1", symbols: ["T_WORD"]},
                { name: "kv$subexpression$1", symbols: ["T_STRING"]},
                { name: "kv$subexpression$1", symbols: ["T_INTEGER"]},
                { name: "kv", symbols: ["T_WORD", "_", "L_COLON", "_", "kv$subexpression$1"], postprocess: ({data}) => { return  ({ [data[0]]: data[4][0] }) ; }},
                { name: "string_list", symbols: ["T_STRING"], postprocess: ({data}) => { return  [data[0]] ; }},
                { name: "string_list", symbols: ["T_STRING", "_", "L_COMMA", "_", "string_list"], postprocess: ({data}) => { return  [data[0]].concat(data[4]) ; }},
                { name: "_$ebnf$1", symbols: ["T_WS"], postprocess: ({data}) => data[0]},
                { name: "_$ebnf$1", symbols: [], postprocess: () => null},
                { name: "_", symbols: ["_$ebnf$1"], postprocess: ({data}) => { return  null ; }},
                { name: "L_COLON", symbols: [{ type: "L_COLON"}]},
                { name: "L_EBNF_0", symbols: [{ type: "L_EBNF_0"}]},
                { name: "L_EBNF_1N", symbols: [{ type: "L_EBNF_1N"}]},
                { name: "L_EBNF_0N", symbols: [{ type: "L_EBNF_0N"}]},
                { name: "L_COMMA", symbols: [{ type: "L_COMMA"}]},
                { name: "L_PIPE", symbols: [{ type: "L_PIPE"}]},
                { name: "L_PARENL", symbols: [{ type: "L_PARENL"}]},
                { name: "L_PARENR", symbols: [{ type: "L_PARENR"}]},
                { name: "L_TEMPLATEL", symbols: [{ type: "L_TEMPLATEL"}]},
                { name: "L_TEMPLATER", symbols: [{ type: "L_TEMPLATER"}]},
                { name: "L_ARROW", symbols: [{ type: "L_ARROW"}]},
                { name: "L_DSIGN", symbols: [{ type: "L_DSIGN"}]},
                { name: "L_DASH", symbols: [{ type: "L_DASH"}]},
                { name: "K_ALL", symbols: [{"literal":"all"}]},
                { name: "K_TAG", symbols: [{"literal":"tag"}]},
                { name: "K_TYPE", symbols: [{"literal":"type"}]},
                { name: "K_WHEN", symbols: [{"literal":"when"}]},
                { name: "K_POP", symbols: [{"literal":"pop"}]},
                { name: "K_INSET", symbols: [{"literal":"inset"}]},
                { name: "K_SET", symbols: [{"literal":"set"}]},
                { name: "K_GOTO", symbols: [{"literal":"goto"}]},
                { name: "K_CONFIG", symbols: [{"literal":"config"}]},
                { name: "K_LEXER", symbols: [{"literal":"lexer"}]},
                { name: "K_GRAMMAR", symbols: [{"literal":"grammar"}]},
                { name: "K_IMPORT", symbols: [{"literal":"import"}]},
                { name: "K_BODY", symbols: [{"literal":"body"}]},
                { name: "K_HEAD", symbols: [{"literal":"head"}]},
                { name: "T_JS$ebnf$1", symbols: []},
                { name: "T_JS$ebnf$1", symbols: ["T_JS$ebnf$1", { type: "T_JSBODY"}], postprocess: ({data}) => data[0].concat([data[1]])},
                { name: "T_JS", symbols: [{ type: "L_JSL"}, "T_JS$ebnf$1", { type: "L_JSR"}], postprocess: ({data}) => { return  data[1].map(v=>v.value).join('') ; }},
                { name: "T_GRAMMAR_TEMPLATE$ebnf$1", symbols: []},
                { name: "T_GRAMMAR_TEMPLATE$ebnf$1", symbols: ["T_GRAMMAR_TEMPLATE$ebnf$1", { type: "T_JSBODY"}], postprocess: ({data}) => data[0].concat([data[1]])},
                { name: "T_GRAMMAR_TEMPLATE", symbols: [{ type: "L_TEMPLATEL"}, "_", "T_GRAMMAR_TEMPLATE$ebnf$1", "_", { type: "L_TEMPLATER"}], postprocess: ({data}) => { return  data[2].map(v=>v.value).join('') ; }},
                { name: "T_STRING", symbols: [{ type: "T_STRING"}], postprocess: ({data}) => { return  JSON.parse(data[0].value) ; }},
                { name: "T_WORD", symbols: [{ type: "T_WORD"}], postprocess: ({data}) => { return  data[0].value ; }},
                { name: "T_REGEX$ebnf$1", symbols: []},
                { name: "T_REGEX$ebnf$1", symbols: ["T_REGEX$ebnf$1", /[gmiuy]/], postprocess: ({data}) => data[0].concat([data[1]])},
                { name: "T_REGEX", symbols: [{ type: "T_REGEX"}, "T_REGEX$ebnf$1"], postprocess: ({data}) => { return  ({ regex: data[0].value.slice(1,-1), flags: data[1].join('') }) ; }},
                { name: "T_COMMENT", symbols: [{ type: "T_COMMENT"}]},
                { name: "T_CHARCLASS", symbols: [{ type: "T_CHARCLASS"}], postprocess: ({data}) => { return  data[0].value ; }},
                { name: "T_INTEGER", symbols: [{ type: "T_INTEGER"}], postprocess: ({data}) => { return  data[0].value ; }},
                { name: "T_WS", symbols: [{ type: "T_WS"}], postprocess: ({data}) => { return  null ; }}
            ]
        },
        lexer:{
            start: "start",
            states: [
                {
                    name: "start",
                    rules: [
                        { import: ["string","js_pre","ws","comment"] },
                        { when: /lexer(?![a-zA-Z\d_])/, type: "T_WORD", goto: "lexer_pre" },
                        { when: /grammar(?![a-zA-Z\d_])/, type: "T_WORD", goto: "grammar_pre" },
                        { when: /config(?![a-zA-Z\d_])/, type: "T_WORD", goto: "config_pre" },
                        { import: ["kv"] }
                    ]
                },
                {
                    name: "config_pre",
                    rules: [
                        { import: ["ws"] },
                        { when: "{{", type: "L_TEMPLATEL", set: "config" }
                    ]
                },
                {
                    name: "config",
                    rules: [
                        { import: ["comment","kv"] },
                        { when: "}}", type: "L_TEMPLATER", pop: 1 }
                    ]
                },
                {
                    name: "grammar_pre",
                    rules: [
                        { import: ["ws"] },
                        { when: "{{", type: "L_TEMPLATEL", set: "grammar" }
                    ]
                },
                {
                    name: "grammar",
                    rules: [
                        { import: ["comment","js_pre","js_templatepre","ws","regex","charclass","l_ebnf_0","l_ebnf_1n","l_ebnf_0n","kv","l_colon","l_comma","l_pipe","l_parenl","l_parenr","l_arrow","l_dsign","l_dash"] },
                        { when: "}}", type: "L_TEMPLATER", pop: 1 }
                    ]
                },
                {
                    name: "lexer_pre",
                    rules: [
                        { import: ["ws"] },
                        { when: "{{", type: "L_TEMPLATEL", set: "lexer" }
                    ]
                },
                {
                    name: "lexer",
                    rules: [
                        { import: ["ws","comment","regex","l_comma","l_arrow","l_dash","kv","js_pre"] },
                        { when: "}}", type: "L_TEMPLATER", pop: 1 }
                    ]
                },
                {
                    name: "js_pre",
                    rules: [
                        { when: "${", type: "L_JSL", goto: "js_wrap" }
                    ]
                },
                {
                    name: "js_wrap",
                    default: "T_JSBODY",
                    unmatched: "T_JSBODY",
                    rules: [
                        { import: ["jsignore"] },
                        { when: "{", type: "T_JSBODY", goto: "js" },
                        { when: "}", type: "L_JSR", pop: 1 }
                    ]
                },
                {
                    name: "js",
                    default: "T_JSBODY",
                    unmatched: "T_JSBODY",
                    rules: [
                        { import: ["jsignore"] },
                        { when: "{", type: "T_JSBODY", goto: "js" },
                        { when: "}", type: "T_JSBODY", pop: 1 }
                    ]
                },
                {
                    name: "js_templatepre",
                    rules: [
                        { when: "{{", type: "L_TEMPLATEL", goto: "js_templatewrap" }
                    ]
                },
                {
                    name: "js_templatewrap",
                    default: "T_JSBODY",
                    unmatched: "T_JSBODY",
                    rules: [
                        { import: ["jsignore"] },
                        { when: "{", type: "T_JSBODY", goto: "js" },
                        { when: "}}", type: "L_TEMPLATER", pop: 1 }
                    ]
                },
                {
                    name: "kv",
                    rules: [
                        { import: ["string","ws","word","l_colon","integer"] }
                    ]
                },
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
                {
                    name: "string",
                    rules: [
                        { when: /"(?:[^"\\\r\n]|\\.)*"/, type: "T_STRING" }
                    ]
                },
                {
                    name: "string2",
                    rules: [
                        { when: /'(?:[^'\\\r\n]|\\.)*'/, type: "T_STRING" }
                    ]
                },
                {
                    name: "string3",
                    rules: [
                        { when: /`(?:[^`\\]|\\.)*`/, type: "T_STRING" }
                    ]
                },
                {
                    name: "charclass",
                    rules: [
                        { when: /\[(?:[^\]\\]|\\.)+\]/, type: "T_CHARCLASS" }
                    ]
                },
                {
                    name: "regex",
                    rules: [
                        { when: /\/(?:[^\/\\\r\n]|\\.)+\//, type: "T_REGEX" }
                    ]
                },
                {
                    name: "integer",
                    rules: [
                        { when: /\d+/, type: "T_INTEGER" }
                    ]
                },
                {
                    name: "word",
                    rules: [
                        { when: /[a-zA-Z_][a-zA-Z_\d]*/, type: "T_WORD" }
                    ]
                },
                {
                    name: "ws",
                    rules: [
                        { when: /\s+/, type: "T_WS" }
                    ]
                },
                {
                    name: "l_colon",
                    rules: [
                        { when: ":", type: "L_COLON" }
                    ]
                },
                {
                    name: "l_ebnf_0",
                    rules: [
                        { when: ":?", type: "L_EBNF_0" }
                    ]
                },
                {
                    name: "l_ebnf_1n",
                    rules: [
                        { when: ":+", type: "L_EBNF_1N" }
                    ]
                },
                {
                    name: "l_ebnf_0n",
                    rules: [
                        { when: ":*", type: "L_EBNF_0N" }
                    ]
                },
                {
                    name: "l_comma",
                    rules: [
                        { when: ",", type: "L_COMMA" }
                    ]
                },
                {
                    name: "l_pipe",
                    rules: [
                        { when: "|", type: "L_PIPE" }
                    ]
                },
                {
                    name: "l_parenl",
                    rules: [
                        { when: "(", type: "L_PARENL" }
                    ]
                },
                {
                    name: "l_parenr",
                    rules: [
                        { when: ")", type: "L_PARENR" }
                    ]
                },
                {
                    name: "l_templatel",
                    rules: [
                        { when: "{{", type: "L_TEMPLATEL" }
                    ]
                },
                {
                    name: "l_templater",
                    rules: [
                        { when: "}}", type: "L_TEMPLATER" }
                    ]
                },
                {
                    name: "l_arrow",
                    rules: [
                        { when: "->", type: "L_ARROW" }
                    ]
                },
                {
                    name: "l_dsign",
                    rules: [
                        { when: "$", type: "L_DSIGN" }
                    ]
                },
                {
                    name: "l_dash",
                    rules: [
                        { when: "-", type: "L_DASH" }
                    ]
                },
                {
                    name: "comment",
                    rules: [
                        { when: /\/\/[\n]*/, type: "T_COMMENT" }
                    ]
                },
                {
                    name: "commentmulti",
                    rules: [
                        { when: /\/\*.*\*\//, type: "T_COMMENT" }
                    ]
                }
            ]
        }
    }
}

export default GWLanguage;