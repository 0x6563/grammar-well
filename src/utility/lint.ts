import { LanguageDefinition, GrammarRuleSymbol } from "../typings";


export function LintGrammarSymbols(language: LanguageDefinition): GrammarRuleSymbol[] {
    const unused = new Set<GrammarRuleSymbol>();
    const used = new Set<GrammarRuleSymbol>();
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