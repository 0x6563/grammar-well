export const lexer: any;
export const rules: ({
    name: string;
    symbols: {
        literal: string;
    }[];
    postprocess?: undefined;
    transform?: undefined;
} | {
    name: string;
    symbols: (string | {
        literal: string;
    })[];
    postprocess: (d: any) => any;
    transform?: undefined;
} | {
    name: string;
    symbols: string[];
    transform: (r: any) => void;
    postprocess?: undefined;
})[];
export const start: string;
