"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamLexer = void 0;
var StreamLexer = (function () {
    function StreamLexer() {
        this.buffer = '';
        this.index = 0;
        this.line = 1;
        this.lastLineBreak = 0;
    }
    StreamLexer.prototype.reset = function (data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
    };
    StreamLexer.prototype.next = function () {
        if (this.index < this.buffer.length) {
            var ch = this.buffer[this.index++];
            if (ch === '\n') {
                this.line += 1;
                this.lastLineBreak = this.index;
            }
            return { value: ch };
        }
    };
    StreamLexer.prototype.save = function () {
        return {
            line: this.line,
            col: this.index - this.lastLineBreak,
        };
    };
    StreamLexer.prototype.formatError = function (token, message) {
        var buffer = this.buffer;
        if (typeof buffer === 'string') {
            var lines = buffer
                .split("\n")
                .slice(Math.max(0, this.line - 5), this.line);
            var nextLineBreak = buffer.indexOf('\n', this.index);
            if (nextLineBreak === -1)
                nextLineBreak = buffer.length;
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
        }
        else {
            return message + " at index " + (this.index - 1);
        }
        function pad(n, length) {
            var s = String(n);
            return Array(length - s.length + 1).join(" ") + s;
        }
    };
    return StreamLexer;
}());
exports.StreamLexer = StreamLexer;
//# sourceMappingURL=streamlexer.js.map