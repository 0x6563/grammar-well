import { GrammarRule, GrammarRuleSymbol } from "../../../typings";
export interface State {
    items: {
        rule: GrammarRule;
        dot: number;
    }[];
    isFinal: boolean;
    actions: Map<GrammarRuleSymbol, string>;
    goto: Map<GrammarRuleSymbol, string>;
    reduce: number;
    rule: GrammarRule;
}
