import { JavaScriptGenerator } from "../stringify/javascript";
import { Dictionary, GeneratorGrammarRule, GeneratorGrammarSymbol } from "../../typings";
import { Collection, GeneratorSymbolCollection } from "../../utility/general";
export declare class LRParseTableBuilder {
    generator: JavaScriptGenerator;
    rules: Collection<GeneratorGrammarRule>;
    table: Dictionary<StateBuilder>;
    symbols: GeneratorSymbolCollection;
    constructor(generator: JavaScriptGenerator);
    addState(seed: StateItem[]): StateBuilder;
    encodeRule(rule: GeneratorGrammarRule, dot: number): string;
    encodeStateItems(seed: StateItem[]): string;
    stringify(depth?: number): string;
    stringifyState(state: State, depth?: number): string;
    stringifyNext(next: Next, depth: number): string;
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
    export(): State;
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