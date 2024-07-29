import { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeParserClass } from "../../../typings/index.js";
import { BiMap } from "./bimap.js";
import { State } from "./state.js";
export declare class CanonicalCollection {
    grammar: RuntimeParserClass['artifacts']['grammar'];
    states: Map<string, State>;
    rules: BiMap<RuntimeGrammarProductionRule>;
    terminals: BiMap<RuntimeGrammarRuleSymbol>;
    private closure;
    constructor(grammar: RuntimeParserClass['artifacts']['grammar']);
    private addState;
    private linkStates;
    private getStateId;
}
