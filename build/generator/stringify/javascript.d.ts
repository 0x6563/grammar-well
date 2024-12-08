import { Dictionary, GeneratorOutputOptions, GeneratorGrammarProductionRule } from "../../typings/index.js";
import { GeneratorState } from "../state.js";
export declare class JavaScriptGenerator {
    state: GeneratorState;
    options: GeneratorOutputOptions;
    constructor(state: GeneratorState, options: GeneratorOutputOptions);
    name(): string;
    lifecycle(lifecycle: string): any;
    artifacts(depth?: number): string;
    postProcess(postprocess: GeneratorGrammarProductionRule['postprocess'], alias: Dictionary<number>): any;
    grammarRule(rule: GeneratorGrammarProductionRule): string;
    private templatePostProcess;
}
