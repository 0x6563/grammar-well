export default Grammar;
declare function Grammar(): {
    grammar: {
        start: string;
        rules: ({
            name: string;
            symbols: any[];
            postprocess?: undefined;
        } | {
            name: string;
            symbols: (string | {
                literal: string;
            })[];
            postprocess: ({ data }: {
                data: any;
            }) => any;
        } | {
            name: string;
            symbols: (string | RegExp)[];
            postprocess: ({ data }: {
                data: any;
            }) => any;
        } | {
            name: string;
            symbols: (RegExp | {
                literal: string;
            })[];
            postprocess: ({ data }: {
                data: any;
            }) => any;
        })[];
    };
    lexer: any;
};
