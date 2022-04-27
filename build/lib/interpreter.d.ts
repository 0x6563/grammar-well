import { Grammar, PrecompiledGrammar } from "./grammar";
import { Parser, ParserOptions } from "./parser";
export declare class Interpreter {
    private options?;
    grammar: Grammar;
    parser: Parser;
    get results(): any;
    constructor(grammar: PrecompiledGrammar, options?: ParserOptions);
    feed(source: string): void;
    run(source: string): any;
}
