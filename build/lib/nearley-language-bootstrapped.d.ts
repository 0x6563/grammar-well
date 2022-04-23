declare var lexer: moo.Lexer;
export { lexer as Lexer };
export declare const ParserRules: ({
    name: string;
    symbols: any[];
    postprocess: (x: any) => any;
} | {
    name: string;
    symbols: any[];
    postprocess?: undefined;
})[];
export declare const ParserStart: string;
