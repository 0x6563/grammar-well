import { TokenBuffer } from "../lexers/token-buffer";
import { GrammarRule, GrammarRuleSymbol, LexerToken } from "../typings";

export class TextFormatter {

    static UnexpectedToken(queue: TokenBuffer, expected: (GrammarRule & { index?: number })[]) {
        const token = queue.active;
        const tokenDisplay = TextFormatter.LexerTokenShort(token);
        const lines = [];
        lines.push('Unexpected token: ' + tokenDisplay + ' at line: ' + token.line + ' column: ' + token.column);
        if (expected.length === 0) {
            lines.push('End of input was expected.');
        } else {
            lines.push('Instead, I was expecting to see one of the following:\n');
            for (const ex of expected) {
                const nextSymbol = ex.symbols[ex.index];
                const symbolDisplay = TextFormatter.GrammarRuleSymbol(nextSymbol, false, true);
                lines.push('A ' + symbolDisplay + ' based on:');
                lines.push(TextFormatter.GrammarRule(ex, ex.index));
            }
            lines.push("");
            return lines.join("\n");
        }
    }

    static LexerTokenShort(token: LexerToken) {
        if (token.type)
            return `[${token.type}] ${JSON.stringify(token.value)}`;
        return `${JSON.stringify(token.value)}`;
    }

    static LexerTokenError(lexer: TokenBuffer) {
        let i = 0;
        let token;
        let string = lexer.peek(i).value;
        let lines = 0;
        const { line, column, offset } = lexer;

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
        return `Syntax error at index ${offset}:\n\n${string}\n`;
    }

    static GrammarRuleSymbol(symbol: GrammarRuleSymbol, short?: boolean, error?: boolean) {
        if (typeof symbol === 'string') {
            return symbol;
        } else if (typeof symbol === 'function') {
            return short ? `<${symbol.toString()}>` : `token matching ${symbol.toString()}`;
        } else {
            if ("literal" in symbol) {
                return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
                return short ? symbol.toString() : `character matching ${symbol.toString()}`;
            } else if ("token" in symbol) {
                return short ? `%${symbol.token}` : `${symbol.token} token`;
            } else if (error) {
                return 'Unknown symbol type: ' + JSON.stringify(symbol);
            }
        }
    }

    static GrammarRule(rule: GrammarRule, withCursorAt?: number) {
        let symbolSequence = rule.symbols.slice(0, withCursorAt).map(v => TextFormatter.GrammarRuleSymbol(v, true, true)).join(' ');
        if (typeof withCursorAt !== "undefined") {
            symbolSequence += " ● " + rule.symbols.slice(withCursorAt).map(v => TextFormatter.GrammarRuleSymbol(v, true, true)).join(' ');
        };
        return rule.name + " → " + symbolSequence;
    }
}