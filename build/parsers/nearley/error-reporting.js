"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserErrorService = void 0;
const log_1 = require("../../lib/log");
class ParserErrorService {
    constructor(parser) {
        this.parser = parser;
    }
    lexerError(lexerError) {
        let tokenDisplay, lexerMessage;
        const token = lexerError.token;
        if (token) {
            tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
            lexerMessage = log_1.Log.LexerTokenError(this.parser.lexer);
        }
        else {
            tokenDisplay = "input (lexer error)";
            lexerMessage = lexerError.message;
        }
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    }
    tokenError(token) {
        const tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== undefined ? token.value : token);
        const lexerMessage = log_1.Log.LexerTokenError(this.parser.lexer);
        const error = new Error(this.reportErrorCommon(lexerMessage, tokenDisplay));
        error.offset = this.parser.current;
        error.token = token;
        return error;
    }
    displayStateStack(stateStack, lines) {
        let lastDisplay;
        let sameDisplayCount = 0;
        for (let j = 0; j < stateStack.length; j++) {
            const state = stateStack[j];
            const display = this.formatRule(state.rule, state.dot);
            if (display === lastDisplay) {
                sameDisplayCount++;
            }
            else {
                if (sameDisplayCount > 0) {
                    lines.push('    ^ ' + sameDisplayCount + ' more lines identical to this');
                }
                sameDisplayCount = 0;
                lines.push('    ' + display);
            }
            lastDisplay = display;
        }
    }
    reportErrorCommon(lexerMessage, tokenDisplay) {
        const lines = [];
        lines.push(lexerMessage);
        const lastColumnIndex = this.parser.table.length - 2;
        const lastColumn = this.parser.table[lastColumnIndex];
        const expectantStates = lastColumn.states
            .filter((state) => {
            const nextSymbol = state.rule.symbols[state.dot];
            return nextSymbol && typeof nextSymbol !== "string";
        });
        if (expectantStates.length === 0) {
            lines.push('Unexpected ' + tokenDisplay + '. I did not expect any more input. Here is the state of my parse table:\n');
            this.displayStateStack(lastColumn.states, lines);
        }
        else {
            lines.push('Unexpected ' + tokenDisplay + '. Instead, I was expecting to see one of the following:\n');
            const stateStacks = expectantStates.map(state => this.buildFirstStateStack(state, new Set()) || [state]);
            stateStacks.forEach((stateStack) => {
                const state = stateStack[0];
                const nextSymbol = state.rule.symbols[state.dot];
                const symbolDisplay = this.getSymbolDisplay(nextSymbol);
                lines.push('A ' + symbolDisplay + ' based on:');
                this.displayStateStack(stateStack, lines);
            });
        }
        lines.push("");
        return lines.join("\n");
    }
    getSymbolDisplay(symbol) {
        const type = typeof symbol;
        if (type === "string") {
            return symbol;
        }
        else if (type === "object") {
            if (symbol.literal) {
                return JSON.stringify(symbol.literal);
            }
            else if (symbol instanceof RegExp) {
                return 'character matching ' + symbol;
            }
            else if (symbol.type) {
                return symbol.type + ' token';
            }
            else if (symbol.test) {
                return 'token matching ' + String(symbol.test);
            }
            else {
                throw new Error('Unknown symbol type: ' + JSON.stringify(symbol));
            }
        }
    }
    buildFirstStateStack(state, visited) {
        if (visited.has(state)) {
            return null;
        }
        if (state.wantedBy.length === 0) {
            return [state];
        }
        const prevState = state.wantedBy[0];
        const childVisited = new Set(visited);
        childVisited.add(state);
        const childResult = this.buildFirstStateStack(prevState, childVisited);
        if (childResult === null) {
            return null;
        }
        return [state].concat(childResult);
    }
    formatRule(rule, withCursorAt) {
        let symbolSequence = rule.symbols.slice(0, withCursorAt).map(this.getSymbolShortDisplay).join(' ');
        if (typeof withCursorAt !== "undefined") {
            symbolSequence += " ● " + rule.symbols.slice(withCursorAt).map(this.getSymbolShortDisplay).join(' ');
        }
        ;
        return rule.name + " → " + symbolSequence;
    }
    getSymbolShortDisplay(symbol) {
        if (typeof symbol === 'string') {
            return symbol;
        }
        else {
            if ("literal" in symbol) {
                return JSON.stringify(symbol.literal);
            }
            else if (symbol instanceof RegExp) {
                return symbol.toString();
            }
            else if ("type" in symbol) {
                return '%' + symbol.type;
            }
            else if ("test" in symbol) {
                return '<' + String(symbol.test) + '>';
            }
            else {
                throw new Error('Unknown symbol type: ' + symbol);
            }
        }
    }
}
exports.ParserErrorService = ParserErrorService;
//# sourceMappingURL=error-reporting.js.map