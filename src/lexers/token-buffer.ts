import { RuntimeLexer, TQRestorePoint, RuntimeLexerToken } from '../typings';

export class TokenBuffer {
    private history: RuntimeLexerToken[] = [];
    private queued: string = '';

    private $historyIndex = -1;

    get offset() { return this.active?.offset || 0 }
    get line() { return this.active?.line || 0 }
    get column() { return this.active?.column || 0; }
    get active() { return this.history[this.$historyIndex]; }

    get state(): TQRestorePoint {
        return { historyIndex: this.$historyIndex, offset: this.offset };
    }

    constructor(private lexer: RuntimeLexer) { }

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
        this.queued += buffer;
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
        if (this.$historyIndex + 1 >= this.history.length) {
            this.lexerNext();
        }
        if (this.$historyIndex + 1 < this.history.length) {
            return this.history[++this.$historyIndex];
        }
    }

    peek(offset: number) {
        offset += this.$historyIndex;
        while ((offset >= this.history.length) && this.lexerNext()) {
            // Seeking
        }
        if (offset >= 0 && offset < this.history.length)
            return this.history[offset];
    }

    private lexerNext() {
        let token = this.lexer.next();

        if (typeof token === 'undefined' && this.queued) {
            this.lexer.feed(this.queued, this.$historyIndex >= 0 ? this.lexer.state() : undefined);
            this.queued = '';
            token = this.lexer.next();
        }
        if (token)
            this.history.push(token);
        return token;
    }

    [Symbol.iterator]() {
        return new TokenIterator(this)
    }

}

class TokenIterator {
    constructor(private buffer: TokenBuffer) { }

    next() {
        const token = this.buffer.next()
        return { value: token, done: !token }
    }

    [Symbol.iterator]() {
        return this
    }
}