import * as moo from 'moo';
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
    constructor(lexer: moo.Lexer);
    reset(buffer: string): void;
    restore(state: LexerState): void;
    feed(buffer: string, flush?: boolean): void;
    flush(): void;
    previous(): any;
    next(): any;
    peek(offset: number): any;
    private lexerNext;
}
