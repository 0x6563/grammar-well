export = Grammar;
declare function Grammar(): {
    lexer: any;
    rules: ({
        name: string;
        symbols: any[];
        postprocess: (x: any) => any;
    } | {
        name: string;
        symbols: any[];
        postprocess?: undefined;
    })[];
    start: string;
};
