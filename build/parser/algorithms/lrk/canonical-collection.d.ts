import type { RuntimeGrammarProductionRule, RuntimeParserClass } from "../../../typings/index.ts";
import { BiMap } from "./bimap.ts";
import type { State } from "./typings.ts";
export declare class CanonicalCollection {
    start: State;
    rules: BiMap<RuntimeGrammarProductionRule>;
    grammar: RuntimeParserClass['artifacts']['grammar'];
    private cache;
    constructor(grammar: RuntimeParserClass['artifacts']['grammar']);
    private generateState;
    private canonicalStateId;
    private canonicalLRItemId;
    private canonicalSymbolId;
}
