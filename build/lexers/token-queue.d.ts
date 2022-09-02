import { Lexer, TokenQueueRestorePoint, LexerToken } from '../typings';
export declare class TokenQueue {
    private lexer;
    private history;
    private buffer;
    private $historyIndex;
    get offset(): number;
    get line(): number;
    get column(): number;
    private get active();
    get state(): TokenQueueRestorePoint;
    constructor(lexer: Lexer);
    reset(buffer: string): void;
    restore(state: TokenQueueRestorePoint): void;
    feed(buffer: string, flush?: boolean): void;
    flush(): void;
    previous(): LexerToken;
    next(): LexerToken;
    peek(offset: number): LexerToken;
    private lexerNext;
}
