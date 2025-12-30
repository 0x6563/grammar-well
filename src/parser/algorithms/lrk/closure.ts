import type { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeParserClass } from "../../../typings/index.ts";
import { ParserUtility } from "../../../utility/parsing.ts";

export class ClosureBuilder {
    private grammar: RuntimeParserClass['artifacts']['grammar'];
    constructor(
        grammar: RuntimeParserClass['artifacts']['grammar'],
    ) {
        this.grammar = grammar;
    }

    get(rule: string) {
        const closure: RuleClosure = { items: [], visited: new Set() };
        this.addClosure(closure, rule);
        return closure.items;
    }

    private addClosure(closure: RuleClosure, symbol: RuntimeGrammarRuleSymbol) {
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
        rule: RuntimeGrammarProductionRule,
        dot: number,
    }[]
    visited: Set<RuntimeGrammarRuleSymbol>;
}