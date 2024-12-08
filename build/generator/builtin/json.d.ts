declare class grammar {
    artifacts: {
        grammar: {
            rules: {
                _: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
                }[];
                _$RPT01x1: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
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
                    symbols: {
                        token: string;
                    }[];
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
                array: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any[];
                    symbols: (string | {
                        literal: string;
                    })[];
                }[];
                array$RPT0Nx1: ({
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
                array$RPT0Nx1$SUBx1: {
                    name: string;
                    symbols: (string | {
                        literal: string;
                    })[];
                }[];
                json: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
                }[];
                json$SUBx1: {
                    name: string;
                    symbols: string[];
                }[];
                key: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
                }[];
                number: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => number;
                    symbols: {
                        token: string;
                    }[];
                }[];
                object: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => {};
                    symbols: (string | {
                        literal: string;
                    })[];
                }[];
                object$RPT0Nx1: ({
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
                object$RPT0Nx1$SUBx1: {
                    name: string;
                    symbols: (string | {
                        literal: string;
                    })[];
                }[];
                pair: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any[];
                    symbols: (string | {
                        literal: string;
                    })[];
                }[];
                string: {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: {
                        token: string;
                    }[];
                }[];
                value: ({
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: string[];
                } | {
                    name: string;
                    postprocess: ({ data }: {
                        data: any;
                    }) => any;
                    symbols: {
                        literal: string;
                    }[];
                })[];
            };
            start: string;
        };
        lexer: {
            start: string;
            states: {
                json: {
                    regex: RegExp;
                    rules: ({
                        tag: string[];
                        when: RegExp;
                    } | {
                        tag: string[];
                        when: string;
                    })[];
                };
                whitespace: {
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
