import { Lexer, TQRestorePoint, LexerToken } from '../typings';
export declare class TokenBuffer {
    private lexer;
    private history;
    private queued;
    private $historyIndex;
    get offset(): number;
    get line(): number;
    get column(): number;
    get active(): LexerToken;
    get state(): TQRestorePoint;
    constructor(lexer: Lexer);
    reset(buffer: string): void;
    restore(state: TQRestorePoint): void;
    feed(buffer: string, flush?: boolean): void;
    flush(): void;
    previous(): LexerToken;
    next(): LexerToken;
    peek(offset: number): LexerToken;
    private lexerNext;
    [Symbol.iterator](): TokenIterator;
}
declare class TokenIterator {
    private buffer;
    constructor(buffer: TokenBuffer);
    next(): {
        value: LexerToken;
        done: boolean;
    };
    [Symbol.iterator](): this;
}
export {};
