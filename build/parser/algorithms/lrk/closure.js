import { ParserUtility } from "../../../utility/parsing.js";
export class ClosureBuilder {
    grammar;
    constructor(grammar) {
        this.grammar = grammar;
    }
    get(rule) {
        const closure = { items: [], visited: new Set() };
        this.addClosure(closure, rule);
        return closure.items;
    }
    addClosure(closure, symbol) {
        if (!ParserUtility.SymbolIsTerminal(symbol)) {
            const key = symbol;
            if (!(closure.visited.has(key))) {
                closure.visited.add(key);
                const rules = this.grammar.rules[key];
                for (const rule of rules) {
                    closure.items.push({ rule, dot: 0 });
                    this.addClosure(closure, rule.symbols[0]);
                }
            }
        }
    }
}
//# sourceMappingURL=closure.js.map