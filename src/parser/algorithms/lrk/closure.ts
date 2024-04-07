import { GrammarRule, GrammarRuleSymbol, LanguageDefinition } from "../../../typings"
import { ParserUtility } from "../../parser"

export class ClosureBuilder {
    constructor(
        private grammar: LanguageDefinition['grammar'],
    ) { }

    get(rule: string) {
        const closure: RuleClosure = { items: [], visited: new Set() };
        this.addClosure(closure, rule);
        return closure.items;
    }

    private addClosure(closure: RuleClosure, symbol: GrammarRuleSymbol) {
        if (!ParserUtility.SymbolIsTerminal(symbol)) {
            const key = symbol as string;
            if (!(closure.visited.has(key))) {
                closure.visited.add(key);

                const rules = this.grammar.rules[key];
                for (const rule of rules) {
                    closure.items.push({ rule, dot: 0 })
                    this.addClosure(closure, rule.symbols[0]);
                }
            }
        }
    }
}

interface RuleClosure {
    items: {
        rule: GrammarRule,
        dot: number,
    }[]
    visited: Set<GrammarRuleSymbol>;
}