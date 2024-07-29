declare class grammar {
    artifacts: {
        grammar: {
            rules: {
                K_ALL: {
                    name: string;
                    symbols: {
                        literal: string;
                    }[];
                }[];
                K_BEFORE: {
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
                K_CLOSE: {
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
                K_EMBED: {
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
                K_GOTO: {
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
                K_HEAD: {
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
                K_IMPORT: {
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
                K_LEXER: {
                    name: string;
                    symbols: {
                        literal: string;
                    }[];
                }[];
                K_OPEN: {
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
                K_SET: {
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
                K_UNEMBED: {
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
                L_ARROW: {
                    name: string;
                    symbols: {
                        token: string;
                    }[];
                }[];
                L_COLON: {
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
                L_DASH: {
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
                L_PIPE: {
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
                L_QMARK: {
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
                L_STAR: {
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
                T_COMMENT: {
                    name: string;
                    symbols: {
                        token: string;
                    }[];
                }[];
                T_GRAMMAR_TEMPLATE: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        template: string;
                    };
                    symbols: (string | {
                        token: string;
                    })[];
                }[];
                T_GRAMMAR_TEMPLATE$RPT0Nx1: ({
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
                        token: string;
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
                    };
                    symbols: (string | {
                        token: string;
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
                T_WS: {
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
                    symbols: string[];
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
                    symbols: string[];
                }[];
                __$RPT1Nx1$SUBx2: {
                    name: string;
                    symbols: string[];
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
                expression_list: ({
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
                expression_repeater: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
                }[];
                expression_symbol: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
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
                expression_symbol_match: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
                }[];
                expression_symbol_match$RPT01x1: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: {
                        literal: string;
                    }[];
                }[];
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
                kv: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        [x: number]: any;
                    };
                    symbols: string[];
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
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        import: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        import: any;
                        alias: any;
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
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        grammar: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        body: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        head: any;
                    };
                    symbols: string[];
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
                state_declare: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
                }[];
                state_definition: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
                }[];
                state_definition_kv: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        tag: any;
                    };
                    symbols: (string | {
                        literal: string;
                    })[];
                }[];
                state_definition_kv_list: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
                }[];
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
                    symbols: string[];
                }[];
                token: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
                }[];
                token_definition: ({
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        tag: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        when: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        open: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        close: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        pop: number;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        pop: string;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        highlight: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        embed: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        unembed: boolean;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        inset: number;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        set: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        goto: any;
                    };
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {
                        type: any;
                    };
                    symbols: string[];
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
                    symbols: string[];
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
                        highlight?: undefined;
                        set?: undefined;
                    } | {
                        highlight: string;
                        tag: string[];
                        when: string;
                        set?: undefined;
                    } | {
                        set: string;
                        tag: string[];
                        when: string;
                        highlight?: undefined;
                    })[];
                };
                config_inner: {
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
                        tag: string[];
                        when: string;
                        pop?: undefined;
                    } | {
                        pop: number;
                        tag: string[];
                        when: string;
                        highlight?: undefined;
                    })[];
                };
                grammar: {
                    regex: RegExp;
                    rules: ({
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
                        set: string;
                        tag: string[];
                        when: string;
                        highlight?: undefined;
                    })[];
                };
                grammar_inner: {
                    regex: RegExp;
                    rules: ({
                        highlight: string;
                        tag: string[];
                        when: RegExp;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        goto: string;
                        tag: string[];
                        when: string;
                        highlight?: undefined;
                        pop?: undefined;
                    } | {
                        tag: string[];
                        when: RegExp;
                        highlight?: undefined;
                        goto?: undefined;
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
                integer: {
                    regex: RegExp;
                    rules: {
                        highlight: string;
                        tag: string[];
                        when: RegExp;
                    }[];
                };
                js: {
                    regex: RegExp;
                    rules: {
                        goto: string;
                        tag: string[];
                        when: string;
                    }[];
                };
                js_literal: {
                    regex: RegExp;
                    rules: ({
                        tag: string[];
                        when: RegExp;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        goto: string;
                        tag: string[];
                        when: string;
                        pop?: undefined;
                    } | {
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
                        tag: string[];
                        when: string;
                    }[];
                };
                js_template_inner: {
                    regex: RegExp;
                    rules: ({
                        tag: string[];
                        when: RegExp;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        goto: string;
                        tag: string[];
                        when: string;
                        pop?: undefined;
                    } | {
                        pop: number;
                        tag: string[];
                        when: string;
                        goto?: undefined;
                    })[];
                    unmatched: {
                        tag: string[];
                    };
                };
                js_wrap: {
                    regex: RegExp;
                    rules: ({
                        tag: string[];
                        when: RegExp;
                        goto?: undefined;
                        pop?: undefined;
                    } | {
                        goto: string;
                        tag: string[];
                        when: string;
                        pop?: undefined;
                    } | {
                        pop: number;
                        tag: string[];
                        when: string;
                        goto?: undefined;
                    })[];
                    unmatched: {
                        tag: string[];
                    };
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
                    })[];
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
                        set: string;
                        tag: string[];
                        when: string;
                        highlight?: undefined;
                    })[];
                };
                lexer_inner: {
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
                        goto: string;
                        tag: string[];
                        when: string;
                        highlight?: undefined;
                        pop?: undefined;
                    } | {
                        pop: number;
                        tag: string[];
                        when: string;
                        highlight?: undefined;
                        goto?: undefined;
                    })[];
                };
                regex: {
                    regex: RegExp;
                    rules: {
                        highlight: string;
                        tag: string[];
                        when: RegExp;
                    }[];
                };
                start: {
                    regex: RegExp;
                    rules: ({
                        highlight: string;
                        tag: string[];
                        when: RegExp;
                        goto?: undefined;
                    } | {
                        goto: string;
                        tag: string[];
                        when: string;
                        highlight?: undefined;
                    } | {
                        tag: string[];
                        when: RegExp;
                        highlight?: undefined;
                        goto?: undefined;
                    } | {
                        tag: string[];
                        when: string;
                        highlight?: undefined;
                        goto?: undefined;
                    } | {
                        goto: string;
                        highlight: string;
                        tag: string[];
                        when: RegExp;
                    } | {
                        highlight: string;
                        tag: string[];
                        when: string;
                        goto?: undefined;
                    })[];
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
