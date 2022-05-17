import * as moo from 'moo';
import { Lexer, LexerHistory, LexerState } from '../typings';

export class LegacyLexerAdapter implements Lexer {
    private history: LexerHistory[] = [];
    private queue: string = '';

    private $indexOffset = 0;
    private $index = -1;

    get index() { return this.active?.state.index || 0 }
    get line() { return this.active?.state.line || 0 }
    get current() { return this.active?.token; }
    get column() { return this.active?.state.column || 0; }

    private get active() { return this.history[this.$index]; }

    get state(): LexerState {
        return {
            index: this.index - this.$indexOffset,
            indexOffset: this.$indexOffset,
            line: this.line,
            lineOffset: 0,
            column: this.column
        }
    }

    constructor(private lexer: moo.Lexer) { }

    reset(buffer: string) {
        this.lexer.reset(buffer);
        this.history = [];
        this.$index = -1;
        this.$indexOffset = 0;
    }

    restore(state: LexerState) {
        const index = state.index + state.indexOffset;
        if (index < this.history[0].state.index) {
            return;
        }
        this.$index += index - this.active.state.index;
    }

    feed(buffer: string, flush?: boolean) {
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

    peek(offset: number) {
        offset += this.$index;
        while ((offset >= this.history.length) && this.lexerNext()) {

        }
        if (offset >= 0 && offset < this.history.length)
            return this.history[offset].token;
    }

    private lexerNext(): any {
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
        const { state } = this.history[this.history.length - 1] || { state: { index: -1 } }
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