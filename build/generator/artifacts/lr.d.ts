import { Dictionary, GeneratorGrammarProductionRule, GeneratorGrammarSymbol } from "../../typings";
import { Collection, GeneratorSymbolCollection } from "../../utility/general.js";
import { JavaScriptGenerator } from "../stringify/javascript.js";
export declare class LRParseTableBuilder {
    generator: JavaScriptGenerator;
    rules: Collection<GeneratorGrammarProductionRule>;
    table: Dictionary<StateBuilder>;
    symbols: GeneratorSymbolCollection;
    constructor(generator: JavaScriptGenerator);
    addState(seed: StateItem[]): StateBuilder;
    encodeRule(rule: GeneratorGrammarProductionRule, dot: number): string;
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
    reduce?: GeneratorGrammarProductionRule;
    constructor(collection: LRParseTableBuilder, items: StateItem[]);
    private closure;
    export(): State;
}
interface State {
    actions: Next[];
    goto: {
        [key: string]: string;
    };
    reduce: GeneratorGrammarProductionRule;
    isFinal: boolean;
}
type Next = {
    symbol: GeneratorGrammarSymbol;
    next: string;
};
type StateItem = {
    rule: GeneratorGrammarProductionRule;
    dot: number;
};
interface StateOut {
    action: Dictionary<StateItem[]>;
    goto: Dictionary<StateItem[]>;
}
export {};
