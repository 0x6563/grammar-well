export const lexer: any;
export const rules: ({
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
export const start: string;
