import { GrammarRule, GrammarRuleSymbol } from "../../../typings";
import { State } from "./state";
export declare class LRStack {
    stack: LRStackItem[];
    get current(): LRStackItem;
    get previous(): LRStackItem;
    shift(state: State): void;
    reduce(rule: GrammarRule): void;
    append(symbol: GrammarRuleSymbol): void;
    static NewItem(): LRStackItem;
}
interface LRStackItem {
    children: LRStackItem[];
    state: State;
    symbol: GrammarRuleSymbol;
    rule: GrammarRule;
    value: any;
}
export {};
