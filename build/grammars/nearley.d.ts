export var lexer: any;
export declare const rules: ({
    name: string;
    symbols: any[];
    postprocess: (x: any) => any;
} | {
    name: string;
    symbols: any[];
    postprocess?: undefined;
})[];
export declare const start: string;
