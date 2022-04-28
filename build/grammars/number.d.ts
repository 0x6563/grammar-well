export const Lexer: any;
export const ParserRules: ({
    name: string;
    symbols: (string | RegExp)[];
    postprocess: (d: any) => any;
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
    postprocess: (x: any) => any;
} | {
    name: string;
    symbols: (string | {
        literal: string;
    })[];
    postprocess: (d: any) => number;
} | {
    name: string;
    symbols: (string | RegExp)[];
    postprocess?: undefined;
})[];
export const ParserStart: string;
