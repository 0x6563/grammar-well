import { Parser, ParserConstructor, PrecompiledGrammar } from "../typings";
import { EarleyParser } from "../parsers/earley/parser";
declare const ParserRegistry: {
    earley: typeof EarleyParser;
};
export declare class Interpreter {
    private grammar;
    private options;
    parserClass: ParserConstructor;
    parser: Parser;
    get results(): any[];
    constructor(grammar: PrecompiledGrammar, options?: InterpreterOptions);
    feed(source: string): any[];
    run(source: string): any;
}
interface InterpreterOptions {
    parser: keyof typeof ParserRegistry;
    parserOptions?: any;
}
export {};
