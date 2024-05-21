import { RuntimeGrammarProductionRule, RuntimeLanguageDefinition } from "../../../typings";
export declare class ClosureBuilder {
    private grammar;
    constructor(grammar: RuntimeLanguageDefinition['grammar']);
    get(rule: string): {
        rule: RuntimeGrammarProductionRule;
        dot: number;
    }[];
    private addClosure;
}
