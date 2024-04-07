import { GrammarRule, LanguageDefinition } from "../../../typings";
export declare class ClosureBuilder {
    private grammar;
    constructor(grammar: LanguageDefinition['grammar']);
    get(rule: string): {
        rule: GrammarRule;
        dot: number;
    }[];
    private addClosure;
}
