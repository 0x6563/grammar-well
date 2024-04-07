import { GrammarRule, GrammarRuleSymbol, LanguageDefinition } from "../../../typings";
import { BiMap } from "./bimap";
import { State } from "./state";
export declare class CanonicalCollection {
    grammar: LanguageDefinition['grammar'];
    states: Map<string, State>;
    rules: BiMap<GrammarRule>;
    terminals: BiMap<GrammarRuleSymbol>;
    private closure;
    constructor(grammar: LanguageDefinition['grammar']);
    private addState;
    private linkStates;
    private getStateId;
}
