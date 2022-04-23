export declare class Rule {
    name: any;
    symbols: any;
    postprocess: any;
    static highestId: number;
    id: number;
    constructor(name: any, symbols: any, postprocess: any);
    toString(withCursorAt: any): string;
}
export declare class Grammar {
    rules: Rule[];
    start: any;
    byName: {};
    lexer: StreamLexer;
    constructor(rules: Rule[], start: any);
    static fromCompiled(rules: any, start?: any): Grammar;
}
declare class StreamLexer {
    buffer: string;
    index: number;
    line: number;
    lastLineBreak: number;
    constructor();
    reset(data: any, state?: any): void;
    next(): {
        value: string;
    };
    save(): {
        line: number;
        col: number;
    };
    formatError(token: any, message: any): any;
}
export declare class Parser {
    static fail: {};
    grammar: Grammar;
    options: any;
    lexer: StreamLexer;
    lexerState: any;
    table: any;
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
    save(): any;
    restore(column: any): void;
    rewind(index: any): void;
    finish(): any[];
}
export {};
