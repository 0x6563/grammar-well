import { Lexer, LexerState } from "../typings";
export declare class BasicLexer implements Lexer {
    private buffer;
    private $indexOffset;
    private $index;
    get index(): number;
    private $lineOffset;
    private $line;
    get line(): number;
    get current(): {
        value: any;
    };
    private $newLine;
    private $prevNewLine;
    get column(): number;
    get state(): LexerState;
    reset(buffer: string | any[]): void;
    restore(state: LexerState): void;
    feed(buffer: string | any[], flush?: boolean): void;
    flush(): void;
    previous(): {
        value: any;
    };
    next(): {
        value: any;
    };
    peek(offset: number): {
        value: any;
    };
}
