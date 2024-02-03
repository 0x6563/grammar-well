import { GrammarRule, GrammarRuleSymbol, LanguageDefinition } from "../../../typings";
import { ParserUtility } from "../../parser";

export class State {
    items: { rule: GrammarRule, dot: number }[] = [];
    isFinal = false;
    actions: Map<GrammarRuleSymbol, string> = new Map();
    goto: Map<GrammarRuleSymbol, string> = new Map();
    reduce: number;

    constructor(
        grammar: LanguageDefinition['grammar'],
        public rule: GrammarRule,
        dot: number
    ) {
        if (rule.symbols.length == dot)
            this.isFinal = true;
        this.addClosure(grammar, rule, dot);
    }

    private addClosure(grammar: LanguageDefinition['grammar'], rule: GrammarRule, dot: number, visited: Set<GrammarRuleSymbol> = new Set()) {
        const symbol = rule.symbols[dot];
        if (visited.has(symbol))
            return;
        visited.add(symbol);
        this.items.push({ rule, dot });

        if (!ParserUtility.SymbolIsTerminal(symbol)) {
            grammar
                .rules[symbol as string]
                .forEach(v => this.addClosure(grammar, v, 0, visited));
        }
    }
}