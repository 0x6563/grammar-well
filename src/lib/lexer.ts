import { Token } from "../typings";

export class StreamLexer implements Lexer {
    private index = 0;
    private buffer = '';
    private line = 1;
    private lastLineBreak = 0;

    reset(data: string, state?: LexerState) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
    }

    next() {
        if (this.index < this.buffer.length) {
            const value = this.buffer[this.index++];
            if (value === '\n') {
                this.line++;
                this.lastLineBreak = this.index;
            }
            return { value };
        }
    }

    save(): LexerState {
        return {
            line: this.line,
            col: this.index - this.lastLineBreak,
        }
    }

    formatError(token, message) {
        // nb. this gets called after consuming the offending token,
        // so the culprit is index-1
        var buffer = this.buffer;
        if (typeof buffer === 'string') {
            var lines = buffer
                .split("\n")
                .slice(
                    Math.max(0, this.line - 5),
                    this.line
                );

            var nextLineBreak = buffer.indexOf('\n', this.index);
            if (nextLineBreak === -1) nextLineBreak = buffer.length;
            var col = this.index - this.lastLineBreak;
            var lastLineDigits = String(this.line).length;
            message += " at line " + this.line + " col " + col + ":\n\n";
            message += lines
                .map(function (line, i) {
                    return pad(this.line - lines.length + i + 1, lastLineDigits) + " " + line;
                }, this)
                .join("\n");
            message += "\n" + pad("", lastLineDigits + col) + "^\n";
            return message;
        } else {
            return message + " at index " + (this.index - 1);
        }

        function pad(n, length) {
            var s = String(n);
            return Array(length - s.length + 1).join(" ") + s;
        }
    }
}


export interface Lexer {
    reset(chunk?: string, state?: LexerState): void;
    formatError(token: Token, message?: string): string;
    next(): Token | undefined;
    save(): LexerState;
}

export interface LexerState {
    line: number;
    col: number;
}