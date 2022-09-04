import { TokenQueue } from "../lexers/token-queue";
import { GrammarRule, GrammarRuleSymbol } from "../typings";

export class Message {

    static LexerTokenError(lexer: TokenQueue) {
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

    static GetSymbolDisplay(symbol: GrammarRuleSymbol, short?: boolean, error?: boolean) {
        if (typeof symbol === 'string') {
            return symbol;
        } else {
            if ("literal" in symbol) {
                return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
                return short ? symbol.toString() : `character matching ${symbol.toString()}`;
            } else if ("type" in symbol) {
                return short ? `%${symbol.type}` : `${symbol.type} token`;
            } else if ("test" in symbol) {
                return short ? `<${symbol.test.toString()}>` : `token matching ${symbol.test.toString()}`;
            } else if (error) {
                return 'Unknown symbol type: ' + JSON.stringify(symbol);
            }
        }
    }

    static FormatGrammarRule(rule: GrammarRule, withCursorAt?: number) {
        let symbolSequence = rule.symbols.slice(0, withCursorAt).map(v => Message.GetSymbolDisplay(v, true, true)).join(' ');
        if (typeof withCursorAt !== "undefined") {
            symbolSequence += " ● " + rule.symbols.slice(withCursorAt).map(v => Message.GetSymbolDisplay(v, true, true)).join(' ');
        };
        return rule.name + " → " + symbolSequence;
    }
}