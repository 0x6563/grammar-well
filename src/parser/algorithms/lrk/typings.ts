import type { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol } from "../../../typings/index.ts";

export interface LRItem {
    rule: RuntimeGrammarProductionRule;
    dot: number;
}

export interface State {
    id: string;
    actions?: { symbol: RuntimeGrammarRuleSymbol, state: State }[];
    goto?: { [key: string]: State };
    reduce?: RuntimeGrammarProductionRule;
}
