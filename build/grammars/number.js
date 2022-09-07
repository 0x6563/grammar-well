"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GWLanguage() {
    return {
        grammar: {
            start: "unsigned_int",
            rules: {
                unsigned_int$RPT1Nx1: [
                    { name: "unsigned_int$RPT1Nx1", symbols: [/[0-9]/] },
                    { name: "unsigned_int$RPT1Nx1", symbols: ["unsigned_int$RPT1Nx1", /[0-9]/], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                unsigned_int: [
                    { name: "unsigned_int", symbols: ["unsigned_int$RPT1Nx1"], postprocess: ({ data }) => { return parseInt(data[0].join("")); } }
                ],
                int$RPT01x1$SUBx1: [
                    { name: "int$RPT01x1$SUBx1", symbols: [{ "literal": "-" }] },
                    { name: "int$RPT01x1$SUBx1", symbols: [{ "literal": "+" }] }
                ],
                int$RPT01x1: [
                    { name: "int$RPT01x1", symbols: ["int$RPT01x1$SUBx1"], postprocess: ({ data }) => data[0] },
                    { name: "int$RPT01x1", symbols: [], postprocess: () => null }
                ],
                int$RPT1Nx1: [
                    { name: "int$RPT1Nx1", symbols: [/[0-9]/] },
                    { name: "int$RPT1Nx1", symbols: ["int$RPT1Nx1", /[0-9]/], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                int: [
                    { name: "int", symbols: ["int$RPT01x1", "int$RPT1Nx1"], postprocess: ({ data }) => { return data[0] ? parseInt(data[0][0] + data[1].join("")) : parseInt(data[1].join("")); } }
                ],
                unsigned_decimal$RPT1Nx1: [
                    { name: "unsigned_decimal$RPT1Nx1", symbols: [/[0-9]/] },
                    { name: "unsigned_decimal$RPT1Nx1", symbols: ["unsigned_decimal$RPT1Nx1", /[0-9]/], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                unsigned_decimal$RPT01x1$SUBx1$RPT1Nx1: [
                    { name: "unsigned_decimal$RPT01x1$SUBx1$RPT1Nx1", symbols: [/[0-9]/] },
                    { name: "unsigned_decimal$RPT01x1$SUBx1$RPT1Nx1", symbols: ["unsigned_decimal$RPT01x1$SUBx1$RPT1Nx1", /[0-9]/], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                unsigned_decimal$RPT01x1$SUBx1: [
                    { name: "unsigned_decimal$RPT01x1$SUBx1", symbols: [{ "literal": "." }, "unsigned_decimal$RPT01x1$SUBx1$RPT1Nx1"] }
                ],
                unsigned_decimal$RPT01x1: [
                    { name: "unsigned_decimal$RPT01x1", symbols: ["unsigned_decimal$RPT01x1$SUBx1"], postprocess: ({ data }) => data[0] },
                    { name: "unsigned_decimal$RPT01x1", symbols: [], postprocess: () => null }
                ],
                unsigned_decimal: [
                    { name: "unsigned_decimal", symbols: ["unsigned_decimal$RPT1Nx1", "unsigned_decimal$RPT01x1"], postprocess: ({ data }) => { return parseFloat(data[0].join("") + (data[1] ? "." + data[1][1].join("") : "")); } }
                ],
                decimal$RPT01x1: [
                    { name: "decimal$RPT01x1", symbols: [{ "literal": "-" }], postprocess: ({ data }) => data[0] },
                    { name: "decimal$RPT01x1", symbols: [], postprocess: () => null }
                ],
                decimal$RPT1Nx1: [
                    { name: "decimal$RPT1Nx1", symbols: [/[0-9]/] },
                    { name: "decimal$RPT1Nx1", symbols: ["decimal$RPT1Nx1", /[0-9]/], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                decimal$RPT01x2$SUBx1$RPT1Nx1: [
                    { name: "decimal$RPT01x2$SUBx1$RPT1Nx1", symbols: [/[0-9]/] },
                    { name: "decimal$RPT01x2$SUBx1$RPT1Nx1", symbols: ["decimal$RPT01x2$SUBx1$RPT1Nx1", /[0-9]/], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                decimal$RPT01x2$SUBx1: [
                    { name: "decimal$RPT01x2$SUBx1", symbols: [{ "literal": "." }, "decimal$RPT01x2$SUBx1$RPT1Nx1"] }
                ],
                decimal$RPT01x2: [
                    { name: "decimal$RPT01x2", symbols: ["decimal$RPT01x2$SUBx1"], postprocess: ({ data }) => data[0] },
                    { name: "decimal$RPT01x2", symbols: [], postprocess: () => null }
                ],
                decimal: [
                    { name: "decimal", symbols: ["decimal$RPT01x1", "decimal$RPT1Nx1", "decimal$RPT01x2"], postprocess: ({ data }) => { return parseFloat((data[0] || "") + data[1].join("") + (data[2] ? "." + data[2][1].join("") : "")); } }
                ],
                percentage: [
                    { name: "percentage", symbols: ["decimal", { "literal": "%" }], postprocess: ({ data }) => { return data[0] / 100; } }
                ],
                jsonfloat$RPT01x1: [
                    { name: "jsonfloat$RPT01x1", symbols: [{ "literal": "-" }], postprocess: ({ data }) => data[0] },
                    { name: "jsonfloat$RPT01x1", symbols: [], postprocess: () => null }
                ],
                jsonfloat$RPT1Nx1: [
                    { name: "jsonfloat$RPT1Nx1", symbols: [/[0-9]/] },
                    { name: "jsonfloat$RPT1Nx1", symbols: ["jsonfloat$RPT1Nx1", /[0-9]/], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                jsonfloat$RPT01x2$SUBx1$RPT1Nx1: [
                    { name: "jsonfloat$RPT01x2$SUBx1$RPT1Nx1", symbols: [/[0-9]/] },
                    { name: "jsonfloat$RPT01x2$SUBx1$RPT1Nx1", symbols: ["jsonfloat$RPT01x2$SUBx1$RPT1Nx1", /[0-9]/], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                jsonfloat$RPT01x2$SUBx1: [
                    { name: "jsonfloat$RPT01x2$SUBx1", symbols: [{ "literal": "." }, "jsonfloat$RPT01x2$SUBx1$RPT1Nx1"] }
                ],
                jsonfloat$RPT01x2: [
                    { name: "jsonfloat$RPT01x2", symbols: ["jsonfloat$RPT01x2$SUBx1"], postprocess: ({ data }) => data[0] },
                    { name: "jsonfloat$RPT01x2", symbols: [], postprocess: () => null }
                ],
                jsonfloat$RPT01x3$SUBx1$RPT01x1: [
                    { name: "jsonfloat$RPT01x3$SUBx1$RPT01x1", symbols: [/[+-]/], postprocess: ({ data }) => data[0] },
                    { name: "jsonfloat$RPT01x3$SUBx1$RPT01x1", symbols: [], postprocess: () => null }
                ],
                jsonfloat$RPT01x3$SUBx1$RPT1Nx1: [
                    { name: "jsonfloat$RPT01x3$SUBx1$RPT1Nx1", symbols: [/[0-9]/] },
                    { name: "jsonfloat$RPT01x3$SUBx1$RPT1Nx1", symbols: ["jsonfloat$RPT01x3$SUBx1$RPT1Nx1", /[0-9]/], postprocess: ({ data }) => data[0].concat([data[1]]) }
                ],
                jsonfloat$RPT01x3$SUBx1: [
                    { name: "jsonfloat$RPT01x3$SUBx1", symbols: [/[eE]/, "jsonfloat$RPT01x3$SUBx1$RPT01x1", "jsonfloat$RPT01x3$SUBx1$RPT1Nx1"] }
                ],
                jsonfloat$RPT01x3: [
                    { name: "jsonfloat$RPT01x3", symbols: ["jsonfloat$RPT01x3$SUBx1"], postprocess: ({ data }) => data[0] },
                    { name: "jsonfloat$RPT01x3", symbols: [], postprocess: () => null }
                ],
                jsonfloat: [
                    { name: "jsonfloat", symbols: ["jsonfloat$RPT01x1", "jsonfloat$RPT1Nx1", "jsonfloat$RPT01x2", "jsonfloat$RPT01x3"], postprocess: ({ data }) => { return parseFloat((data[0] || "") + data[1].join("") + (data[2] ? "." + data[2][1].join("") : "") + (data[3] ? "e" + (data[3][1] || "+") + data[3][2].join("") : "")); } }
                ]
            }
        }
    };
}
exports.default = GWLanguage;
//# sourceMappingURL=number.js.map