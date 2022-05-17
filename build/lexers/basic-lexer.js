"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicLexer = void 0;
class BasicLexer {
    constructor() {
        this.buffer = '';
        this.$indexOffset = 0;
        this.$index = -1;
        this.$lineOffset = 0;
        this.$line = 0;
        this.$newLine = 0;
        this.$prevNewLine = 0;
    }
    get index() { return this.$index + this.$indexOffset; }
    get line() { return this.$line + this.$lineOffset; }
    get current() {
        return { value: this.buffer[this.$index] };
    }
    get column() {
        if (this.$index == this.$newLine) {
            return this.$index - this.$prevNewLine;
        }
        const mod = this.line > 0 ? -1 : 0;
        return this.$index - (this.$newLine) + mod;
    }
    get state() {
        return {
            index: this.$index,
            indexOffset: this.$indexOffset,
            line: this.$line,
            lineOffset: this.$lineOffset,
            column: this.column
        };
    }
    reset(buffer) {
        this.buffer = buffer;
        this.$index = -1;
        this.$indexOffset = 0;
        this.$line = 0;
        this.$lineOffset = 0;
        this.$prevNewLine = 0;
        this.$newLine = 0;
    }
    restore(state) {
        this.$indexOffset = state.indexOffset || 0;
        this.$index = typeof state.index == 'number' ? state.index : -1;
        this.$lineOffset = state.lineOffset || 0;
        this.$line = state.line || 0;
        if (this.$line) {
            const col = state.column || 0;
            this.$newLine = this.$index - (col + 1);
            this.$prevNewLine = this.$index - (col + 1);
        }
        else {
            this.$newLine = 0;
            this.$prevNewLine = 0;
        }
    }
    feed(buffer, flush) {
        if (Array.isArray(buffer) && (!this.buffer || Array.isArray(this.buffer))) {
            this.buffer = Array.isArray(this.buffer) ? this.buffer : [];
            this.buffer.push(...buffer);
        }
        else {
            if (Array.isArray(this.buffer)) {
                this.buffer.push(buffer);
            }
            else {
                this.buffer = this.buffer + buffer;
            }
        }
        if (flush) {
            this.flush();
        }
    }
    flush() {
        this.buffer = this.buffer.slice(this.$index);
        this.$indexOffset += this.$index;
        this.$lineOffset += this.$line;
        this.$newLine -= this.$index;
        this.$prevNewLine -= this.$index;
        this.$index = 0;
        this.$line = 0;
    }
    previous() {
        if (this.$index > 0) {
            const value = this.buffer[--this.$index];
            if (value === '\n') {
                this.$line--;
                this.$newLine = this.$index;
                this.$prevNewLine = this.buffer.lastIndexOf('\n', this.$newLine);
                this.$prevNewLine = this.$prevNewLine > 0 && this.$prevNewLine == this.$newLine ? 0 : this.$newLine;
            }
            return { value };
        }
    }
    next() {
        if (this.$index + 1 < this.buffer.length) {
            const value = this.buffer[++this.$index];
            if (value === '\n') {
                this.$line++;
                this.$prevNewLine = this.$newLine;
                this.$newLine = this.$index;
            }
            return { value };
        }
    }
    peek(offset) {
        offset += this.$index;
        if (offset >= 0 && offset < this.buffer.length)
            return { value: this.buffer[offset] };
    }
}
exports.BasicLexer = BasicLexer;
//# sourceMappingURL=basic-lexer.js.map