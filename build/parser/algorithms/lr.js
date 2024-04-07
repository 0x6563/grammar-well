"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LR = void 0;
const parser_1 = require("../parser");
<<<<<<< HEAD
function LR(language, options = {}) {
    const { grammar, tokens } = language;
    const terminals = [];
    const nonTerminals = [];
    for (const name in grammar.rules) {
        for (const rule of grammar.rules[name]) {
            const { symbols } = rule;
            if (parser_1.ParserUtility.SymbolIsTerminal(symbols[0])) {
                terminals.push(rule);
            }
            else {
                nonTerminals.push(rule);
=======
function LR(language, _options = {}) {
    const { lr, tokens } = language;
    const { table } = lr;
    const stack = new LRStack();
    stack.push({ state: table['0.0'] });
    let token;
    while (token = tokens.next()) {
        for (const { symbol, next } of stack.current.state.actions) {
            if (parser_1.ParserUtility.TokenMatchesSymbol(token, symbol)) {
                stack.push({ symbol, state: table[next], value: token });
                break;
>>>>>>> main
            }
        }
        while (stack.current.state?.isFinal) {
            const rule = stack.current.state.reduce;
            stack.reduce(rule);
            stack.current.value = parser_1.ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous?.state.goto[rule.name];
            stack.shift(table[s]);
        }
    }
<<<<<<< HEAD
    const table = new ParsingTable(grammar);
    return { results: [] };
}
exports.LR = LR;
class ParsingTable {
    constructor(grammar) {
        this.grammar = grammar;
        this.states = [];
        this.symbolIds = new IdMap();
        this.ruleIds = new IdMap();
        this.stateIds = new Map();
        this.queue = [];
        this.queue.push({ name: 'S\'', symbols: [grammar.start] });
        let item;
        while (item = this.queue.shift()) {
            this.addRule(item);
        }
    }
    addRule(rule) {
        if (this.ruleIds.map.has(rule))
            return;
        for (let i = 0; i <= rule.symbols.length; i++) {
            this.getStateId(rule, i);
            const symbol = rule.symbols[i];
            if (symbol && !parser_1.ParserUtility.SymbolIsTerminal(symbol)) {
                const subs = this.grammar.rules[symbol];
                this.queue.push(...this.grammar.rules[symbol]);
            }
        }
=======
    return { results: [stack.current.value] };
}
exports.LR = LR;
class LRStack {
    stack = [];
    get current() {
        return this.stack[this.stack.length - 1];
    }
    get previous() {
        return this.stack[this.stack.length - 2];
>>>>>>> main
    }
    shift(state) {
        this.current.state = state;
    }
    reduce(rule) {
        const n = new LRStackItem();
        const l = rule.symbols.length;
        n.children = this.stack.splice(l * -1, l);
        n.children.forEach(v => delete v.state);
        n.rule = rule;
        n.symbol = rule.name;
        this.stack.push(n);
    }
    push(item) {
        this.stack.push(new LRStackItem());
        Object.assign(this.current, item);
    }
}
class LRStackItem {
    children = [];
    state;
    symbol;
    rule;
    value;
}
//# sourceMappingURL=lr.js.map