"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
class Log {
    static LexerTokenError(lexer) {
        let i = 0;
        let token;
        let string = lexer.peek(i).value;
        let lines = 0;
        const { line, column, index } = lexer.state;
        while (token = lexer.peek(--i)) {
            if (token.value == '\n') {
                lines++;
                string = `${(line + 2 - lines)} ${string}`;
            }
            string = token.value + string;
            if (lines >= 2)
                break;
        }
        string = `${line + 2 - (lines + 1)} ${string}`;
        const n = string.lastIndexOf('\n');
        const pad = (string.length - n);
        string += '\n' + '^'.padStart(pad - 1);
        if (typeof column != 'undefined' && typeof line != 'undefined')
            return `Syntax error at line ${line + 1} col ${column + 1}:\n\n${string}\n`;
        return `Syntax error at index ${index}:\n\n${string}\n`;
    }
}
exports.Log = Log;
//# sourceMappingURL=log.js.map