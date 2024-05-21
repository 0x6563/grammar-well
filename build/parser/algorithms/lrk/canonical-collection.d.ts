import { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLanguageDefinition } from "../../../typings";
import { BiMap } from "./bimap";
import { State } from "./state";
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
