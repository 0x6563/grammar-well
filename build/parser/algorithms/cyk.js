"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CYK = void 0;
const general_1 = require("../../utility/general");
const parser_1 = require("../parser");
function CYK(language, options = {}) {
    const { grammar, tokens } = language;
    const terminals = [];
    const nonTerminals = [];
    for (const name in grammar.rules) {
        for (const rule of grammar.rules[name]) {
            const { symbols } = rule;
            if (parser_1.ParserUtility.SymbolIsTerminal(symbols[0])) {
                terminals.push(rule);
            }
            else {
                nonTerminals.push(rule);
            }
        }
    }
    let currentTokenIndex = -1;
    const chart = new general_1.Matrix(0, 0, () => new Map());
    for (const token of tokens) {
        currentTokenIndex++;
        chart.resize(currentTokenIndex + 2, currentTokenIndex + 2);
        for (const rule of terminals) {
            if (parser_1.ParserUtility.TokenMatchesSymbol(token, rule.symbols[0])) {
                chart.get(currentTokenIndex, currentTokenIndex).set(rule.name, { rule, token });
            }
        }
        for (let floor = currentTokenIndex; floor >= 0; floor--) {
            for (let inner = floor; inner <= currentTokenIndex; inner++) {
                const leftCell = chart.get(floor, inner);
                const rightCell = chart.get(inner + 1, currentTokenIndex);
                for (const rule of nonTerminals) {
                    const { symbols: [leftSymbol, rightSymbol] } = rule;
                    const left = leftCell.get(leftSymbol);
                    const right = rightCell.get(rightSymbol);
                    if (left && right) {
                        chart.get(floor, currentTokenIndex).set(rule.name, { rule, left, right });
                    }
                }
            }
        }
    }
    const results = Array.from(chart.get(0, currentTokenIndex).values()).map(v => GetValue(v));
    return { results };
}
exports.CYK = CYK;
function GetValue(ref) {
    if (!ref)
        return;
    if ('token' in ref) {
        return parser_1.ParserUtility.PostProcess(ref.rule, [ref.token]);
    }
    return parser_1.ParserUtility.PostProcess(ref.rule, [GetValue(ref.left), GetValue(ref.right)]);
}
//# sourceMappingURL=cyk.js.map