"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LintGrammarSymbols = void 0;
function LintGrammarSymbols(grammar) {
    const unused = new Set();
    const used = new Set();
    const { rules } = grammar;
    rules.forEach(r => used.add(r.name));
    for (const { symbols } of rules) {
        for (const symbol of symbols) {
            if (typeof symbol == 'string' && !used.has(symbol)) {
                unused.add(symbol);
            }
        }
    }
    return Array.from(unused);
}
exports.LintGrammarSymbols = LintGrammarSymbols;
//# sourceMappingURL=lint.js.map