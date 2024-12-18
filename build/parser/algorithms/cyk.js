import { Matrix } from "../../utility/general.js";
import { ParserUtility } from "../../utility/parsing.js";
export function CYK(language, _options = {}) {
    const { grammar } = language.artifacts;
    const { tokens } = language;
    const terminals = [];
    const nonTerminals = [];
    for (const name in grammar.rules) {
        for (const rule of grammar.rules[name]) {
            const { symbols } = rule;
            if (ParserUtility.SymbolIsTerminal(symbols[0])) {
                terminals.push(rule);
            }
            else {
                nonTerminals.push(rule);
            }
        }
    }
    let currentTokenIndex = -1;
    const chart = new Matrix(0, 0, () => new Map());
    for (const token of tokens) {
        currentTokenIndex++;
        chart.resize(currentTokenIndex + 2, currentTokenIndex + 2);
        for (const rule of terminals) {
            if (ParserUtility.SymbolMatchesToken(rule.symbols[0], token)) {
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
function GetValue(ref) {
    if (!ref)
        return;
    if ('token' in ref) {
        return ParserUtility.PostProcess(ref.rule, [ref.token]);
    }
    return ParserUtility.PostProcess(ref.rule, [GetValue(ref.left), GetValue(ref.right)]);
}
//# sourceMappingURL=cyk.js.map