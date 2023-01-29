import { Dictionary, GrammarRule, GrammarRuleSymbol, LanguageDefinition } from "../typings";
import { Collection, SymbolCollection } from "./general";
export declare class CanonicalCollection {
    grammar: LanguageGrammar & {
        symbols?: SymbolCollection;
    };
    rules: Collection<GrammarRule>;
    states: {
        [key: string]: State;
    };
    symbols: SymbolCollection;
    constructor(grammar: LanguageGrammar & {
        symbols?: SymbolCollection;
    });
    addState(seed: StateItem[]): State;
    encodeRule(rule: GrammarRule, dot: number): string;
    encodeStateItems(seed: StateItem[]): string;
}
declare class State {
    private collection;
    isFinal: boolean;
    outputs: StateOut;
    queue: {
        [key: string]: StateItem[];
    };
    actions: Map<GrammarRuleSymbol, string>;
    goto: Map<GrammarRuleSymbol, string>;
    reduce?: GrammarRule;
    constructor(collection: CanonicalCollection, items: StateItem[]);
    private closure;
}
export declare class LRStack {
    stack: LRStackItem[];
    get current(): LRStackItem;
    get previous(): LRStackItem;
    shift(state: State): void;
    reduce(rule: GrammarRule): void;
    add(symbol: GrammarRuleSymbol): void;
}
declare class LRStackItem {
    children: LRStackItem[];
    state: State;
    symbol: GrammarRuleSymbol;
    rule: GrammarRule;
    value: any;
}
type LanguageGrammar = LanguageDefinition['grammar'];
type StateItem = {
    rule: GrammarRule;
    dot: number;
};
interface StateOut {
    action: Dictionary<StateItem[]>;
    goto: Dictionary<StateItem[]>;
}
export {};
