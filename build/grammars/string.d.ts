export = Grammar;
declare function Grammar(): {
    lexer: any;
    rules: ({
        name: string;
        symbols: any[];
        postprocess?: undefined;
    } | {
        name: string;
        symbols: (string | {
            literal: string;
        })[];
        postprocess: (d: any) => any;
    } | {
        name: string;
        symbols: (string | RegExp)[];
        postprocess: (d: any) => any;
    } | {
        name: string;
        symbols: (RegExp | {
            literal: string;
        })[];
        postprocess: (d: any) => any;
    })[];
    start: string;
};
