// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well
// @ts-nocheck



class grammar {
    artifacts =  {
        grammar: {
            rules: {
                _: [
                    { name: "_", postprocess: ({data}) => { return (null); }, symbols: [ "_$RPT01x1" ] }
                ],
                _$RPT01x1: [
                    { name: "_$RPT01x1", postprocess: ({data}) => data[0], symbols: [ { token: "whitespace" } ] },
                    { name: "_$RPT01x1", postprocess: () => null, symbols: [ ] }
                ],
                __: [
                    { name: "__", postprocess: ({data}) => { return (null); }, symbols: [ "__$RPT1Nx1" ] }
                ],
                __$RPT1Nx1: [
                    { name: "__$RPT1Nx1", symbols: [ { token: "whitespace" } ] },
                    { name: "__$RPT1Nx1", postprocess: ({data}) => data[0].concat([data[1]]), symbols: [ "__$RPT1Nx1", { token: "whitespace" } ] }
                ]
            },
            start: "_"
        },
        lexer: {
            start: "whitespace",
            states: {
                whitespace: {
                    regex: /(?:(?:(\s+)))/ym,
                    rules: [
                        { tag: ["whitespace"], when: /\s+/ }
                    ]
                }
            }
        }
    }
    constructor(){}
}

export default grammar;