// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well

function GWLanguage(){
    
    return {
        grammar: {
            start: "dqstring",
            rules: {
                dqstring$RPT0Nx1: [
                    { name: "dqstring$RPT0Nx1", symbols: [ ] },
                    { name: "dqstring$RPT0Nx1", symbols: [ "dqstring$RPT0Nx1", "dstrchar" ], postprocess: ({data}) => data[0].concat([data[1]]) }
                ],
                dqstring: [
                    { name: "dqstring", symbols: [ {"literal":"\"","insensitive":false}, "dqstring$RPT0Nx1", {"literal":"\"","insensitive":false} ], postprocess: ({data}) => { return data[1].join(""); } }
                ],
                sqstring$RPT0Nx1: [
                    { name: "sqstring$RPT0Nx1", symbols: [ ] },
                    { name: "sqstring$RPT0Nx1", symbols: [ "sqstring$RPT0Nx1", "sstrchar" ], postprocess: ({data}) => data[0].concat([data[1]]) }
                ],
                sqstring: [
                    { name: "sqstring", symbols: [ {"literal":"'","insensitive":false}, "sqstring$RPT0Nx1", {"literal":"'","insensitive":false} ], postprocess: ({data}) => { return data[1].join(""); } }
                ],
                btstring$RPT0Nx1: [
                    { name: "btstring$RPT0Nx1", symbols: [ ] },
                    { name: "btstring$RPT0Nx1", symbols: [ "btstring$RPT0Nx1", /[^`]/ ], postprocess: ({data}) => data[0].concat([data[1]]) }
                ],
                btstring: [
                    { name: "btstring", symbols: [ {"literal":"`","insensitive":false}, "btstring$RPT0Nx1", {"literal":"`","insensitive":false} ], postprocess: ({data}) => { return data[1].join(""); } }
                ],
                dstrchar: [
                    { name: "dstrchar", symbols: [ /[^\\"\n]/ ], postprocess: ({data}) => { return data[0]; } },
                    { name: "dstrchar", symbols: [ {"literal":"\\","insensitive":false}, "strescape" ], postprocess: ({data}) => { return JSON.parse("\""+data.join("")+"\""); } }
                ],
                sstrchar: [
                    { name: "sstrchar", symbols: [ /[^\\'\n]/ ], postprocess: ({data}) => { return data[0]; } },
                    { name: "sstrchar", symbols: [ {"literal":"\\","insensitive":false}, "strescape" ], postprocess: ({data}) => { return JSON.parse("\""+data.join("")+"\""); } },
                    { name: "sstrchar", symbols: [ "sstrchar$STRx1" ], postprocess: ({data}) => { return "'"; } }
                ],
                sstrchar$STRx1: [
                    { name: "sstrchar$STRx1", symbols: [ {"literal":"\\"}, {"literal":"'"} ], postprocess: ({data}) => data.join('') }
                ],
                strescape: [
                    { name: "strescape", symbols: [ /["\\/bfnrt]/ ], postprocess: ({data}) => { return data[0]; } },
                    { name: "strescape", symbols: [ {"literal":"u","insensitive":false}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/ ], postprocess: ({data}) => { return data.join(""); } }
                ]
            }
        }
    }
}

export default GWLanguage;