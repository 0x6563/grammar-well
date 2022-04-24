import { Column } from "./column";
import { Grammar } from "./grammar";
import { Rule } from "./rule";
import { Lexer } from "./lexer";
import { State } from "./state";
interface ParserOptions {
    keepHistory: boolean;
    lexer: Lexer;
}
export declare class Parser {
    static fail: symbol;
    keepHistory: boolean;
    grammar: Grammar;
    lexer: Lexer;
    lexerState: any;
    table: Column[];
    current: 0;
    results: any;
    constructor(grammar: Grammar, options?: ParserOptions);
    constructor(rules: Rule[], start?: string, options?: ParserOptions);
    feed(chunk: string): this;
    reportLexerError(lexerError: any): string;
    reportError(token: any): string;
    reportErrorCommon(lexerMessage: any, tokenDisplay: any): string;
    displayStateStack(stateStack: any, lines: any): void;
    getSymbolDisplay(symbol: any): any;
    buildFirstStateStack(state: State, visited: Set<State>): any;
    save(): Column;
    restore(column: any): void;
    rewind(index: any): void;
    finish(): any[];
}
export {};
