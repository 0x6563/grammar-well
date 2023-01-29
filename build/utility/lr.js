"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRStack = exports.CanonicalCollection = void 0;
const parser_1 = require("../parser/parser");
const general_1 = require("./general");
class CanonicalCollection {
    grammar;
    rules = new general_1.Collection();
    states = Object.create(null);
    symbols;
    constructor(grammar) {
        this.grammar = grammar;
        this.symbols = grammar.symbols || new general_1.SymbolCollection();
        const augmented = { name: Symbol(), symbols: [grammar.start] };
        grammar.rules[augmented.name] = [augmented];
        this.addState([{ rule: augmented, dot: 0 }]);
    }
    addState(seed) {
        const id = this.encodeStateItems(seed);
        if (id in this.states)
            return this.states[id];
        const state = new State(this, seed);
        this.states[id] = state;
        for (const q in state.queue) {
            this.addState(state.queue[q]);
        }
        state.queue = {};
    }
    encodeRule(rule, dot) {
        return this.rules.encode(rule) + '.' + dot;
    }
    encodeStateItems(seed) {
        return Array.from(new Set(seed)).map(v => this.encodeRule(v.rule, v.dot)).sort().join();
    }
}
exports.CanonicalCollection = CanonicalCollection;
class State {
    collection;
    isFinal = false;
    outputs = {
        goto: {},
        action: {}
    };
    queue = {};
    actions = new Map();
    goto = new Map();
    reduce;
    constructor(collection, items) {
        this.collection = collection;
        const visited = new Set();
        for (const item of items) {
            this.closure(item.rule, item.dot, visited);
        }
        if (this.isFinal) {
            if (items.length == 1 && visited.size < 1) {
                this.reduce = items[0].rule;
            }
            else {
                throw 'Conflict Detected';
            }
        }
        for (const k in this.outputs.goto) {
            const seed = this.outputs.goto[k];
            const stateId = this.collection.encodeStateItems(seed);
            this.queue[stateId] = seed;
            this.goto.set(this.collection.symbols.decode(k), stateId);
        }
        for (const k in this.outputs.action) {
            const seed = this.outputs.action[k];
            const stateId = this.collection.encodeStateItems(seed);
            this.queue[stateId] = seed;
            this.actions.set(this.collection.symbols.decode(k), stateId);
        }
    }
    closure(rule, dot, visited) {
        const isFinal = rule.symbols.length == dot;
        this.isFinal = isFinal || this.isFinal;
        const { [dot]: symbol } = rule.symbols;
        if (isFinal || visited.has(symbol))
            return;
        visited.add(symbol);
        const stateItem = { rule, dot: dot + 1 };
        if (parser_1.ParserUtility.SymbolIsTerminal(symbol)) {
            const id = this.collection.symbols.encode(symbol);
            this.outputs.action[id] = this.outputs.action[id] || [];
            this.outputs.action[id].push(stateItem);
        }
        else {
            const id = this.collection.symbols.encode(symbol);
            this.outputs.goto[id] = this.outputs.goto[id] || [];
            this.outputs.goto[id].push(stateItem);
            for (const rule of this.collection.grammar.rules[symbol]) {
                this.closure(rule, 0, visited);
            }
        }
    }
}
class LRStack {
    stack = [];
    get current() {
        return this.stack[this.stack.length - 1];
    }
    get previous() {
        return this.stack[this.stack.length - 2];
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
    add(symbol) {
        this.stack.push(new LRStackItem());
        this.current.symbol = symbol;
    }
}
exports.LRStack = LRStack;
class LRStackItem {
    children = [];
    state;
    symbol;
    rule;
    value;
}
//# sourceMappingURL=lr.js.map