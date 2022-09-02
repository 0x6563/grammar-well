export default Grammar;
declare function Grammar(): {
    grammar: {
        start: string;
        rules: ({
            name: string;
            symbols: (string | RegExp)[];
            postprocess: ({ data }: {
                data: any;
            }) => any;
        } | {
            name: string;
            symbols: (string | {
                literal: string;
            })[];
            postprocess?: undefined;
        } | {
            name: string;
            symbols: {
                literal: string;
            }[];
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
            }) => number;
        } | {
            name: string;
            symbols: (string | RegExp)[];
            postprocess?: undefined;
        })[];
    };
    lexer: any;
};
