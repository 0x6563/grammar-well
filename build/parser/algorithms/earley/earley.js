"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarleyParser = void 0;
const error_reporting_1 = require("./error-reporting");
class EarleyParser {
    constructor({ grammar, tokenQueue }, options = {}) {
        this.keepHistory = false;
        this.rules = Object.create(null);
        this.current = 0;
        const { rules, start } = grammar;
        this.start = start;
        for (const rule of rules) {
            if (!this.rules[rule.name])
                this.rules[rule.name] = [rule];
            else
                this.rules[rule.name].push(rule);
        }
        this.tokenQueue = tokenQueue;
        this.keepHistory = !!(options === null || options === void 0 ? void 0 : options.keepHistory);
        this.errorService = new error_reporting_1.ParserErrorService(this);
    }
    feed(input) {
        const column = new Column(this.rules, 0);
        this.table = [column];
        column.wants[this.start] = [];
        column.predict(this.start);
        column.process();
        this.tokenQueue.feed(input);
        let token = this.tokenQueue.next();
        while (token != undefined) {
            const previousColumn = this.table[this.current];
            if (!this.keepHistory) {
                delete this.table[this.current - 1];
            }
            this.current++;
            const nextColumn = new Column(this.rules, this.current);
            this.table.push(nextColumn);
            const literal = token.value;
            const data = token;
            nextColumn.data = literal;
            const { scannable } = previousColumn;
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
            token = this.tokenQueue.next();
        }
        this.results = [];
        const { states } = this.table[this.table.length - 1];
        for (const { rule: { name, symbols }, dot, reference, data } of states) {
            if (name === this.start && dot === symbols.length && !reference && data !== EarleyParser.reject) {
                this.results.push(data);
            }
        }
        return this.results;
    }
}
exports.EarleyParser = EarleyParser;
EarleyParser.reject = Symbol();
class Column {
    constructor(ruleMap, index) {
        this.ruleMap = ruleMap;
        this.index = index;
        this.states = [];
        this.wants = Object.create(null);
        this.scannable = [];
        this.completed = Object.create(null);
    }
    process() {
        let w = 0;
        let state;
        while (state = this.states[w++]) {
            if (state.isComplete) {
                state.finish();
                if (state.data !== EarleyParser.reject) {
                    const { wantedBy } = state;
                    for (let i = wantedBy.length; i--;) {
                        this.complete(wantedBy[i], state);
                    }
                    if (state.reference === this.index) {
                        const { name } = state.rule;
                        this.completed[name] = this.completed[name] || [];
                        this.completed[name].push(state);
                    }
                }
            }
            else {
                const exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }
                if (this.wants[exp]) {
                    this.wants[exp].push(state);
                    if (this.completed[exp]) {
                        for (const right of this.completed[exp]) {
                            this.complete(state, right);
                        }
                    }
                }
                else {
                    this.wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }
    predict(exp) {
        if (!this.ruleMap[exp])
            return;
        for (const rule of this.ruleMap[exp]) {
            this.states.push(new State(rule, 0, this.index, this.wants[exp]));
        }
    }
    complete(left, right) {
        const copy = left.nextState(right);
        this.states.push(copy);
    }
}
class State {
    constructor(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.wantedBy = wantedBy;
        this.data = [];
        this.isComplete = this.dot === rule.symbols.length;
    }
    nextState(child) {
        const state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
            state.right = undefined;
        }
        return state;
    }
    finish() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess({
                rule: this.rule,
                data: this.data,
                reference: this.reference,
                dot: this.dot,
                reject: EarleyParser.reject
            });
        }
    }
    build() {
        const children = [];
        let node = this;
        do {
            children[node.dot - 1] = node.right.data;
            node = node.left;
        } while (node.left);
        return children;
    }
}
//# sourceMappingURL=earley.js.map