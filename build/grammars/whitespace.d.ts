export default GWLanguage;
declare function GWLanguage(): {
    grammar: {
        start: string;
        rules: ({
            name: string;
            symbols: string[];
            postprocess: ({ data }: {
                data: any;
            }) => any;
        } | {
            name: string;
            symbols: string[];
            postprocess?: undefined;
        } | {
            name: string;
            symbols: RegExp[];
            postprocess: ({ data }: {
                data: any;
            }) => any;
        })[];
    };
    lexer: any;
};
