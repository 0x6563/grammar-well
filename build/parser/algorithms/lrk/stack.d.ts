import type { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol } from "../../../typings/index.ts";
import type { State } from "./state.ts";
export declare class LRStack {
    stack: LRStackItem[];
    get current(): LRStackItem;
    get previous(): LRStackItem;
    shift(state: State): void;
    reduce(rule: RuntimeGrammarProductionRule): void;
    append(symbol: RuntimeGrammarRuleSymbol): void;
    static NewItem(): LRStackItem;
}
interface LRStackItem {
    children: LRStackItem[];
    state: State;
    symbol: RuntimeGrammarRuleSymbol;
    rule: RuntimeGrammarProductionRule;
    value: any;
}
export {};
