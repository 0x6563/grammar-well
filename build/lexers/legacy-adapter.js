"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyLexerAdapter = void 0;
class LegacyLexerAdapter {
    constructor(lexer) {
        this.lexer = lexer;
        this.history = [];
        this.queue = '';
        this.$indexOffset = 0;
        this.$index = -1;
    }
    get index() { var _a; return ((_a = this.active) === null || _a === void 0 ? void 0 : _a.state.index) || 0; }
    get line() { var _a; return ((_a = this.active) === null || _a === void 0 ? void 0 : _a.state.line) || 0; }
    get current() { var _a; return (_a = this.active) === null || _a === void 0 ? void 0 : _a.token; }
    get column() { var _a; return ((_a = this.active) === null || _a === void 0 ? void 0 : _a.state.column) || 0; }
    get active() { return this.history[this.$index]; }
    get state() {
        return {
            index: this.index - this.$indexOffset,
            indexOffset: this.$indexOffset,
            line: this.line,
            lineOffset: 0,
            column: this.column
        };
    }
    reset(buffer) {
        this.lexer.reset(buffer);
        this.history = [];
        this.$index = -1;
        this.$indexOffset = 0;
    }
    restore(state) {
        const index = state.index + state.indexOffset;
        if (index < this.history[0].state.index) {
            return;
        }
        this.$index += index - this.active.state.index;
    }
    feed(buffer, flush) {
        this.queue += buffer;
        if (flush) {
            this.flush();
        }
    }
    flush() {
        this.history = this.history.slice(this.$index);
        this.$indexOffset += this.$index;
        this.$index = 0;
    }
    previous() {
        if (this.$index > 0) {
            const { token } = this.history[--this.$index];
            return token;
        }
    }
    next() {
        if (this.$index + 1 >= this.history.length) {
            this.lexerNext();
        }
        if (this.$index + 1 < this.history.length) {
            return this.history[++this.$index].token;
        }
    }
    peek(offset) {
        offset += this.$index;
        while ((offset >= this.history.length) && this.lexerNext()) {
        }
        if (offset >= 0 && offset < this.history.length)
            return this.history[offset].token;
    }
    lexerNext() {
        let token = this.lexer.next();
        if (typeof token === 'undefined') {
            if (this.queue) {
                this.lexer.reset(this.queue, this.lexer.save());
                this.queue = '';
                token = this.lexer.next();
            }
            if (!token) {
                return;
            }
        }
        const { state } = this.history[this.history.length - 1] || { state: { index: -1 } };
        this.history.push({
            token,
            state: {
                lineOffset: 0,
                indexOffset: this.$indexOffset,
                line: token.line - 1,
                column: token.col - 1,
                index: state.index + 1
            }
        });
        return token;
    }
}
exports.LegacyLexerAdapter = LegacyLexerAdapter;
//# sourceMappingURL=legacy-adapter.js.map