"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var column_1 = require("./column");
var grammar_1 = require("./grammar");
var lexer_1 = require("./lexer");
var Parser = (function () {
    function Parser(a, b, c) {
        this.keepHistory = false;
        var options;
        if (a instanceof grammar_1.Grammar) {
            this.grammar = a;
            options = b;
        }
        else {
            this.grammar = new grammar_1.Grammar(a, b);
            options = c;
        }
        this.keepHistory = !!(options === null || options === void 0 ? void 0 : options.keepHistory);
        this.lexer = (options === null || options === void 0 ? void 0 : options.lexer) || this.grammar.lexer || new lexer_1.StreamLexer();
        this.lexerState = undefined;
        var column = new column_1.Column(this.grammar, 0);
        this.table = [column];
        column.wants[this.grammar.start] = [];
        column.predict(this.grammar.start);
        column.process();
        this.current = 0;
    }
    Parser.prototype.feed = function (chunk) {
        this.lexer.reset(chunk, this.lexerState);
        var token, column;
        while (true) {
            try {
                token = this.lexer.next();
                if (!token) {
                    break;
                }
            }
            catch (e) {
                var nextColumn_1 = new column_1.Column(this.grammar, this.current + 1);
                this.table.push(nextColumn_1);
                var err = new Error(this.reportLexerError(e));
                err.offset = this.current;
                err.token = e.token;
                throw err;
            }
            column = this.table[this.current];
            if (!this.keepHistory) {
                delete this.table[this.current - 1];
            }
            var n = this.current + 1;
            var nextColumn = new column_1.Column(this.grammar, n);
            this.table.push(nextColumn);
            var literal = token.text !== undefined ? token.text : token.value;
            var value = this.lexer.constructor === lexer_1.StreamLexer ? token.value : token;
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
            if (this.keepHistory) {
                column.lexerState = this.lexer.save();
            }
            this.current++;
        }
        if (column) {
            this.lexerState = this.lexer.save();
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
        var _this = this;
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
            var stateStacks = expectantStates.map(function (state) { return _this.buildFirstStateStack(state, new Set()) || [state]; });
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
    };
    ;
    Parser.prototype.buildFirstStateStack = function (state, visited) {
        if (visited.has(state)) {
            return null;
        }
        if (state.wantedBy.length === 0) {
            return [state];
        }
        var prevState = state.wantedBy[0];
        var childVisited = new Set(visited);
        childVisited.add(state);
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
        if (!this.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding');
        }
        this.restore(this.table[index]);
    };
    ;
    Parser.prototype.finish = function () {
        var e_1, _a;
        var considerations = [];
        var start = this.grammar.start;
        var states = this.table[this.table.length - 1].states;
        try {
            for (var states_1 = __values(states), states_1_1 = states_1.next(); !states_1_1.done; states_1_1 = states_1.next()) {
                var _b = states_1_1.value, rule = _b.rule, dot = _b.dot, reference = _b.reference, data = _b.data;
                if (rule.name === start && dot === rule.symbols.length && !reference && data !== Parser.fail) {
                    considerations.push(data);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (states_1_1 && !states_1_1.done && (_a = states_1.return)) _a.call(states_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return considerations;
    };
    ;
    Parser.fail = Symbol();
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map