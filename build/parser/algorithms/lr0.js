"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LR0 = void 0;
const parser_1 = require("../parser");
function LR0(language, options = {}) {
    var _a;
    const { grammar, tokens } = language;
    const collection = new CanonicalCollection(grammar);
    const stack = new LRStack();
    const s = collection.states.get('0.0');
    stack.append(s.rule.name);
    stack.shift(s);
    let token;
    while (token = tokens.next()) {
        for (const [symbol, state] of stack.current.state.actions) {
            if (parser_1.ParserUtility.SymbolMatchesToken(symbol, token)) {
                stack.append(symbol);
                stack.shift(collection.states.get(state));
                stack.current.value = token;
                break;
            }
        }
        while ((_a = stack.current.state) === null || _a === void 0 ? void 0 : _a.isFinal) {
            const rule = collection.rules.getItem(stack.current.state.reduce);
            stack.reduce(rule);
            stack.current.value = parser_1.ParserUtility.PostProcess(rule, stack.current.children.map(v => v.value));
            const s = stack.previous.state.goto.get(rule.name);
            stack.shift(collection.states.get(s));
        }
    }
    return { results: [stack.current.value] };
}
exports.LR0 = LR0;
class Node {
    constructor() {
        this.children = [];
    }
}
class LRStack {
    constructor() {
        this.stack = [];
    }
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
        const n = new Node();
        const l = rule.symbols.length;
        n.children = this.stack.splice(l * -1, l);
        n.children.forEach(v => delete v.state);
        n.rule = rule;
        n.symbol = rule.name;
        this.stack.push(n);
    }
    append(symbol) {
        this.stack.push(new Node());
        this.current.symbol = symbol;
    }
}
class CanonicalCollection {
    constructor(grammar) {
        this.grammar = grammar;
        this.rules = new IdMap();
        this.states = new Map();
        const augment = Symbol();
        const augmented = { name: augment, symbols: [grammar.start] };
        grammar['rules'][augment] = [augmented];
        this.rules.getId(augmented);
        this.addState(grammar['rules'][augment][0], 0);
        this.linkStates('0.0', new Set());
    }
    addState(rule, dot) {
        const id = this.getStateId(rule, dot);
        if (this.states.has(id))
            return;
        const state = new State(this.grammar, rule, dot);
        this.states.set(id, state);
        if (!state.isFinal)
            for (let i = 0; i < state.items.length; i++) {
                const item = state.items[i];
                this.addState(item.rule, item.dot + 1);
            }
    }
    getStateId(rule, dot) {
        return this.rules.getId(rule) + '.' + dot;
    }
    linkStates(id, completed) {
        completed.add(id);
        const state = this.states.get(id);
        if (!state.isFinal) {
            for (let i = 0; i < state.items.length; i++) {
                const item = state.items[i];
                const symbol = item.rule.symbols[item.dot];
                const itemStateId = this.getStateId(item.rule, item.dot + 1);
                if (parser_1.ParserUtility.SymbolIsTerminal(symbol) && typeof symbol != 'symbol') {
                    state.actions.set(symbol, itemStateId);
                }
                else {
                    state.goto.set(symbol, itemStateId);
                }
                if (!completed.has(itemStateId))
                    this.linkStates(itemStateId, completed);
            }
        }
        else {
            state.reduce = this.rules.getId(state.rule);
        }
    }
}
class State {
    constructor(grammar, rule, dot) {
        this.rule = rule;
        this.items = [];
        this.isFinal = false;
        this.actions = new Map();
        this.goto = new Map();
        if (rule.symbols.length == dot)
            this.isFinal = true;
        this.addClosure(grammar, rule, dot);
    }
    addClosure(grammar, rule, dot, visited = new Set()) {
        const symbol = rule.symbols[dot];
        if (visited.has(symbol))
            return;
        visited.add(symbol);
        this.items.push({ rule, dot });
        if (!parser_1.ParserUtility.SymbolIsTerminal(symbol)) {
            grammar
                .rules[symbol]
                .forEach(v => this.addClosure(grammar, v, 0, visited));
        }
    }
}
class IdMap {
    constructor() {
        this.map = new Map();
        this.items = [];
    }
    getId(ref) {
        if (!this.map.has(ref)) {
            this.map.set(ref, this.items.length);
            this.items.push(ref);
        }
        return this.map.get(ref);
    }
    getItem(ref) {
        return this.items[ref];
    }
}
//# sourceMappingURL=lr0.js.map