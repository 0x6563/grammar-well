import { ParserAlgorithm, ParserConstructor, PrecompiledGrammar } from "../typings";
import { NearleyParser } from "./algorithms/nearley/parser";
import { EarleyParser } from "./algorithms/earley/parser";
declare const ParserRegistry: {
    nearley: typeof NearleyParser;
    earley: typeof EarleyParser;
};
export declare function Parse(grammar: PrecompiledGrammar, input: string, options?: ParserOptions): any;
export declare class Parser {
    private grammar;
    private options;
    parserClass: ParserConstructor;
    parser: ParserAlgorithm;
    get results(): any[];
    constructor(grammar: PrecompiledGrammar, options?: ParserOptions);
    feed(input: string): any[];
    run(input: string): any;
}
interface ParserOptions {
    algorithm: keyof typeof ParserRegistry;
    parserOptions?: any;
}
export {};
