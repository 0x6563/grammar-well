"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarleyParser = void 0;
const column_1 = require("./column");
const error_reporting_1 = require("./error-reporting");
const token_queue_1 = require("../../../lexers/token-queue");
const character_lexer_1 = require("../../../lexers/character-lexer");
const stateful_lexer_1 = require("../../../lexers/stateful-lexer");
class EarleyParser {
    constructor({ grammar, lexer }, options = {}) {
        this.keepHistory = false;
        this.current = 0;
        this.ruleMap = Object.create(null);
        const { rules, start } = grammar;
        this.rules = rules;
        this.start = start || this.rules[0].name;
        for (const rule of rules) {
            if (!this.ruleMap[rule.name])
                this.ruleMap[rule.name] = [rule];
            else
                this.ruleMap[rule.name].push(rule);
        }
        this.keepHistory = !!(options === null || options === void 0 ? void 0 : options.keepHistory);
        this.errorService = new error_reporting_1.ParserErrorService(this);
        const l = (options === null || options === void 0 ? void 0 : options.lexer) || lexer;
        if (!l) {
            this.tokenQueue = new token_queue_1.TokenQueue(new character_lexer_1.CharacterLexer());
        }
        else if ("states" in l) {
            this.tokenQueue = (0, stateful_lexer_1.CompileStates)(l.states, l.start);
        }
        else {
            this.tokenQueue = new token_queue_1.TokenQueue(l);
        }
        const column = new column_1.Column(this.ruleMap, 0);
        this.table = [column];
        column.wants[this.start] = [];
        column.predict(this.start);
        column.process();
    }
    next() {
        try {
            return this.tokenQueue.next();
        }
        catch (e) {
            const nextColumn = new column_1.Column(this.ruleMap, this.current + 1);
            this.table.push(nextColumn);
            throw this.errorService.lexerError(e);
        }
    }
    feed(chunk) {
        this.tokenQueue.feed(chunk);
        let column;
        let token = this.next();
        while (token != undefined) {
            column = this.table[this.current];
            if (!this.keepHistory) {
                delete this.table[this.current - 1];
            }
            this.current++;
            const nextColumn = new column_1.Column(this.ruleMap, this.current);
            this.table.push(nextColumn);
            const literal = token.value;
            const data = token;
            nextColumn.data = literal;
            const { scannable } = column;
            for (let w = scannable.length; w--;) {
                const state = scannable[w];
                const expect = state.rule.symbols[state.dot];
                if ((expect.test && expect.test(literal)) || (expect.type && expect.type === token.type) || (expect === null || expect === void 0 ? void 0 : expect.literal) === literal) {
                    const next = state.nextState({ data, token, isToken: true, reference: this.current - 1 });
                    nextColumn.states.push(next);
                }
            }
            nextColumn.process();
            if (nextColumn.states.length === 0) {
                throw this.errorService.tokenError(token);
            }
            if (this.keepHistory) {
                column.restorePoint = this.tokenQueue.state;
            }
            token = this.next();
        }
        if (column) {
            this.restorePoint = this.tokenQueue.state;
        }
        this.results = this.finish();
    }
    save() {
        const column = this.table[this.current];
        column.restorePoint = this.restorePoint;
        return column;
    }
    restore(column) {
        const index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.restorePoint = column.restorePoint;
        this.tokenQueue.restore(column.restorePoint);
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
            if (name === this.start && dot === symbols.length && !reference && data !== EarleyParser.fail) {
                considerations.push(data);
            }
        }
        return considerations;
    }
}
exports.EarleyParser = EarleyParser;
EarleyParser.fail = Symbol();
//# sourceMappingURL=parser.js.map