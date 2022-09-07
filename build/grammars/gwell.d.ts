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
                    config: {};
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    lexer: {};
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
                    import: any;
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
                }) => {};
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
                }) => {};
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
                }) => {};
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
                    rules: any;
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
            expression_symbol: ({
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    rule: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    subexpression: {
                        symbols: (RegExp | {
                            literal: any;
                        })[];
                        postprocess: ({ data }: {
                            data: any;
                        }) => any;
                    }[];
                } | {
                    literal: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    token: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    regex: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    subexpression: any;
                };
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    expression: any;
                    repeat: any;
                };
            })[];
            expression_symbol$RPT01x1: {
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
            _$RPT01x1: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            _: {
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
            L_REPEAT_01: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_REPEAT_1N: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            L_REPEAT_0N: {
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
                }) => any;
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
                }) => any;
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
            T_CHARCLASS: {
                name: string;
                symbols: {
                    token: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
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
                    type?: undefined;
                    goto?: undefined;
                } | {
                    when: RegExp;
                    type: string;
                    goto: string;
                    import?: undefined;
                })[];
            };
            config: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    type?: undefined;
                    set?: undefined;
                } | {
                    when: string;
                    type: string;
                    set: string;
                    import?: undefined;
                })[];
            };
            config_inner: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    type?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    type: string;
                    pop: number;
                    import?: undefined;
                })[];
            };
            grammar: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    type?: undefined;
                    set?: undefined;
                } | {
                    when: string;
                    type: string;
                    set: string;
                    import?: undefined;
                })[];
            };
            grammar_inner: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    type?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    type: string;
                    pop: number;
                    import?: undefined;
                })[];
            };
            lexer: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    type?: undefined;
                    set?: undefined;
                } | {
                    when: string;
                    type: string;
                    set: string;
                    import?: undefined;
                })[];
            };
            lexer_inner: {
                name: string;
                rules: ({
                    import: string[];
                    when?: undefined;
                    type?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    type: string;
                    pop: number;
                    import?: undefined;
                })[];
            };
            js: {
                name: string;
                rules: {
                    when: string;
                    type: string;
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
                    type?: undefined;
                    goto?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    type: string;
                    goto: string;
                    import?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    type: string;
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
                    type?: undefined;
                    goto?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    type: string;
                    goto: string;
                    import?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    type: string;
                    pop: number;
                    import?: undefined;
                    goto?: undefined;
                })[];
            };
            js_template: {
                name: string;
                rules: {
                    when: string;
                    type: string;
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
                    type?: undefined;
                    goto?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    type: string;
                    goto: string;
                    import?: undefined;
                    pop?: undefined;
                } | {
                    when: string;
                    type: string;
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
                    type: string;
                }[];
            };
            string: {
                name: string;
                rules: {
                    when: RegExp;
                    type: string;
                }[];
            };
            string2: {
                name: string;
                rules: {
                    when: RegExp;
                    type: string;
                }[];
            };
            string3: {
                name: string;
                rules: {
                    when: RegExp;
                    type: string;
                }[];
            };
            charclass: {
                name: string;
                rules: {
                    when: RegExp;
                    type: string;
                }[];
            };
            regex: {
                name: string;
                rules: {
                    when: RegExp;
                    type: string;
                }[];
            };
            integer: {
                name: string;
                rules: {
                    when: RegExp;
                    type: string;
                }[];
            };
            word: {
                name: string;
                rules: {
                    when: RegExp;
                    type: string;
                }[];
            };
            ws: {
                name: string;
                rules: {
                    when: RegExp;
                    type: string;
                }[];
            };
            l_colon: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_repeat_01: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_repeat_1n: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_repeat_0n: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_comma: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_pipe: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_parenl: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_parenr: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_templatel: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_templater: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_arrow: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_dsign: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            l_dash: {
                name: string;
                rules: {
                    when: string;
                    type: string;
                }[];
            };
            comment: {
                name: string;
                rules: {
                    when: RegExp;
                    type: string;
                }[];
            };
            commentmulti: {
                name: string;
                rules: {
                    when: RegExp;
                    type: string;
                }[];
            };
        };
    };
};
