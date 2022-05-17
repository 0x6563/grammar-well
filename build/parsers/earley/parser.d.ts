import { Column } from "./column";
import { Lexer, LexerState, Dictionary, Parser, PrecompiledGrammar, Rule } from "../../typings";
import { ParserErrorService } from "./error-reporting";
export interface ParserOptions {
    keepHistory?: boolean;
    lexer?: Lexer;
}
export declare class EarleyParser implements Parser {
    static fail: symbol;
    keepHistory: boolean;
    current: number;
    rules: Rule[];
    start: string;
    lexer: Lexer;
    lexerState: LexerState;
    table: Column[];
    results: any;
    errorService: ParserErrorService;
    ruleMap: Dictionary<Rule[]>;
    constructor({ rules, start, lexer, map }: PrecompiledGrammar, options?: ParserOptions);
    next(): any;
    feed(chunk: string): void;
    save(): Column;
    restore(column: Column): void;
    rewind(index: number): void;
    finish(): any[];
}
