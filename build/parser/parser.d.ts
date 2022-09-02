import { ParserAlgorithm, ParserConstructor, LanguageDefinition } from "../typings";
import { EarleyParser } from "./algorithms/earley/parser";
declare const ParserRegistry: {
    earley: typeof EarleyParser;
};
export declare function Parse(language: LanguageDefinition, input: string, options?: ParserOptions): any;
export declare class Parser {
    private language;
    private options;
    parserClass: ParserConstructor;
    parser: ParserAlgorithm;
    get results(): any[];
    constructor(language: LanguageDefinition, options?: ParserOptions);
    feed(input: string): any[];
    run(input: string): any;
}
interface ParserOptions {
    algorithm: keyof typeof ParserRegistry;
    parserOptions?: any;
}
export {};
