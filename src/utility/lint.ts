import { LanguageDefinition, RuleSymbol } from "../typings";


export function LintGrammarSymbols(language: LanguageDefinition): RuleSymbol[] {
    const unused = new Set<RuleSymbol>();
    const used = new Set<RuleSymbol>();
    const { rules } = language.grammar;
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