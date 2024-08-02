declare class grammar {
    artifacts: {
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
                        literal: string;
                    })[];
                }[];
                expression_repeater: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: {
                        literal: string;
                    }[];
                }[];
                expression_symbol: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: (string | {
                        literal: string;
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
                        literal: string;
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
                        literal: string;
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
                    })[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        lifecycle: any;
                        js: any;
                    };
                    symbols: (string | RegExp | {
                        literal: string;
                    })[];
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
                        span: any;
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
                        literal: string;
                    })[];
                }[];
                token: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: (string | {
                        literal: string;
                    })[];
                }[];
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
                        stay: boolean;
                    };
                    symbols: {
                        literal: string;
                    }[];
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
                        literal: string;
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
                        tag: string[];
                        when: RegExp;
                        set?: undefined;
                    } | {
                        set: string;
                        when: string;
                        tag?: undefined;
                    })[];
                };
                config$span: {
                    regex: RegExp;
                    rules: ({
                        highlight: string;
                        tag: string[];
                        when: RegExp;
                        pop?: undefined;
                    } | {
                        tag: string[];
                        when: RegExp;
                        highlight?: undefined;
                        pop?: undefined;
                    } | {
                        highlight: string;
                        when: string;
                        tag?: undefined;
                        pop?: undefined;
                    } | {
                        when: string;
                        highlight?: undefined;
                        tag?: undefined;
                        pop?: undefined;
                    } | {
                        pop: number;
                        when: string;
                        highlight?: undefined;
                        tag?: undefined;
                    })[];
                };
                config$start: {
                    regex: RegExp;
                    rules: ({
                        tag: string[];
                        when: RegExp;
                        set?: undefined;
                    } | {
                        set: string;
                        when: string;
                        tag?: undefined;
                    })[];
                };
                config$stop: {
                    regex: RegExp;
                    rules: {
                        pop: number;
                        when: string;
                    }[];
                };
                grammar: {
                    regex: RegExp;
                    rules: ({
                        tag: string[];
                        when: RegExp;
                        set?: undefined;
                    } | {
                        set: string;
                        when: string;
                        tag?: undefined;
                    })[];
                };
                grammar$span: {
                    regex: RegExp;
                    rules: ({
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
                        when: RegExp;
                        highlight?: undefined;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        highlight: string;
                        when: string;
                        tag?: undefined;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        when: string;
                        highlight?: undefined;
                        tag?: undefined;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        pop: number;
                        when: string;
                        highlight?: undefined;
                        tag?: undefined;
                        goto?: undefined;
                    })[];
                };
                grammar$start: {
                    regex: RegExp;
                    rules: ({
                        tag: string[];
                        when: RegExp;
                        set?: undefined;
                    } | {
                        set: string;
                        when: string;
                        tag?: undefined;
                    })[];
                };
                grammar$stop: {
                    regex: RegExp;
                    rules: {
                        pop: number;
                        when: string;
                    }[];
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
                        highlight?: undefined;
                        set?: undefined;
                    } | {
                        highlight: string;
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
                        when: string;
                        tag?: undefined;
                    } | {
                        when: string;
                        highlight?: undefined;
                        tag?: undefined;
                    })[];
                };
                l_abracketl: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                l_abracketr: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                l_arrow: {
                    regex: RegExp;
                    rules: {
                        highlight: string;
                        when: string;
                    }[];
                };
                l_colon: {
                    regex: RegExp;
                    rules: {
                        highlight: string;
                        when: string;
                    }[];
                };
                l_comma: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                l_dash: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                l_dsign: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                l_parenl: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                l_parenr: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                l_pipe: {
                    regex: RegExp;
                    rules: {
                        highlight: string;
                        when: string;
                    }[];
                };
                l_plus: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                l_qmark: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                l_scolon: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                l_star: {
                    regex: RegExp;
                    rules: {
                        when: string;
                    }[];
                };
                lexer: {
                    regex: RegExp;
                    rules: ({
                        tag: string[];
                        when: RegExp;
                        set?: undefined;
                    } | {
                        set: string;
                        when: string;
                        tag?: undefined;
                    })[];
                };
                lexer$span: {
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
                        when: string;
                        tag?: undefined;
                        highlight?: undefined;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        highlight: string;
                        when: string;
                        tag?: undefined;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        goto: string;
                        when: string;
                        tag?: undefined;
                        highlight?: undefined;
                        pop?: undefined;
                    } | {
                        pop: number;
                        when: string;
                        tag?: undefined;
                        highlight?: undefined;
                        goto?: undefined;
                    })[];
                };
                lexer$start: {
                    regex: RegExp;
                    rules: ({
                        tag: string[];
                        when: RegExp;
                        set?: undefined;
                    } | {
                        set: string;
                        when: string;
                        tag?: undefined;
                    })[];
                };
                lexer$stop: {
                    regex: RegExp;
                    rules: {
                        pop: number;
                        when: string;
                    }[];
                };
                lexer_span: {
                    regex: RegExp;
                    rules: {
                        goto: string;
                        when: string;
                    }[];
                };
                lexer_span$span: {
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
                        when: string;
                        tag?: undefined;
                        highlight?: undefined;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        highlight: string;
                        when: string;
                        tag?: undefined;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        pop: number;
                        when: string;
                        tag?: undefined;
                        highlight?: undefined;
                        goto?: undefined;
                    })[];
                };
                lexer_span$start: {
                    regex: RegExp;
                    rules: {
                        goto: string;
                        when: string;
                    }[];
                };
                lexer_span$stop: {
                    regex: RegExp;
                    rules: {
                        pop: number;
                        when: string;
                    }[];
                };
                lifecycle: {
                    regex: RegExp;
                    rules: {
                        goto: string;
                        highlight: string;
                        tag: string[];
                        when: RegExp;
                    }[];
                };
                lifecycle$span: {
                    regex: RegExp;
                    rules: ({
                        tag: string[];
                        when: RegExp;
                        highlight?: undefined;
                        set?: undefined;
                        before?: undefined;
                        pop?: undefined;
                    } | {
                        highlight: string;
                        set: string;
                        tag: string[];
                        when: string;
                        before?: undefined;
                        pop?: undefined;
                    } | {
                        highlight: string;
                        when: string;
                        tag?: undefined;
                        set?: undefined;
                        before?: undefined;
                        pop?: undefined;
                    } | {
                        before: boolean;
                        pop: number;
                        when: RegExp;
                        tag?: undefined;
                        highlight?: undefined;
                        set?: undefined;
                    })[];
                };
                lifecycle$start: {
                    regex: RegExp;
                    rules: {
                        goto: string;
                        highlight: string;
                        tag: string[];
                        when: RegExp;
                    }[];
                };
                lifecycle$stop: {
                    regex: RegExp;
                    rules: {
                        before: boolean;
                        pop: number;
                        when: RegExp;
                    }[];
                };
                main: {
                    regex: RegExp;
                    rules: ({
                        highlight: string;
                        tag: string[];
                        when: RegExp;
                        goto?: undefined;
                    } | {
                        tag: string[];
                        when: RegExp;
                        highlight?: undefined;
                        goto?: undefined;
                    } | {
                        when: string;
                        highlight?: undefined;
                        tag?: undefined;
                        goto?: undefined;
                    } | {
                        goto: string;
                        highlight: string;
                        tag: string[];
                        when: RegExp;
                    } | {
                        highlight: string;
                        when: string;
                        tag?: undefined;
                        goto?: undefined;
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
                regex$span: {
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
                regex$start: {
                    regex: RegExp;
                    rules: {
                        goto: string;
                        highlight: string;
                        when: string;
                    }[];
                };
                regex$stop: {
                    regex: RegExp;
                    rules: {
                        highlight: string;
                        pop: number;
                        tag: string[];
                        when: RegExp;
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
    constructor();
}
export default grammar;
