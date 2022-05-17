import { Lexer, LexerState } from "../typings";

export class BasicLexer implements Lexer {
    private buffer: string | any[] = '';

    private $indexOffset = 0;
    private $index = -1;
    get index() { return this.$index + this.$indexOffset }

    private $lineOffset = 0;
    private $line = 0;
    get line() { return this.$line + this.$lineOffset }

    get current() {
        return { value: this.buffer[this.$index] }
    }
    private $newLine = 0;
    private $prevNewLine = 0;

    get column() {
        if (this.$index == this.$newLine) {
            return this.$index - this.$prevNewLine;
        }
        const mod = this.line > 0 ? -1 : 0;
        return this.$index - (this.$newLine) + mod;
    }

    get state(): LexerState {
        return {
            index: this.$index,
            indexOffset: this.$indexOffset,
            line: this.$line,
            lineOffset: this.$lineOffset,
            column: this.column
        }
    }

    reset(buffer: string | any[]) {
        this.buffer = buffer;
        this.$index = -1;
        this.$indexOffset = 0;
        this.$line = 0;
        this.$lineOffset = 0;
        this.$prevNewLine = 0;
        this.$newLine = 0;
    }

    restore(state: LexerState) {
        this.$indexOffset = state.indexOffset || 0;
        this.$index = typeof state.index == 'number' ? state.index : -1;
        this.$lineOffset = state.lineOffset || 0;
        this.$line = state.line || 0;
        if (this.$line) {
            const col = state.column || 0;
            this.$newLine = this.$index - (col + 1);
            this.$prevNewLine = this.$index - (col + 1);
        } else {
            this.$newLine = 0;
            this.$prevNewLine = 0;
        }
    }

    feed(buffer: string | any[], flush?: boolean) {
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

    peek(offset: number) {
        offset += this.$index;
        if (offset >= 0 && offset < this.buffer.length)
            return { value: this.buffer[offset] }
    }
}