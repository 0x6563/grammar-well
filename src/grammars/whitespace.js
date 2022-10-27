// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well

function GWLanguage(){
    
    return {
        grammar: {
            start: "_",
            rules: {
                _$RPT0Nx1: [
                    { name: "_$RPT0Nx1", symbols: [ ] },
                    { name: "_$RPT0Nx1", symbols: [ "_$RPT0Nx1", "wschar" ], postprocess: ({data}) => data[0].concat([data[1]]) }
                ],
                _: [
                    { name: "_", symbols: [ "_$RPT0Nx1" ], postprocess: ({data}) => { return null; } }
                ],
                __$RPT1Nx1: [
                    { name: "__$RPT1Nx1", symbols: [ "wschar" ] },
                    { name: "__$RPT1Nx1", symbols: [ "__$RPT1Nx1", "wschar" ], postprocess: ({data}) => data[0].concat([data[1]]) }
                ],
                __: [
                    { name: "__", symbols: [ "__$RPT1Nx1" ], postprocess: ({data}) => { return null; } }
                ],
                wschar: [
                    { name: "wschar", symbols: [ /[\t\n\v\f]/ ], postprocess: ({data}) => { return data[0].value; } }
                ]
            }
        }
    }
}

export default GWLanguage;