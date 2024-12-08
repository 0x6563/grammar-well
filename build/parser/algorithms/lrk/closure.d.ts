import { RuntimeGrammarProductionRule, RuntimeParserClass } from "../../../typings/index.js";
export declare class ClosureBuilder {
    private grammar;
    constructor(grammar: RuntimeParserClass['artifacts']['grammar']);
    get(rule: string): {
        rule: RuntimeGrammarProductionRule;
        dot: number;
    }[];
    private addClosure;
}
