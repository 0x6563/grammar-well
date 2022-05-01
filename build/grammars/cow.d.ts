export const lexer: any;
export const rules: ({
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
export const start: string;
