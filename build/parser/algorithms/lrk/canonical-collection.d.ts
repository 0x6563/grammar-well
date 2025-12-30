import type { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeParserClass } from "../../../typings/index.ts";
import { BiMap } from "./bimap.ts";
import type { State } from "./state.ts";
export declare class CanonicalCollection {
    states: Map<string, State>;
    rules: BiMap<RuntimeGrammarProductionRule>;
    terminals: BiMap<RuntimeGrammarRuleSymbol>;
    grammar: RuntimeParserClass['artifacts']['grammar'];
    private closure;
    constructor(grammar: RuntimeParserClass['artifacts']['grammar']);
    private addState;
    private linkStates;
    private getStateId;
}
