// Generated automatically by Grammar-Well, version unknown 
// https://github.com/0x6563/grammar-well

function GWLanguage(){
    
    return {
        grammar: {
            start: "unsigned_int",
            rules: [
                { name: "unsigned_int$ebnf$1", symbols: [/[0-9]/] },
                { name: "unsigned_int$ebnf$1", symbols: ["unsigned_int$ebnf$1", /[0-9]/], postprocess: ({data}) => data[0].concat([data[1]]) },
                { name: "unsigned_int", symbols: ["unsigned_int$ebnf$1"], postprocess: ({data}) => { return parseInt(data[0].join("")); } },
                { name: "int$ebnf$1$subexpression$1", symbols: [{"literal":"-"}] },
                { name: "int$ebnf$1$subexpression$1", symbols: [{"literal":"+"}] },
                { name: "int$ebnf$1", symbols: ["int$ebnf$1$subexpression$1"], postprocess: ({data}) => data[0] },
                { name: "int$ebnf$1", symbols: [], postprocess: () => null },
                { name: "int$ebnf$2", symbols: [/[0-9]/] },
                { name: "int$ebnf$2", symbols: ["int$ebnf$2", /[0-9]/], postprocess: ({data}) => data[0].concat([data[1]]) },
                { name: "int", symbols: ["int$ebnf$1", "int$ebnf$2"], postprocess: ({data}) => { return data[0] ? parseInt(data[0][0]+data[1].join("")) : parseInt(data[1].join("")); } },
                { name: "unsigned_decimal$ebnf$1", symbols: [/[0-9]/] },
                { name: "unsigned_decimal$ebnf$1", symbols: ["unsigned_decimal$ebnf$1", /[0-9]/], postprocess: ({data}) => data[0].concat([data[1]]) },
                { name: "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", symbols: [/[0-9]/] },
                { name: "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", symbols: ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], postprocess: ({data}) => data[0].concat([data[1]]) },
                { name: "unsigned_decimal$ebnf$2$subexpression$1", symbols: [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"] },
                { name: "unsigned_decimal$ebnf$2", symbols: ["unsigned_decimal$ebnf$2$subexpression$1"], postprocess: ({data}) => data[0] },
                { name: "unsigned_decimal$ebnf$2", symbols: [], postprocess: () => null },
                { name: "unsigned_decimal", symbols: ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], postprocess: ({data}) => { return parseFloat(data[0].join("") + (data[1] ? "."+data[1][1].join("") : "")); } },
                { name: "decimal$ebnf$1", symbols: [{"literal":"-"}], postprocess: ({data}) => data[0] },
                { name: "decimal$ebnf$1", symbols: [], postprocess: () => null },
                { name: "decimal$ebnf$2", symbols: [/[0-9]/] },
                { name: "decimal$ebnf$2", symbols: ["decimal$ebnf$2", /[0-9]/], postprocess: ({data}) => data[0].concat([data[1]]) },
                { name: "decimal$ebnf$3$subexpression$1$ebnf$1", symbols: [/[0-9]/] },
                { name: "decimal$ebnf$3$subexpression$1$ebnf$1", symbols: ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], postprocess: ({data}) => data[0].concat([data[1]]) },
                { name: "decimal$ebnf$3$subexpression$1", symbols: [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"] },
                { name: "decimal$ebnf$3", symbols: ["decimal$ebnf$3$subexpression$1"], postprocess: ({data}) => data[0] },
                { name: "decimal$ebnf$3", symbols: [], postprocess: () => null },
                { name: "decimal", symbols: ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], postprocess: ({data}) => { return parseFloat( (data[0] || "") + data[1].join("") +(data[2] ? "."+data[2][1].join("") : "")); } },
                { name: "percentage", symbols: ["decimal", {"literal":"%"}], postprocess: ({data}) => { return data[0]/100; } },
                { name: "jsonfloat$ebnf$1", symbols: [{"literal":"-"}], postprocess: ({data}) => data[0] },
                { name: "jsonfloat$ebnf$1", symbols: [], postprocess: () => null },
                { name: "jsonfloat$ebnf$2", symbols: [/[0-9]/] },
                { name: "jsonfloat$ebnf$2", symbols: ["jsonfloat$ebnf$2", /[0-9]/], postprocess: ({data}) => data[0].concat([data[1]]) },
                { name: "jsonfloat$ebnf$3$subexpression$1$ebnf$1", symbols: [/[0-9]/] },
                { name: "jsonfloat$ebnf$3$subexpression$1$ebnf$1", symbols: ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], postprocess: ({data}) => data[0].concat([data[1]]) },
                { name: "jsonfloat$ebnf$3$subexpression$1", symbols: [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"] },
                { name: "jsonfloat$ebnf$3", symbols: ["jsonfloat$ebnf$3$subexpression$1"], postprocess: ({data}) => data[0] },
                { name: "jsonfloat$ebnf$3", symbols: [], postprocess: () => null },
                { name: "jsonfloat$ebnf$4$subexpression$1$ebnf$1", symbols: [/[+-]/], postprocess: ({data}) => data[0] },
                { name: "jsonfloat$ebnf$4$subexpression$1$ebnf$1", symbols: [], postprocess: () => null },
                { name: "jsonfloat$ebnf$4$subexpression$1$ebnf$2", symbols: [/[0-9]/] },
                { name: "jsonfloat$ebnf$4$subexpression$1$ebnf$2", symbols: ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], postprocess: ({data}) => data[0].concat([data[1]]) },
                { name: "jsonfloat$ebnf$4$subexpression$1", symbols: [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"] },
                { name: "jsonfloat$ebnf$4", symbols: ["jsonfloat$ebnf$4$subexpression$1"], postprocess: ({data}) => data[0] },
                { name: "jsonfloat$ebnf$4", symbols: [], postprocess: () => null },
                { name: "jsonfloat", symbols: ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], postprocess: ({data}) => { return parseFloat( (data[0] || "") + data[1].join("") + (data[2] ? "."+data[2][1].join("") : "") + (data[3] ? "e" + (data[3][1] || "+") + data[3][2].join("") : "")); } }
            ]
        },
        lexer: null
    }
}

export default GWLanguage;