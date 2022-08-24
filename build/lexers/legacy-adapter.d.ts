import { Lexer, LexerState } from '../typings';
export declare class LegacyLexerAdapter implements Lexer {
    private lexer;
    private history;
    private queue;
    private $indexOffset;
    private $index;
    get index(): number;
    get line(): number;
    get current(): any;
    get column(): number;
    private get active();
    get state(): LexerState;
    constructor(lexer: LegacyLexer);
    reset(buffer: string): void;
    restore(state: LexerState): void;
    feed(buffer: string, flush?: boolean): void;
    flush(): void;
    previous(): any;
    next(): any;
    peek(offset: number): any;
    private lexerNext;
}
export interface LegacyLexer {
    formatError(token: LegacyToken, message?: string): string;
    next(): LegacyToken | undefined;
    reset(chunk?: string, state?: {
        line: number;
        col: number;
        state: string;
    }): void;
    save(): {
        line: number;
        col: number;
        state: string;
    };
    push(state: string): void;
    pop(): void;
    setState(state: string): void;
    [Symbol.iterator](): Iterator<LegacyToken>;
}
export interface LegacyToken {
    toString(): string;
    type?: string | undefined;
    value: string;
    offset: number;
    text: string;
    lineBreaks: number;
    line: number;
    col: number;
}
