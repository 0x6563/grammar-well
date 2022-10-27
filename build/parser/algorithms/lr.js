"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LR = void 0;
const parser_1 = require("../parser");
function LR(language, options = {}) {
    const { grammar, tokens } = language;
    const terminals = [];
    const nonTerminals = [];
    for (const name in grammar.rules) {
        for (const rule of grammar.rules[name]) {
            const { symbols } = rule;
            if (parser_1.Parser.SymbolIsTerminal(symbols[0])) {
                terminals.push(rule);
            }
            else {
                nonTerminals.push(rule);
            }
        }
    }
    const table = new ParsingTable(grammar);
    // console.log(table);
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
        // console.log(JSON.stringify(this.states, null, 2));
    }
    addRule(rule) {
        if (this.ruleIds.map.has(rule))
            return;
        for (let i = 0; i <= rule.symbols.length; i++) {
            this.getStateId(rule, i);
            const symbol = rule.symbols[i];
            if (symbol && !parser_1.Parser.SymbolIsTerminal(symbol)) {
                const subs = this.grammar.rules[symbol];
                this.queue.push(...this.grammar.rules[symbol]);
            }
        }
    }
    getStateId(rule, dot) {
        const composite = this.ruleIds.getId(dot === 0 ? rule.name : rule) + '.' + dot;
        if (!this.stateIds.has(composite)) {
            this.states.push({ rule, dot });
            this.stateIds.set(composite, this.states.length - 1);
        }
        return this.stateIds.get(composite);
    }
}
class IdMap {
    constructor() {
        this.id = 0;
        this.map = new Map();
    }
    getId(ref) {
        if (!this.map.has(ref)) {
            this.map.set(ref, this.id++);
        }
        return this.map.get(ref);
    }
}
//# sourceMappingURL=lr.js.map