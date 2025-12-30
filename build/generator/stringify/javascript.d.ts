import type { Dictionary, GeneratorOutputOptions, GeneratorGrammarProductionRule } from "../../typings/index.ts";
import { GeneratorState } from "../state.ts";
export declare class JavaScriptGenerator {
    state: GeneratorState;
    options: GeneratorOutputOptions;
    constructor(state: GeneratorState, options: GeneratorOutputOptions);
    name(): string;
    lifecycle(lifecycle: string): any;
    artifacts(depth?: number): string;
    f(token: any): any;
    postProcess(postprocess: GeneratorGrammarProductionRule['postprocess'], alias: Dictionary<number>): any;
    grammarRule(rule: GeneratorGrammarProductionRule): string;
    private templatePostProcess;
}
