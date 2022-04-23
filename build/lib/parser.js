"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var column_1 = require("./column");
var grammar_1 = require("./grammar");
var streamlexer_1 = require("./streamlexer");
var Parser = (function () {
    function Parser(a, b, c) {
        this.options = {};
        var options;
        if (a instanceof grammar_1.Grammar) {
            this.grammar = a;
            options = b;
        }
        else {
            this.grammar = grammar_1.Grammar.fromCompiled(a, b);
            options = c;
        }
        this.options = __assign({ keepHistory: false, lexer: this.grammar.lexer || new streamlexer_1.StreamLexer() }, options);
        this.lexer = this.options.lexer;
        this.lexerState = undefined;
        var column = new column_1.Column(this.grammar, 0);
        this.table = [column];
        column.wants[this.grammar.start] = [];
        column.predict(this.grammar.start);
        column.process();
        this.current = 0;
    }
    Parser.prototype.feed = function (chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);
        var token;
        while (true) {
            try {
                token = lexer.next();
                if (!token) {
                    break;
                }
            }
            catch (e) {
                var nextColumn = new column_1.Column(this.grammar, this.current + 1);
                this.table.push(nextColumn);
                var err = new Error(this.reportLexerError(e));
                err.offset = this.current;
                err.token = e.token;
                throw err;
            }
            var column = this.table[this.current];
            if (!this.options.keepHistory) {
                delete this.table[this.current - 1];
            }
            var n = this.current + 1;
            var nextColumn = new column_1.Column(this.grammar, n);
            this.table.push(nextColumn);
            var literal = token.text !== undefined ? token.text : token.value;
            var value = lexer.constructor === streamlexer_1.StreamLexer ? token.value : token;
            var scannable = column.scannable;
            for (var w = scannable.length; w--;) {
                var state = scannable[w];
                var expect = state.rule.symbols[state.dot];
                if (expect.test ? expect.test(value) :
                    expect.type ? expect.type === token.type
                        : expect.literal === literal) {
                    var next = state.nextState({ data: value, token: token, isToken: true, reference: n - 1 });
                    nextColumn.states.push(next);
                }
            }
            nextColumn.process();
            if (nextColumn.states.length === 0) {
                var err = new Error(this.reportError(token));
                err.offset = this.current;
                err.token = token;
                throw err;
            }
            if (this.options.keepHistory) {
                column.lexerState = lexer.save();
            }
            this.current++;
        }
        if (column) {
            this.lexerState = lexer.save();
        }
        this.results = this.finish();
        return this;
    };
    ;
    Parser.prototype.reportLexerError = function (lexerError) {
        var tokenDisplay, lexerMessage;
        var token = lexerError.token;
        if (token) {
            tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
            lexerMessage = this.lexer.formatError(token, "Syntax error");
        }
        else {
            tokenDisplay = "input (lexer error)";
            lexerMessage = lexerError.message;
        }
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    };
    ;
    Parser.prototype.reportError = function (token) {
        var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== undefined ? token.value : token);
        var lexerMessage = this.lexer.formatError(token, "Syntax error");
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    };
    ;
    Parser.prototype.reportErrorCommon = function (lexerMessage, tokenDisplay) {
        var lines = [];
        lines.push(lexerMessage);
        var lastColumnIndex = this.table.length - 2;
        var lastColumn = this.table[lastColumnIndex];
        var expectantStates = lastColumn.states
            .filter(function (state) {
            var nextSymbol = state.rule.symbols[state.dot];
            return nextSymbol && typeof nextSymbol !== "string";
        });
        if (expectantStates.length === 0) {
            lines.push('Unexpected ' + tokenDisplay + '. I did not expect any more input. Here is the state of my parse table:\n');
            this.displayStateStack(lastColumn.states, lines);
        }
        else {
            lines.push('Unexpected ' + tokenDisplay + '. Instead, I was expecting to see one of the following:\n');
            var stateStacks = expectantStates
                .map(function (state) {
                return this.buildFirstStateStack(state, []) || [state];
            }, this);
            stateStacks.forEach(function (stateStack) {
                var state = stateStack[0];
                var nextSymbol = state.rule.symbols[state.dot];
                var symbolDisplay = this.getSymbolDisplay(nextSymbol);
                lines.push('A ' + symbolDisplay + ' based on:');
                this.displayStateStack(stateStack, lines);
            }, this);
        }
        lines.push("");
        return lines.join("\n");
    };
    Parser.prototype.displayStateStack = function (stateStack, lines) {
        var lastDisplay;
        var sameDisplayCount = 0;
        for (var j = 0; j < stateStack.length; j++) {
            var state = stateStack[j];
            var display = state.rule.toString(state.dot);
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
    };
    ;
    Parser.prototype.getSymbolDisplay = function (symbol) {
        return getSymbolLongDisplay(symbol);
    };
    ;
    Parser.prototype.buildFirstStateStack = function (state, visited) {
        if (visited.indexOf(state) !== -1) {
            return null;
        }
        if (state.wantedBy.length === 0) {
            return [state];
        }
        var prevState = state.wantedBy[0];
        var childVisited = [state].concat(visited);
        var childResult = this.buildFirstStateStack(prevState, childVisited);
        if (childResult === null) {
            return null;
        }
        return [state].concat(childResult);
    };
    ;
    Parser.prototype.save = function () {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    };
    ;
    Parser.prototype.restore = function (column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;
        this.results = this.finish();
    };
    ;
    Parser.prototype.rewind = function (index) {
        if (!this.options.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding');
        }
        this.restore(this.table[index]);
    };
    ;
    Parser.prototype.finish = function () {
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1];
        column.states.forEach(function (t) {
            if (t.rule.name === start
                && t.dot === t.rule.symbols.length
                && t.reference === 0
                && t.data !== Parser.fail) {
                considerations.push(t);
            }
        });
        return considerations.map(function (c) { return c.data; });
    };
    ;
    Parser.fail = {};
    return Parser;
}());
exports.Parser = Parser;
function getSymbolLongDisplay(symbol) {
    var type = typeof symbol;
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
            throw new Error('Unknown symbol type: ' + symbol);
        }
    }
}
//# sourceMappingURL=parser.js.map