import { Dictionary, GeneratorGrammarRule } from "../../typings";
import { GeneratorState } from "../state";
export declare class JavaScriptGenerator {
    state: GeneratorState;
    constructor(state: GeneratorState);
    head(): string;
    body(): string;
    artifacts(depth?: number): string;
    postProcess(postprocess: GeneratorGrammarRule['postprocess'], alias: Dictionary<number>): any;
    grammarRule(rule: GeneratorGrammarRule): string;
    private templatePostProcess;
    private lexerConfig;
    private lexerConfigStates;
    private lexerConfigStateRules;
}
