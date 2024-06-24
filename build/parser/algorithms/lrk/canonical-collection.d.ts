import { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLanguageDefinition } from "../../../typings";
import { BiMap } from "./bimap.js";
import { State } from "./state.js";
export declare class CanonicalCollection {
    grammar: RuntimeLanguageDefinition['grammar'];
    states: Map<string, State>;
    rules: BiMap<RuntimeGrammarProductionRule>;
    terminals: BiMap<RuntimeGrammarRuleSymbol>;
    private closure;
    constructor(grammar: RuntimeLanguageDefinition['grammar']);
    private addState;
    private linkStates;
    private getStateId;
}
