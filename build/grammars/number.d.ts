export default GWLanguage;
declare function GWLanguage(): {
    grammar: {
        start: string;
        rules: {
            unsigned_int$RPT1Nx1: ({
                name: string;
                symbols: RegExp[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | RegExp)[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            unsigned_int: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => number;
            }[];
            int$RPT01x1$SUBx1: {
                name: string;
                symbols: {
                    literal: string;
                }[];
            }[];
            int$RPT01x1: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            int$RPT1Nx1: ({
                name: string;
                symbols: RegExp[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | RegExp)[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            int: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => number;
            }[];
            unsigned_decimal$RPT1Nx1: ({
                name: string;
                symbols: RegExp[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | RegExp)[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            unsigned_decimal$RPT01x1$SUBx1$RPT1Nx1: ({
                name: string;
                symbols: RegExp[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | RegExp)[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            unsigned_decimal$RPT01x1$SUBx1: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
            }[];
            unsigned_decimal$RPT01x1: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            unsigned_decimal: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => number;
            }[];
            decimal$RPT01x1: {
                name: string;
                symbols: {
                    literal: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            decimal$RPT1Nx1: ({
                name: string;
                symbols: RegExp[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | RegExp)[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            decimal$RPT01x2$SUBx1$RPT1Nx1: ({
                name: string;
                symbols: RegExp[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | RegExp)[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            decimal$RPT01x2$SUBx1: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
            }[];
            decimal$RPT01x2: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            decimal: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => number;
            }[];
            percentage: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
                postprocess: ({ data }: {
                    data: any;
                }) => number;
            }[];
            jsonfloat$RPT01x1: {
                name: string;
                symbols: {
                    literal: string;
                }[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            jsonfloat$RPT1Nx1: ({
                name: string;
                symbols: RegExp[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | RegExp)[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            jsonfloat$RPT01x2$SUBx1$RPT1Nx1: ({
                name: string;
                symbols: RegExp[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | RegExp)[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            jsonfloat$RPT01x2$SUBx1: {
                name: string;
                symbols: (string | {
                    literal: string;
                })[];
            }[];
            jsonfloat$RPT01x2: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            jsonfloat$RPT01x3$SUBx1$RPT01x1: {
                name: string;
                symbols: RegExp[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            jsonfloat$RPT01x3$SUBx1$RPT1Nx1: ({
                name: string;
                symbols: RegExp[];
                postprocess?: undefined;
            } | {
                name: string;
                symbols: (string | RegExp)[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            })[];
            jsonfloat$RPT01x3$SUBx1: {
                name: string;
                symbols: (string | RegExp)[];
            }[];
            jsonfloat$RPT01x3: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => any;
            }[];
            jsonfloat: {
                name: string;
                symbols: string[];
                postprocess: ({ data }: {
                    data: any;
                }) => number;
            }[];
        };
    };
};
