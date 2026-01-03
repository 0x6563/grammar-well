import { ParserUtility } from "../../../utility/parsing.js";
import { TextFormatter } from "../../../utility/text-format.js";
import { BiMap } from "./bimap.js";
export class CanonicalCollection {
    start;
    rules = new BiMap();
    grammar;
    cache = {};
    constructor(grammar) {
        this.grammar = grammar;
        const augmented = {
            name: Symbol(),
            symbols: [this.grammar.start]
        };
        this.grammar.rules[augmented.name] = [augmented];
        this.rules.id(augmented);
        this.start = this.generateState([{ rule: augmented, dot: 0 }]);
    }
    generateState(kernel) {
        const id = this.canonicalStateId(kernel);
        if (this.cache[id])
            return this.cache[id];
        this.cache[id] = { id };
        if (kernel.length == 1 && kernel[0].rule.symbols.length == kernel[0].dot) {
            this.cache[id].reduce = kernel[0].rule;
            return this.cache[id];
        }
        const items = [...kernel];
        const visited = new Set();
        const refs = {};
        const actions = {};
        const goto = {};
        for (let i = 0; i < items.length; i++) {
            const { rule, dot } = items[i];
            const id = this.canonicalLRItemId(items[i]);
            if (dot == rule.symbols.length)
                throw new Error('Reduce Conflict on state: ' + id + `\n${items.map(v => TextFormatter.GrammarRule(v.rule, v.dot)).join('\n')}`);
            if (visited.has(id))
                continue;
            visited.add(id);
            const symbol = rule.symbols[dot];
            const name = this.canonicalSymbolId(symbol);
            refs[name] = symbol;
            if (symbol && !ParserUtility.SymbolIsTerminal(symbol)) {
                const prods = this.grammar.rules[symbol] || [];
                for (const rule of prods) {
                    items.push({ rule, dot: 0 });
                }
                goto[name] = goto[name] || [];
                goto[name].push({ rule, dot: dot + 1 });
            }
            else {
                actions[name] = actions[name] || [];
                actions[name].push({ rule, dot: dot + 1 });
            }
        }
        this.cache[id].actions = [];
        this.cache[id].goto = {};
        for (const key in actions) {
            this.cache[id].actions.push({ symbol: refs[key], state: this.generateState(actions[key]) });
        }
        for (const key in goto) {
            this.cache[id].goto[refs[key]] = this.generateState(goto[key]);
        }
        return this.cache[id];
    }
    canonicalStateId(items) {
        return items
            .map(item => this.canonicalLRItemId(item))
            .sort()
            .join('|');
    }
    canonicalLRItemId(item) {
        return `${this.rules.id(item.rule)}:${item.dot}`;
    }
    canonicalSymbolId(symbol) {
        if (typeof symbol === 'symbol')
            return `SY:START`;
        if (typeof symbol === 'string')
            return `NT:${symbol}`;
        if (typeof symbol == 'function')
            return `FN:${symbol.toString()}`;
        if (!symbol)
            return;
        if (symbol instanceof RegExp)
            return `RG:${symbol.source}`;
        if ("token" in symbol)
            return `TK:${symbol.token}`;
        if ("literal" in symbol)
            return `LT:${symbol.literal}`;
    }
}
//# sourceMappingURL=canonical-collection.js.map