"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LintGrammarSymbols = void 0;
function LintGrammarSymbols(language) {
    const unused = new Set();
    const { rules, start } = language.grammar;
    for (const rule in rules) {
        unused.add(rule);
    }
    TraverseRule(start, rules, unused);
    return Array.from(unused);
}
exports.LintGrammarSymbols = LintGrammarSymbols;
function TraverseRule(name, rules, unvisited) {
    if (!unvisited.has(name)) {
        return;
    }
    unvisited.add(name);
    const n = rules[name];
    for (const { symbols } of n) {
        for (const symbol of symbols) {
            if (typeof symbol == 'string') {
                TraverseRule(symbol, rules, unvisited);
            }
        }
    }
}
//# sourceMappingURL=lint.js.map