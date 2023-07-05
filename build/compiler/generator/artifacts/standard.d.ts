import { Generator } from "../generator";
export declare class StandardGrammar {
    private generator;
    constructor(generator: Generator);
    serialize(depth?: number): string;
    private serializeGrammarRules;
}
