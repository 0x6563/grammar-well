import { RuntimeLexer, TQRestorePoint, RuntimeLexerToken } from '../typings';
export declare class TokenBuffer {
    private lexer;
    private history;
    private queued;
    private $historyIndex;
    get offset(): number;
    get line(): number;
    get column(): number;
    get active(): RuntimeLexerToken;
    get state(): TQRestorePoint;
    constructor(lexer: RuntimeLexer);
    reset(buffer: string): void;
    restore(state: TQRestorePoint): void;
    feed(buffer: string, flush?: boolean): void;
    flush(): void;
    previous(): RuntimeLexerToken;
    next(): RuntimeLexerToken;
    peek(offset: number): RuntimeLexerToken;
    private lexerNext;
    [Symbol.iterator](): TokenIterator;
}
declare class TokenIterator {
    private buffer;
    constructor(buffer: TokenBuffer);
    next(): {
        value: RuntimeLexerToken;
        done: boolean;
    };
    [Symbol.iterator](): this;
}
export {};
