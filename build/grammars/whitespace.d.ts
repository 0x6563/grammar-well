export default GWLanguage;
declare function GWLanguage(): {
    grammar: {
        start: string;
        rules: {
            _$RPT0Nx1: ({
                name: string;
                symbols: any[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            _: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            __$RPT1Nx1: ({
                name: string;
                symbols: string[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            __: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            wschar: {
                name: string;
                symbols: RegExp[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
        };
    };
};
