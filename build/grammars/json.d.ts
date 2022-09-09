export default GWLanguage;
declare function GWLanguage(): {
    grammar: {
        start: string;
        rules: {
            json$SUBx1: {
                name: string;
                symbols: string[];
            }[];
            json: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            object: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => {};
            }[];
            object$RPT0Nx1: ({
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
            object$RPT0Nx1$SUBx1: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
            }[];
            array: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
            }[];
            array$RPT0Nx1: ({
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
            array$RPT0Nx1$SUBx1: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
            }[];
            value: ({
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            } | {
                name: string;
                symbols: {
                    literal: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            number: {
                name: string;
                symbols: {
                    token: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => number;
            }[];
            string: {
                name: string;
                symbols: {
                    token: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            pair: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => any[];
            }[];
            key: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            _$RPT01x1: {
                name: string;
                symbols: {
                    token: string;
                }[];
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
        };
    };
    lexer: {
        start: string;
        states: {
            json: {
                name: string;
                rules: ({
                    when: RegExp;
                    tag: string[];
                } | {
                    when: string;
                    tag: string[];
                })[];
            };
        };
    };
};
