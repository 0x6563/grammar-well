"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
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
    static GetSymbolDisplay(symbol, short, error) {
        if (typeof symbol === 'string') {
            return symbol;
        }
        else {
            if ("literal" in symbol) {
                return JSON.stringify(symbol.literal);
            }
            else if (symbol instanceof RegExp) {
                return short ? symbol.toString() : `character matching ${symbol.toString()}`;
            }
            else if ("type" in symbol) {
                return short ? `%${symbol.type}` : `${symbol.type} token`;
            }
            else if ("test" in symbol) {
                return short ? `<${symbol.test.toString()}>` : `token matching ${symbol.test.toString()}`;
            }
            else if (error) {
                throw new Error('Unknown symbol type: ' + JSON.stringify(symbol));
            }
        }
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map