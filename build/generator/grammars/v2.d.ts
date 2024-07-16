export default GWLanguage;
declare function GWLanguage(): {
    grammar: {
        rules: {
            POSTPROCESSOR: ({
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    template: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    js: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            })[];
            POSTPROCESSOR$RPT0Nx1: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: (string | {
                    token: string;
                })[];
            })[];
            POSTPROCESSOR$RPT0Nx2: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: (string | {
                    token: string;
                })[];
            })[];
            POSTPROCESSOR$RPT0Nx3: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: (string | {
                    token: string;
                })[];
            })[];
            POSTPROCESSOR$RPT0Nx4: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: (string | {
                    token: string;
                })[];
            })[];
            T_INTEGER: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: {
                    token: string;
                }[];
            }[];
            T_JS: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    js: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            }[];
            T_JS$RPT0Nx1: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: (string | {
                    token: string;
                })[];
            })[];
            T_REGEX: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    regex: any;
                    flags: any;
                    quote: any;
                };
                symbols: (string | {
                    literal: string;
                    token?: undefined;
                } | {
                    token: string;
                    literal?: undefined;
                })[];
            }[];
            T_REGEX$RPT0Nx1: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: (string | RegExp)[];
            })[];
            T_SECTWORD: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: {
                    token: string;
                }[];
            }[];
            T_STRING: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: {
                    token: string;
                }[];
            }[];
            T_WORD: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: {
                    token: string;
                }[];
            }[];
            _: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            }[];
            _$RPT0Nx1: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            })[];
            _$RPT0Nx1$SUBx1: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            __: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            }[];
            __$RPT1Nx1: ({
                name: string;
                symbols: string[];
                postprocess?: undefined;
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            })[];
            __$RPT1Nx1$SUBx1: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            __$RPT1Nx1$SUBx2: {
                name: string;
                symbols: {
                    token: string;
                }[];
            }[];
            expression: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    symbols: any;
                };
                symbols: string[];
            }[];
            expression_list: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: (string | {
                    token: string;
                })[];
            }[];
            expression_repeater: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: {
                    token: string;
                }[];
            }[];
            expression_symbol: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: (string | {
                    token: string;
                })[];
            }[];
            expression_symbol_list: ({
                name: string;
                symbols: string[];
                postprocess?: undefined;
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            })[];
            expression_symbol_match: ({
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    literal: any;
                    insensitive: boolean;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    token: any;
                };
                symbols: (string | {
                    token: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    subexpression: any;
                };
                symbols: (string | {
                    token: string;
                })[];
            })[];
            grammar: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    rules: any;
                };
                symbols: string[];
            }[];
            grammar_rule: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    name: any;
                    expressions: any;
                };
                symbols: string[];
            }[];
            grammar_rule_list: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
                symbols: string[];
            }[];
            grammar_rule_name: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            }[];
            kv: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    [x: number]: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            }[];
            kv$SUBx1: {
                name: string;
                symbols: string[];
            }[];
            kv_list: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            }[];
            lexer: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            }[];
            main: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            }[];
            section: ({
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    config: any;
                };
                symbols: (string | {
                    literal: string;
                    token?: undefined;
                } | {
                    token: string;
                    literal?: undefined;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    import: any;
                };
                symbols: (string | {
                    literal: string;
                    token?: undefined;
                } | {
                    token: string;
                    literal?: undefined;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    lexer: any;
                };
                symbols: (string | {
                    literal: string;
                    token?: undefined;
                } | {
                    token: string;
                    literal?: undefined;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    grammar: any;
                };
                symbols: (string | {
                    literal: string;
                    token?: undefined;
                } | {
                    token: string;
                    literal?: undefined;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    body: any;
                };
                symbols: (string | RegExp)[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    head: any;
                };
                symbols: (string | RegExp)[];
            })[];
            section_list: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
                symbols: string[];
            }[];
            state: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    name: any;
                    state: any;
                };
                symbols: string[];
            }[];
            state_config: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    [x: number]: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            }[];
            state_config_list: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            }[];
            state_definition: ({
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    sections: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            })[];
            state_list: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
                symbols: string[];
            }[];
            string_list: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
                symbols: (string | {
                    token: string;
                })[];
            }[];
            token: ({
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    import: any;
                };
                symbols: (string | {
                    token: string;
                    literal?: undefined;
                } | {
                    literal: string;
                    token?: undefined;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: (string | {
                    token: string;
                })[];
            })[];
            token_definition: ({
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    open: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    close: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    tag: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    when: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    pop: number;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    pop: string;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    highlight: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    embed: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    unembed: boolean;
                };
                symbols: {
                    literal: string;
                }[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    inset: number;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    set: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    goto: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            } | {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => {
                    type: any;
                };
                symbols: (string | {
                    literal: string;
                })[];
            })[];
            token_definition_list: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            }[];
            token_list: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any;
                symbols: string[];
            }[];
            word_list: {
                name: string;
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
                symbols: (string | {
                    token: string;
                })[];
            }[];
        };
        start: string;
    };
    lexer: {
        start: string;
        states: {
            comment: {
                regex: RegExp;
                rules: {
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                }[];
            };
            config: {
                regex: RegExp;
                rules: ({
                    skip: boolean;
                    when: RegExp;
                    goto?: undefined;
                    tag?: undefined;
                } | {
                    goto: string;
                    tag: string[];
                    when: string;
                    skip?: undefined;
                })[];
            };
            config$body: {
                regex: RegExp;
                rules: ({
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                    set?: undefined;
                } | {
                    tag: string[];
                    when: RegExp;
                    highlight?: undefined;
                    set?: undefined;
                } | {
                    highlight: string;
                    tag: string[];
                    when: string;
                    set?: undefined;
                } | {
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                    set?: undefined;
                } | {
                    set: string;
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                })[];
            };
            config$opener: {
                regex: RegExp;
                rules: ({
                    skip: boolean;
                    when: RegExp;
                    goto?: undefined;
                    tag?: undefined;
                } | {
                    goto: string;
                    tag: string[];
                    when: string;
                    skip?: undefined;
                })[];
            };
            grammar: {
                regex: RegExp;
                rules: ({
                    skip: boolean;
                    when: RegExp;
                    goto?: undefined;
                    tag?: undefined;
                } | {
                    goto: string;
                    tag: string[];
                    when: string;
                    skip?: undefined;
                })[];
            };
            grammar$body: {
                regex: RegExp;
                rules: ({
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    goto: string;
                    highlight: string;
                    when: string;
                    tag?: undefined;
                    set?: undefined;
                } | {
                    tag: string[];
                    when: RegExp;
                    highlight?: undefined;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    highlight: string;
                    when: string;
                    tag?: undefined;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    highlight: string;
                    tag: string[];
                    when: string;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    set: string;
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                    goto?: undefined;
                })[];
            };
            grammar$opener: {
                regex: RegExp;
                rules: ({
                    skip: boolean;
                    when: RegExp;
                    goto?: undefined;
                    tag?: undefined;
                } | {
                    goto: string;
                    tag: string[];
                    when: string;
                    skip?: undefined;
                })[];
            };
            insensitive: {
                regex: RegExp;
                rules: {
                    highlight: string;
                    when: string;
                }[];
            };
            integer: {
                regex: RegExp;
                rules: {
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                }[];
            };
            js_body: {
                regex: RegExp;
                rules: ({
                    tag: string[];
                    when: RegExp;
                    set?: undefined;
                } | {
                    set: string;
                    tag: string[];
                    when: string;
                })[];
            };
            js_literal: {
                regex: RegExp;
                rules: ({
                    tag: string[];
                    when: RegExp;
                    goto?: undefined;
                    highlight?: undefined;
                    pop?: undefined;
                } | {
                    goto: string;
                    highlight: string;
                    tag: string[];
                    when: string;
                    pop?: undefined;
                } | {
                    highlight: string;
                    pop: number;
                    tag: string[];
                    when: string;
                    goto?: undefined;
                })[];
                unmatched: {
                    tag: string[];
                };
            };
            js_template: {
                regex: RegExp;
                rules: {
                    goto: string;
                    highlight: string;
                    when: string;
                }[];
            };
            js_template_inner: {
                regex: RegExp;
                rules: ({
                    tag: string[];
                    when: RegExp;
                    highlight?: undefined;
                    set?: undefined;
                } | {
                    highlight: string;
                    set: string;
                    when: string;
                    tag?: undefined;
                })[];
            };
            jsignore: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: RegExp;
                }[];
            };
            kv: {
                regex: RegExp;
                rules: ({
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                } | {
                    tag: string[];
                    when: RegExp;
                    highlight?: undefined;
                } | {
                    highlight: string;
                    tag: string[];
                    when: string;
                } | {
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                })[];
            };
            l_abracketl: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            l_abracketr: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            l_arrow: {
                regex: RegExp;
                rules: {
                    highlight: string;
                    tag: string[];
                    when: string;
                }[];
            };
            l_colon: {
                regex: RegExp;
                rules: {
                    highlight: string;
                    tag: string[];
                    when: string;
                }[];
            };
            l_comma: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            l_dash: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            l_dsign: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            l_parenl: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            l_parenr: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            l_pipe: {
                regex: RegExp;
                rules: {
                    highlight: string;
                    tag: string[];
                    when: string;
                }[];
            };
            l_plus: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            l_qmark: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            l_scolon: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            l_star: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: string;
                }[];
            };
            lexer: {
                regex: RegExp;
                rules: ({
                    skip: boolean;
                    when: RegExp;
                    goto?: undefined;
                    tag?: undefined;
                } | {
                    goto: string;
                    tag: string[];
                    when: string;
                    skip?: undefined;
                })[];
            };
            lexer$body: {
                regex: RegExp;
                rules: ({
                    tag: string[];
                    when: RegExp;
                    highlight?: undefined;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    goto: string;
                    highlight: string;
                    when: string;
                    tag?: undefined;
                    set?: undefined;
                } | {
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    highlight: string;
                    tag: string[];
                    when: string;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    goto: string;
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                    set?: undefined;
                } | {
                    set: string;
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                    goto?: undefined;
                })[];
            };
            lexer$opener: {
                regex: RegExp;
                rules: ({
                    skip: boolean;
                    when: RegExp;
                    goto?: undefined;
                    tag?: undefined;
                } | {
                    goto: string;
                    tag: string[];
                    when: string;
                    skip?: undefined;
                })[];
            };
            lexer_sections: {
                regex: RegExp;
                rules: {
                    goto: string;
                    tag: string[];
                    when: string;
                }[];
            };
            lexer_sections$body: {
                regex: RegExp;
                rules: ({
                    tag: string[];
                    when: RegExp;
                    highlight?: undefined;
                    goto?: undefined;
                    pop?: undefined;
                } | {
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                    goto?: undefined;
                    pop?: undefined;
                } | {
                    goto: string;
                    highlight: string;
                    when: string;
                    tag?: undefined;
                    pop?: undefined;
                } | {
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                    goto?: undefined;
                    pop?: undefined;
                } | {
                    highlight: string;
                    tag: string[];
                    when: string;
                    goto?: undefined;
                    pop?: undefined;
                } | {
                    pop: number;
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                    goto?: undefined;
                })[];
            };
            lexer_sections$closer: {
                regex: RegExp;
                rules: {
                    pop: number;
                    tag: string[];
                    when: string;
                }[];
            };
            lexer_sections$opener: {
                regex: RegExp;
                rules: {
                    goto: string;
                    tag: string[];
                    when: string;
                }[];
            };
            main: {
                regex: RegExp;
                rules: ({
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    tag: string[];
                    when: RegExp;
                    highlight?: undefined;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    tag: string[];
                    when: string;
                    highlight?: undefined;
                    goto?: undefined;
                    set?: undefined;
                } | {
                    goto: string;
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                    set?: undefined;
                } | {
                    highlight: string;
                    set: string;
                    tag: string[];
                    when: RegExp;
                    goto?: undefined;
                } | {
                    highlight: string;
                    tag: string[];
                    when: string;
                    goto?: undefined;
                    set?: undefined;
                })[];
            };
            regex: {
                regex: RegExp;
                rules: {
                    goto: string;
                    highlight: string;
                    when: string;
                }[];
            };
            regex$body: {
                regex: RegExp;
                rules: ({
                    tag: string[];
                    when: RegExp;
                    highlight?: undefined;
                    pop?: undefined;
                } | {
                    highlight: string;
                    when: RegExp;
                    tag?: undefined;
                    pop?: undefined;
                } | {
                    highlight: string;
                    pop: number;
                    tag: string[];
                    when: RegExp;
                })[];
            };
            regex$closer: {
                regex: RegExp;
                rules: {
                    highlight: string;
                    pop: number;
                    tag: string[];
                    when: RegExp;
                }[];
            };
            regex$opener: {
                regex: RegExp;
                rules: {
                    goto: string;
                    highlight: string;
                    when: string;
                }[];
            };
            section_word: {
                regex: RegExp;
                rules: {
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                }[];
            };
            string: {
                regex: RegExp;
                rules: {
                    highlight: string;
                    tag: string[];
                    when: RegExp;
                }[];
            };
            word: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: RegExp;
                }[];
            };
            ws: {
                regex: RegExp;
                rules: {
                    tag: string[];
                    when: RegExp;
                }[];
            };
        };
    };
};
