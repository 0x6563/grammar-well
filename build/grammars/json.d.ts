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
            symbols: (string | {
                literal: string;
            })[];
            postprocess: ({ data }: {
                data: any;
            }) => {};
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
            postprocess: ({ data }: {
                data: any;
            }) => any;
        } | {
            name: string;
            symbols: {
                type: string;
            }[];
            postprocess: ({ data }: {
                data: any;
            }) => any;
        })[];
    };
    lexer: {
        start: string;
        states: {
            name: string;
            rules: ({
                when: RegExp;
                type: string;
            } | {
                when: string;
                type?: undefined;
            })[];
        }[];
    };
};
