import { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol } from "../../../typings/index.js";

export interface State {
    items: { rule: RuntimeGrammarProductionRule, dot: number }[];
    isFinal: boolean;
    actions: Map<RuntimeGrammarRuleSymbol, string>;
    goto: Map<RuntimeGrammarRuleSymbol, string>;
    reduce: number;
    rule: RuntimeGrammarProductionRule
}
