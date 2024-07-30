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
            };
            start: string;
        };
        lexer: {
            start: string;
            states: {
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
