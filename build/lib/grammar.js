"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grammar = void 0;
class Grammar {
    constructor(rules, start) {
        this.rules = rules;
        this.start = start;
        this.map = Object.create(null);
        this.start = this.start || this.rules[0].name;
        for (const rule of rules) {
            if (!this.map[rule.name])
                this.map[rule.name] = [rule];
            else
                this.map[rule.name].push(rule);
        }
    }
    static fromCompiled({ rules, start, lexer }) {
        const grammar = new Grammar(rules, start);
        grammar.lexer = lexer;
        return grammar;
    }
}
exports.Grammar = Grammar;
//# sourceMappingURL=grammar.js.map