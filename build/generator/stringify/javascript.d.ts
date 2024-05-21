import { Dictionary, GeneratorGrammarProductionRule } from "../../typings";
import { GeneratorState } from "../state";
export declare class JavaScriptGenerator {
    state: GeneratorState;
    constructor(state: GeneratorState);
    head(): string;
    body(): string;
    artifacts(depth?: number): string;
    postProcess(postprocess: GeneratorGrammarProductionRule['postprocess'], alias: Dictionary<number>): any;
    grammarRule(rule: GeneratorGrammarProductionRule): string;
    private templatePostProcess;
    private lexerConfig;
    private lexerConfigStates;
    private lexerConfigStateRules;
    private lexerConfigStateRule;
}
