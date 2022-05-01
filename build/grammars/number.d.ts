export const lexer: any;
export const rules: ({
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
export const start: string;
