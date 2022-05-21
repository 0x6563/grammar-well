"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearleyParser = void 0;
const column_1 = require("./column");
const error_reporting_1 = require("./error-reporting");
const legacy_adapter_1 = require("../../../lexers/legacy-adapter");
const basic_lexer_1 = require("../../../lexers/basic-lexer");
class NearleyParser {
    constructor({ rules, start, lexer, map }, options = {}) {
        this.keepHistory = false;
        this.current = 0;
        this.ruleMap = Object.create(null);
        this.rules = rules;
        this.start = start || this.rules[0].name;
        this.lexer = lexer;
        if (!map) {
            for (const rule of rules) {
                if (!this.ruleMap[rule.name])
                    this.ruleMap[rule.name] = [rule];
                else
                    this.ruleMap[rule.name].push(rule);
            }
        }
        this.keepHistory = !!(options === null || options === void 0 ? void 0 : options.keepHistory);
        this.errorService = new error_reporting_1.ParserErrorService(this);
        this.lexer = (options === null || options === void 0 ? void 0 : options.lexer) || this.lexer || new basic_lexer_1.BasicLexer();
        if (!this.lexer.restore)
            this.lexer = new legacy_adapter_1.LegacyLexerAdapter(this.lexer);
        const column = new column_1.Column(this.ruleMap, 0);
        this.table = [column];
        column.wants[this.start] = [];
        column.predict(this.start);
        column.process();
    }
    next() {
        try {
            return this.lexer.next();
        }
        catch (e) {
            const nextColumn = new column_1.Column(this.ruleMap, this.current + 1);
            this.table.push(nextColumn);
            throw this.errorService.lexerError(e);
        }
    }
    feed(chunk) {
        this.lexer.feed(chunk);
        let token, column;
        while (token = this.next()) {
            column = this.table[this.current];
            if (!this.keepHistory) {
                delete this.table[this.current - 1];
            }
            const n = this.current + 1;
            const nextColumn = new column_1.Column(this.ruleMap, n);
            this.table.push(nextColumn);
            const literal = token.text !== undefined ? token.text : token.value;
            const data = this.lexer.constructor === basic_lexer_1.BasicLexer ? token.value : token;
            const { scannable } = column;
            for (let w = scannable.length; w--;) {
                const state = scannable[w];
                const expect = state.rule.symbols[state.dot];
                if ((expect.test && expect.test(data)) || (expect.type && expect.type === token.type) || (expect === null || expect === void 0 ? void 0 : expect.literal) === literal) {
                    const next = state.nextState({ data, token, isToken: true, reference: n - 1 });
                    nextColumn.states.push(next);
                }
            }
            nextColumn.process();
            if (nextColumn.states.length === 0) {
                throw this.errorService.tokenError(token);
            }
            if (this.keepHistory) {
                column.lexerState = this.lexer.state;
            }
            this.current++;
        }
        if (column) {
            this.lexerState = this.lexer.state;
        }
        this.results = this.finish();
    }
    save() {
        const column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    }
    restore(column) {
        const index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;
        this.lexer.restore(column.lexerState);
        this.results = this.finish();
    }
    rewind(index) {
        if (!this.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding');
        }
        this.restore(this.table[index]);
    }
    finish() {
        const considerations = [];
        const { states } = this.table[this.table.length - 1];
        for (const { rule: { name, symbols }, dot, reference, data } of states) {
            if (name === this.start && dot === symbols.length && !reference && data !== NearleyParser.fail) {
                considerations.push(data);
            }
        }
        return considerations;
    }
}
exports.NearleyParser = NearleyParser;
NearleyParser.fail = Symbol();
//# sourceMappingURL=parser.js.map