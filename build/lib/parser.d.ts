import { Column } from "./column";
import { Grammar } from "./grammar";
import { Lexer, LexerState } from "./lexer";
import { State } from "./state";
import { Rule, RuleSymbol } from "../typings";
export interface ParserOptions {
    keepHistory?: boolean;
    lexer: Lexer;
}
export declare class Parser {
    static fail: symbol;
    keepHistory: boolean;
    current: number;
    grammar: Grammar;
    lexer: Lexer;
    lexerState: LexerState;
    table: Column[];
    results: any;
    errorService: ParserErrorService;
    constructor(grammar: Grammar, options?: ParserOptions);
    constructor(rules: Rule[], start?: string, options?: ParserOptions);
    next(): any;
    feed(chunk: string): void;
    save(): Column;
    restore(column: Column): void;
    rewind(index: number): void;
    finish(): any[];
}
declare class ParserErrorService {
    private parser;
    constructor(parser: Parser);
    lexerError(lexerError: any): string;
    tokenError(token: any): any;
    private displayStateStack;
    private reportErrorCommon;
    private getSymbolDisplay;
    buildFirstStateStack(state: State, visited: Set<State>): any;
    formatRule(rule: Rule, withCursorAt?: number): string;
    getSymbolShortDisplay(symbol: RuleSymbol): string;
}
export {};
