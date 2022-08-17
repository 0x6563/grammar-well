export = Grammar;
declare function Grammar(): {
    lexer: any;
    rules: ({
        name: string;
        symbols: string[];
        postprocess: (d: any) => any;
    } | {
        name: string;
        symbols: string[];
        postprocess?: undefined;
    } | {
        name: string;
        symbols: RegExp[];
        postprocess: (x: any) => any;
    })[];
    start: string;
};
