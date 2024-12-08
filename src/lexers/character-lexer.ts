import { RuntimeLexer } from "../typings/index.js";

export class CharacterLexer implements RuntimeLexer {
    private buffer: string | any[] = '';

    private $indexOffset = 0;
    private $index = -1;
    get index() { return this.$index + this.$indexOffset }

    private $lineOffset = 0;
    private $line = 0;
    get line() { return this.$line + this.$lineOffset }

    private column = 0;

    next() {
        if (this.$index + 1 < this.buffer.length) {
            if (this.buffer[this.index] === '\n') {
                this.column = 0;
            }
            this.column++;
            const value = this.buffer[++this.$index];
            if (value === '\n') {
                this.$line++;
            }
            return {
                type: '',
                value,
                offset: this.index,
                line: this.line,
                column: this.column
            };
        }
    }

    feed(buffer: string | any[], state?: ReturnType<CharacterLexer['state']>) {
        if (Array.isArray(buffer) && (!this.buffer || Array.isArray(this.buffer))) {
            this.buffer = Array.isArray(this.buffer) ? this.buffer : [];
            this.buffer.push(...buffer);
        } else {
            if (Array.isArray(this.buffer)) {
                this.buffer.push(buffer)
            } else {
                this.buffer = this.buffer + buffer;
            }
        }
        if (state) {
            this.$index = state.index;
            this.$indexOffset = state.indexOffset;
            this.$line = state.line;
            this.$lineOffset = state.lineOffset;
            this.column = state.column;
        }
    }

    state() {
        return {
            index: this.$index,
            indexOffset: this.$indexOffset,
            line: this.$line,
            lineOffset: this.$lineOffset,
            column: this.column
        }
    }

    flush() {
        this.buffer = this.buffer.slice(this.$index);
        this.$indexOffset += this.$index;
        this.$lineOffset += this.$line;
        this.$index = 0;
        this.$line = 0;
    }
}