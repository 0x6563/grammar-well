import { Dictionary, GeneratorExportOptions, GeneratorGrammarProductionRule } from "../../typings/index.js";
import { GeneratorState } from "../state.js";
export declare class JavaScriptGenerator {
    state: GeneratorState;
    options: GeneratorExportOptions;
    constructor(state: GeneratorState, options: GeneratorExportOptions);
    name(): string;
    head(): string;
    body(): string;
    artifacts(depth?: number): string;
    postProcess(postprocess: GeneratorGrammarProductionRule['postprocess'], alias: Dictionary<number>): any;
    grammarRule(rule: GeneratorGrammarProductionRule): string;
    private templatePostProcess;
}
