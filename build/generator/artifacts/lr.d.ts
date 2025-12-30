import type { Dictionary, GeneratorGrammarProductionRule, GeneratorGrammarSymbol } from "../../typings/index.ts";
import { Collection, GeneratorSymbolCollection } from "../../utility/general.ts";
import { JavaScriptGenerator } from "../stringify/javascript.ts";
export declare class LRParseTableBuilder {
    rules: Collection<GeneratorGrammarProductionRule>;
    table: Dictionary<StateBuilder>;
    symbols: GeneratorSymbolCollection;
    generator: JavaScriptGenerator;
    constructor(generator: JavaScriptGenerator);
    addState(seed: StateItem[]): StateBuilder;
    encodeRule(rule: GeneratorGrammarProductionRule, dot: number): string;
    encodeStateItems(seed: StateItem[]): string;
    stringify(depth?: number): string;
    stringifyState(state: State, depth?: number): string;
    stringifyNext(next: Next, depth: number): string;
}
declare class StateBuilder {
    isFinal: boolean;
    outputs: StateOut;
    queue: {
        [key: string]: StateItem[];
    };
    actions: Map<GeneratorGrammarSymbol, string>;
    goto: Map<GeneratorGrammarSymbol, string>;
    reduce?: GeneratorGrammarProductionRule;
    private collection;
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
