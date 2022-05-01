import { Parser, ParserOptions, PrecompiledGrammar } from "./parser";
export declare class Interpreter {
    private grammar;
    private options?;
    parser: Parser;
    get results(): any;
    constructor(grammar: PrecompiledGrammar, options?: ParserOptions);
    feed(source: string): any;
    run(source: string): any;
}
