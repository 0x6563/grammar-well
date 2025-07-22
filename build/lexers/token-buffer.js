export class TokenBuffer {
    lexer;
    tokenProcessor;
    history = [];
    queued = '';
    $historyIndex = -1;
    get offset() { return this.active?.offset || 0; }
    get line() { return this.active?.line || 0; }
    get column() { return this.active?.column || 0; }
    get active() { return this.history[this.$historyIndex]; }
    get state() {
        return { historyIndex: this.$historyIndex, offset: this.offset };
    }
    constructor(lexer, tokenProcessor) {
        this.lexer = lexer;
        this.tokenProcessor = tokenProcessor;
    }
    reset(buffer) {
        this.lexer.feed(buffer);
        this.history = [];
        this.$historyIndex = -1;
    }
    restore(state) {
        if (this.history[state.historyIndex].offset != state.offset) {
            return;
        }
        this.$historyIndex = state.historyIndex;
    }
    feed(buffer, flush) {
        this.queued += buffer;
        if (flush) {
            this.flush();
        }
    }
    flush() {
        this.history = this.history.slice(this.$historyIndex);
        this.$historyIndex = 0;
        if (this.lexer.flush) {
            this.lexer.flush();
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
    peek(offset) {
        offset += this.$historyIndex;
        while ((offset >= this.history.length) && this.lexerNext()) {
        }
        if (offset >= 0 && offset < this.history.length)
            return this.history[offset];
    }
    lexerNext() {
        let token = this.lexer.next();
        if (typeof token === 'undefined' && this.queued) {
            this.lexer.feed(this.queued, this.$historyIndex >= 0 ? this.lexer.state() : undefined);
            this.queued = '';
            token = this.lexer.next();
        }
        if (token) {
            if (this.tokenProcessor)
                token = this.tokenProcessor(token);
            this.history.push(token);
        }
        return token;
    }
    [Symbol.iterator]() {
        return new TokenIterator(this);
    }
}
class TokenIterator {
    buffer;
    constructor(buffer) {
        this.buffer = buffer;
    }
    next() {
        const token = this.buffer.next();
        return { value: token, done: !token };
    }
    [Symbol.iterator]() {
        return this;
    }
}
//# sourceMappingURL=token-buffer.js.map