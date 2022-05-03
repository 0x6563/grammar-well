import { Parser, ParserConstructor, PrecompiledGrammar } from "../typings";
import { NearleyParser } from "../parsers/nearley/parser";
import { EarleyParser } from "../parsers/earley/parser";
declare const ParserRegistry: {
    nearley: typeof NearleyParser;
    earley: typeof EarleyParser;
};
export declare class Interpreter {
    private grammar;
    private options;
    parserClass: ParserConstructor;
    parser: Parser;
    get results(): any[];
    constructor(grammar: PrecompiledGrammar, options?: InterpreterOptions);
    feed(input: string): any[];
    run(input: string): any;
}
interface InterpreterOptions {
    parser: keyof typeof ParserRegistry;
    parserOptions?: any;
}
export {};
