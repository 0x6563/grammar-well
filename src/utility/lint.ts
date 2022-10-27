import { LanguageDefinition, GrammarRuleSymbol, Dictionary, GrammarRule } from "../typings";


export function LintGrammarSymbols(language: LanguageDefinition): GrammarRuleSymbol[] {
    const unused = new Set<string>();
    const { rules, start } = language.grammar;
    for (const rule in rules) {
        unused.add(rule);
    }
    TraverseRule(start, rules, unused);
    return Array.from(unused);
}
function TraverseRule(name: string, rules: Dictionary<GrammarRule[]>, unvisited: Set<string>) {
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