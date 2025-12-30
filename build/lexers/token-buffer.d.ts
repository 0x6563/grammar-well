import type { RuntimeLexer, RuntimeLexerToken, TQRestorePoint } from '../typings/index.ts';
export declare class TokenBuffer {
    private history;
    private queued;
    private $historyIndex;
    lexer: RuntimeLexer;
    private tokenProcessor?;
    get offset(): number;
    get line(): number;
    get column(): number;
    get active(): RuntimeLexerToken;
    get state(): TQRestorePoint;
    constructor(lexer: RuntimeLexer, tokenProcessor?: (token: RuntimeLexerToken) => RuntimeLexerToken);
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
