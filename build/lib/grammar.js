"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grammar = void 0;
const rule_1 = require("./rule");
class Grammar {
    constructor(rules, start) {
        this.rules = rules;
        this.start = start;
        this.byName = Object.create(null);
        this.start = this.start || this.rules[0].name;
        for (const rule of this.rules) {
            if (!this.byName[rule.name])
                this.byName[rule.name] = [rule];
            else
                this.byName[rule.name].push(rule);
        }
    }
    static fromCompiled({ ParserRules, ParserStart, Lexer }) {
        const rules = ParserRules.map(r => new rule_1.Rule(r.name, r.symbols, r.postprocess));
        const grammar = new Grammar(rules, ParserStart);
        grammar.lexer = Lexer;
        return grammar;
    }
}
exports.Grammar = Grammar;
//# sourceMappingURL=grammar.js.map