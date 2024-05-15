import { JavaScriptGenerator } from "../stringify/javascript";
export declare class BasicGrammarTable {
    private generator;
    constructor(generator: JavaScriptGenerator);
    stringify(depth?: number): string;
    private stringifyGrammarRules;
}
