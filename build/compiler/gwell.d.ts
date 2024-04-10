export default GWLanguage;
declare function GWLanguage(): {
    grammar: {
        start: string;
        rules: {
            main: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            section_list: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
            }[];
            section: ({
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    config: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    import: any;
                };
            } | {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    import: any;
                    alias: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    lexer: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    grammar: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    body: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    head: any;
                };
            })[];
            lexer: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            state_list: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            state: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            state_declare: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            state_definition: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            token_list: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            token: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            token_definition_list: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            token_definition: ({
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    tag: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    when: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    pop: number;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    pop: string;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    highlight: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    embed: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    unembed: boolean;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    inset: number;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    set: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    goto: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    type: any;
                };
            })[];
            grammar: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    rules: any;
                };
            }[];
            grammar_rule_list: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
            }[];
            grammar_rule: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    name: any;
                    expressions: any;
                };
            }[];
            expression_list: ({
                name: string;
                symbols: string[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            expression: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    symbols: any;
                };
            }[];
            expression_symbol_list: ({
                name: string;
                symbols: string[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            expression_symbol: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            expression_symbol_match: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            expression_symbol_match$RPT01x1: {
                name: string;
                symbols: {
                    literal: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            expression_repeater: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            kv_list: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            kv$SUBx1: {
                name: string;
                symbols: string[];
            }[];
            kv: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    [x: number]: any;
                };
            }[];
            string_list: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
            }[];
            word_list: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
            }[];
            _$RPT0Nx1: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            _$RPT0Nx1$SUBx1: {
                name: string;
                symbols: string[];
            }[];
            _: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            __$RPT1Nx1$SUBx1: {
                name: string;
                symbols: string[];
            }[];
            __$RPT1Nx1: ({
                name: string;
                symbols: string[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            __$RPT1Nx1$SUBx2: {
                name: string;
                symbols: string[];
            }[];
            __: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            L_COLON: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_SCOLON: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_QMARK: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_PLUS: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_STAR: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_COMMA: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_PIPE: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_PARENL: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_PARENR: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_TEMPLATEL: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_TEMPLATER: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_ARROW: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_DSIGN: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_DASH: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            K_ALL: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_TAG: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_FROM: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_TYPE: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_WHEN: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_POP: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_HIGHLIGHT: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_EMBED: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_UNEMBED: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_INSET: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_SET: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_GOTO: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_CONFIG: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_LEXER: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_GRAMMAR: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_IMPORT: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_BODY: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            K_HEAD: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            T_JS$RPT0Nx1: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | {
                    token: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            T_JS: {
                name: string;
                symbols: (string | {
                    token: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    js: any;
                };
            }[];
            T_GRAMMAR_TEMPLATE$RPT0Nx1: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | {
                    token: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            T_GRAMMAR_TEMPLATE: {
                name: string;
                symbols: (string | {
                    token: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    template: any;
                };
            }[];
            T_STRING: {
                name: string;
                symbols: {
                    token: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            T_WORD: {
                name: string;
                symbols: {
                    token: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            T_REGEX$RPT0Nx1: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | RegExp)[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            T_REGEX: {
                name: string;
                symbols: (string | {
                    token: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    regex: any;
                    flags: any;
                };
            }[];
            T_COMMENT: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            T_INTEGER: {
                name: string;
                symbols: {
                    token: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            T_WS: {
                name: string;
                symbols: {
                    token: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
        };
    };
    lexer: {
        start: string;
        states: {
            start: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    tag?: undefined;
                    highlight?: undefined;
                    goto?: undefined;
                } | {
                    when: RegExp;
                    tag: string[];
                    highlight: string;
                    goto: string;
                    import?: undefined;
                })[];
            };
            config: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    tag?: undefined;
                    set?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    set: string;
                    import?: undefined;
                })[];
            };
            config_inner: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    tag?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    pop: number;
                    import?: undefined;
                })[];
            };
            grammar: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    tag?: undefined;
                    set?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    set: string;
                    import?: undefined;
                })[];
            };
            grammar_inner: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    tag?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    pop: number;
                    import?: undefined;
                })[];
            };
            lexer: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    tag?: undefined;
                    set?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    set: string;
                    import?: undefined;
                })[];
            };
            lexer_inner: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    tag?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    pop: number;
                    import?: undefined;
                })[];
            };
            js: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                    goto: string;
                }[];
            };
            js_wrap: {
                name: string;
                default: string;
                unmatched: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    tag?: undefined;
                    goto?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    goto: string;
                    import?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    pop: number;
                    import?: undefined;
                    goto?: undefined;
                })[];
            };
            js_literal: {
                name: string;
                default: string;
                unmatched: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    tag?: undefined;
                    goto?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    goto: string;
                    import?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    pop: number;
                    import?: undefined;
                    goto?: undefined;
                })[];
            };
            js_template: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                    goto: string;
                }[];
            };
            js_template_inner: {
                name: string;
                default: string;
                unmatched: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    tag?: undefined;
                    goto?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    goto: string;
                    import?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    tag: string[];
                    pop: number;
                    import?: undefined;
                    goto?: undefined;
                })[];
            };
            kv: {
                name: string;
                rules: {
                    import: string[];
                }[];
            };
            jsignore: {
                name: string;
                rules: {
                    when: RegExp;
                    tag: string[];
                }[];
            };
            string: {
                name: string;
                rules: {
                    when: RegExp;
                    tag: string[];
                    highlight: string;
                }[];
            };
            string2: {
                name: string;
                rules: {
                    when: RegExp;
                    tag: string[];
                    highlight: string;
                }[];
            };
            string3: {
                name: string;
                rules: {
                    when: RegExp;
                    tag: string[];
                    highlight: string;
                }[];
            };
            regex: {
                name: string;
                rules: {
                    when: RegExp;
                    tag: string[];
                    highlight: string;
                }[];
            };
            integer: {
                name: string;
                rules: {
                    when: RegExp;
                    tag: string[];
                    highlight: string;
                }[];
            };
            word: {
                name: string;
                rules: {
                    when: RegExp;
                    tag: string[];
                }[];
            };
            ws: {
                name: string;
                rules: {
                    when: RegExp;
                    tag: string[];
                }[];
            };
            l_colon: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                    highlight: string;
                }[];
            };
            l_scolon: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            l_qmark: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            l_plus: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            l_star: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            l_comma: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            l_pipe: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                    highlight: string;
                }[];
            };
            l_parenl: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            l_parenr: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            l_templatel: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            l_templater: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            l_arrow: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                    highlight: string;
                }[];
            };
            l_dsign: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            l_dash: {
                name: string;
                rules: {
                    when: string;
                    tag: string[];
                }[];
            };
            comment: {
                name: string;
                rules: {
                    when: RegExp;
                    tag: string[];
                    highlight: string;
                }[];
            };
            commentmulti: {
                name: string;
                rules: {
                    when: RegExp;
                    tag: string[];
                    highlight: string;
                }[];
            };
        };
    };
};
