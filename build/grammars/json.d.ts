export = Grammar;
declare function Grammar(): {
    lexer: any;
    rules: ({
        name: string;
        symbols: (string | {
            literal: string;
        })[];
        postprocess?: undefined;
    } | {
        name: string;
        symbols: any[];
        postprocess: (d: any) => any;
    })[];
    start: string;
};
