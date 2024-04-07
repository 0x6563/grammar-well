"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonicalCollection = void 0;
const parser_1 = require("../../parser");
const bimap_1 = require("./bimap");
const closure_1 = require("./closure");
class CanonicalCollection {
    grammar;
    states = new Map();
    rules = new bimap_1.BiMap();
    terminals = new bimap_1.BiMap();
    closure;
    constructor(grammar) {
        this.grammar = grammar;
        const augmented = {
            name: Symbol(),
            symbols: [grammar.start]
        };
        grammar['rules'][augmented.name] = [augmented];
        this.closure = new closure_1.ClosureBuilder(grammar);
        this.rules.id(augmented);
        this.addState(grammar['rules'][augmented.name][0], 0);
        this.linkStates('0.0');
    }
    addState(rule, dot) {
        const id = this.getStateId(rule, dot);
        if (this.states.has(id))
            return;
        const state = {
            items: [],
            isFinal: false,
            actions: new Map(),
            goto: new Map(),
            reduce: null,
            rule: rule
        };
        state.items.push({ rule, dot });
        if (rule.symbols.length == dot)
            state.isFinal = true;
        this.states.set(id, state);
        state.items.push(...this.closure.get(rule.symbols[dot]));
        if (!state.isFinal)
            for (const { rule, dot } of state.items) {
                this.addState(rule, dot + 1);
            }
    }
    linkStates(id, completed = new Set()) {
        completed.add(id);
        const state = this.states.get(id);
        if (!state.isFinal) {
            for (const { rule, dot } of state.items) {
                const symbol = rule.symbols[dot];
                const itemStateId = this.getStateId(rule, dot + 1);
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
            state.reduce = this.rules.id(state.rule);
        }
    }
    getStateId(rule, dot) {
        return this.rules.id(rule) + '.' + dot;
    }
}
exports.CanonicalCollection = CanonicalCollection;
//# sourceMappingURL=canonical-collection.js.map