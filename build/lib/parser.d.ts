import { Column } from "./column";
import { Grammar } from "./grammar";
import { Rule } from "./rule";
import { Lexer, LexerState } from "./lexer";
import { State } from "./state";
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
    constructor(grammar: Grammar, options?: ParserOptions);
    constructor(rules: Rule[], start?: string, options?: ParserOptions);
    next(): any;
    feed(chunk: string): void;
    reportLexerError(lexerError: any): string;
    reportError(token: any): string;
    reportErrorCommon(lexerMessage: any, tokenDisplay: any): string;
    displayStateStack(stateStack: any, lines: any): void;
    getSymbolDisplay(symbol: any): any;
    buildFirstStateStack(state: State, visited: Set<State>): any;
    save(): Column;
    restore(column: Column): void;
    rewind(index: number): void;
    finish(): any[];
}
