export default GWLanguage;
declare function GWLanguage(): {
    grammar: {
        start: string;
        rules: {
            dqstring$RPT0Nx1: ({
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
            dqstring: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            sqstring$RPT0Nx1: ({
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
            sqstring: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            btstring$RPT0Nx1: ({
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
            btstring: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            dstrchar: ({
                name: string;
                symbols: RegExp[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            } | {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            sstrchar: ({
                name: string;
                symbols: RegExp[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            } | {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            sstrchar$STRx1: {
                name: string;
                symbols: {
                    literal: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            strescape: {
                name: string;
                symbols: (RegExp | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
        };
    };
};
