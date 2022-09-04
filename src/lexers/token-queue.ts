import { Lexer, TQRestorePoint, LexerToken } from '../typings';

export class TokenQueue {
    private history: LexerToken[] = [];
    private buffer: string = '';

    private $historyIndex = -1;

    get offset() { return this.active?.offset || 0 }
    get line() { return this.active?.line || 0 }
    get column() { return this.active?.column || 0; }

    private get active() { return this.history[this.$historyIndex]; }

    get state(): TQRestorePoint {
        return { historyIndex: this.$historyIndex, offset: this.offset };
    }

    constructor(private lexer: Lexer) { }

    reset(buffer: string) {
        this.lexer.feed(buffer);
        this.history = [];
        this.$historyIndex = -1;
    }

    restore(state: TQRestorePoint) {
        if (this.history[state.historyIndex].offset != state.offset) {
            return;
        }
        this.$historyIndex = state.historyIndex;
    }

    feed(buffer: string, flush?: boolean) {
        this.buffer += buffer;
        if (flush) {
            this.flush();
        }
    }

    flush() {
        this.history = this.history.slice(this.$historyIndex);
        this.$historyIndex = 0;
        if (this.lexer.flush) {
            this.lexer.flush()
        }
    }

    previous() {
        if (this.$historyIndex > 0) {
            return this.history[--this.$historyIndex];
        }
    }

    next() {
        try {
            if (this.$historyIndex + 1 >= this.history.length) {
                this.lexerNext();
            }
            if (this.$historyIndex + 1 < this.history.length) {
                return this.history[++this.$historyIndex];
            }
        } catch (error) {
            throw error; // TODO: Write better error
        }
    }

    peek(offset: number) {
        offset += this.$historyIndex;
        while ((offset >= this.history.length) && this.lexerNext()) { }
        if (offset >= 0 && offset < this.history.length)
            return this.history[offset];
    }

    private lexerNext() {
        let token = this.lexer.next();

        if (typeof token === 'undefined' && this.buffer) {
            this.lexer.feed(this.buffer, this.$historyIndex >= 0 ? this.lexer.state() : undefined);
            this.buffer = '';
            token = this.lexer.next();
        }
        if (token)
            this.history.push(token);
        return token;
    }
}


