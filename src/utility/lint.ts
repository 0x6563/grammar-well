import { Dictionary, RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLanguageDefinition } from "../typings/index.js";

export function LintGrammarSymbols(language: RuntimeLanguageDefinition): RuntimeGrammarRuleSymbol[] {
    const unused = new Set<string>();
    const { rules, start } = language.grammar;
    for (const rule in rules) {
        unused.add(rule);
    }
    TraverseRule(start, rules, unused);
    return Array.from(unused);
}

function TraverseRule(name: string, rules: Dictionary<RuntimeGrammarProductionRule[]>, unvisited: Set<string>) {
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