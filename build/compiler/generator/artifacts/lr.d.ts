import { Generator } from "../generator";
import { Dictionary, GeneratorGrammarRule, GeneratorGrammarSymbol } from "../../../typings";
import { Collection, GeneratorSymbolCollection } from "../../../utility/general";
export declare class LRParseTableBuilder {
    generator: Generator;
    rules: Collection<GeneratorGrammarRule>;
    table: Dictionary<StateBuilder>;
    symbols: GeneratorSymbolCollection;
    constructor(generator: Generator);
    addState(seed: StateItem[]): StateBuilder;
    encodeRule(rule: GeneratorGrammarRule, dot: number): string;
    encodeStateItems(seed: StateItem[]): string;
    serialize(depth?: number): string;
    serializeState(state: State, depth?: number): string;
    serializeNext(next: Next, depth: number): string;
}
declare class StateBuilder {
    private collection;
    isFinal: boolean;
    outputs: StateOut;
    queue: {
        [key: string]: StateItem[];
    };
    actions: Map<GeneratorGrammarSymbol, string>;
    goto: Map<GeneratorGrammarSymbol, string>;
    reduce?: GeneratorGrammarRule;
    constructor(collection: LRParseTableBuilder, items: StateItem[]);
    private closure;
    serialize(): State;
}
interface State {
    actions: Next[];
    goto: {
        [key: string]: string;
    };
    reduce: GeneratorGrammarRule;
    isFinal: boolean;
}
type Next = {
    symbol: GeneratorGrammarSymbol;
    next: string;
};
type StateItem = {
    rule: GeneratorGrammarRule;
    dot: number;
};
interface StateOut {
    action: Dictionary<StateItem[]>;
    goto: Dictionary<StateItem[]>;
}
export {};
