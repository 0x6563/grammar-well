export default GWLanguage;
declare function GWLanguage(): {
    grammar: {
        start: string;
        rules: ({
            name: string;
            symbols: string[];
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
            postprocess?: undefined;
        } | {
            name: string;
            symbols: {
                literal: string;
            }[];
            postprocess?: undefined;
        } | {
            name: string;
            symbols: (string | {
                type: string;
            })[];
            postprocess: ({ data }: {
                data: any;
            }) => any;
        } | {
            name: string;
            symbols: (string | RegExp)[];
            postprocess: ({ data }: {
                data: any;
            }) => any;
        })[];
    };
    lexer: {
        start: string;
        states: ({
            name: string;
            rules: ({
                import: string[];
                when?: undefined;
                type?: undefined;
                goto?: undefined;
            } | {
                when: RegExp;
                type: string;
                goto: string;
                import?: undefined;
            })[];
            default?: undefined;
            unmatched?: undefined;
        } | {
            name: string;
            rules: ({
                import: string[];
                when?: undefined;
                type?: undefined;
                set?: undefined;
            } | {
                when: string;
                type: string;
                set: string;
                import?: undefined;
            })[];
            default?: undefined;
            unmatched?: undefined;
        } | {
            name: string;
            rules: ({
                import: string[];
                when?: undefined;
                type?: undefined;
                pop?: undefined;
            } | {
                when: string;
                type: string;
                pop: number;
                import?: undefined;
            })[];
            default?: undefined;
            unmatched?: undefined;
        } | {
            name: string;
            rules: {
                when: string;
                type: string;
                goto: string;
            }[];
            default?: undefined;
            unmatched?: undefined;
        } | {
            name: string;
            default: string;
            unmatched: string;
            rules: ({
                import: string[];
                when?: undefined;
                type?: undefined;
                goto?: undefined;
                pop?: undefined;
            } | {
                when: string;
                type: string;
                goto: string;
                import?: undefined;
                pop?: undefined;
            } | {
                when: string;
                type: string;
                pop: number;
                import?: undefined;
                goto?: undefined;
            })[];
        } | {
            name: string;
            rules: {
                when: RegExp;
                type: string;
            }[];
            default?: undefined;
            unmatched?: undefined;
        } | {
            name: string;
            rules: {
                when: string;
                type: string;
            }[];
            default?: undefined;
            unmatched?: undefined;
        })[];
    };
};
