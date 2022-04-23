import { Column } from "./column";
import { Grammar } from "./grammar";
import { Rule } from "./rule";
import { StreamLexer } from "./streamlexer";
export declare class Parser {
    static fail: {};
    grammar: Grammar;
    options: any;
    lexer: StreamLexer;
    lexerState: any;
    table: Column[];
    current: 0;
    results: any;
    constructor(rules: Rule[], start?: any);
    constructor(grammar: Grammar, start?: any);
    feed(chunk: any): this;
    reportLexerError(lexerError: any): string;
    reportError(token: any): string;
    reportErrorCommon(lexerMessage: any, tokenDisplay: any): string;
    displayStateStack(stateStack: any, lines: any): void;
    getSymbolDisplay(symbol: any): any;
    buildFirstStateStack(state: any, visited: any): any;
    save(): Column;
    restore(column: any): void;
    rewind(index: any): void;
    finish(): any[];
}
