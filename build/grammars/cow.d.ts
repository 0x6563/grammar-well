export = Grammar;
declare function Grammar(): {
    lexer: any;
    rules: ({
        name: string;
        symbols: {
            literal: string;
        }[];
        postprocess?: undefined;
    } | {
        name: string;
        symbols: (string | {
            literal: string;
        })[];
        postprocess: (d: any) => any;
    } | {
        name: string;
        symbols: string[];
        postprocess?: undefined;
    })[];
    start: string;
};
