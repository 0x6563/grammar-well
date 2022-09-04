import { ParserAlgorithm, ParserAlgorithmConstructor, LanguageDefinition } from "../typings";
import { EarleyParser } from "./algorithms/earley/earley";
declare const ParserRegistry: {
    earley: typeof EarleyParser;
};
export declare function Parse(language: LanguageDefinition, input: string, options?: ParserOptions): any;
export declare class Parser {
    private language;
    private options;
    parserClass: ParserAlgorithmConstructor;
    parser: ParserAlgorithm;
    get results(): any[];
    constructor(language: LanguageDefinition, options?: ParserOptions);
    feed(input: string): any[];
    run(input: string): any;
    private getParserAlgo;
}
interface ParserOptions {
    algorithm: keyof typeof ParserRegistry;
    parserOptions?: any;
}
export {};
