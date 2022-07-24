export let lexer: any;
export declare const rules: ({
    name: string;
    symbols: (string | {
        literal: string;
    })[];
    postprocess?: undefined;
} | {
    name: string;
    symbols: any[];
    postprocess: (d: any) => any;
})[];
export declare const start: string;
