export const Lexer: any;
export const ParserRules: ({
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
export const ParserStart: string;
