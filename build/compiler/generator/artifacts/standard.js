"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardGrammar = void 0;
const generator_1 = require("../generator");
class StandardGrammar {
    generator;
    constructor(generator) {
        this.generator = generator;
    }
    serialize(depth = 0) {
        if (!this.generator.state.grammar) {
            return null;
        }
        return generator_1.Generator.Pretty({
            start: JSON.stringify(this.generator.state.grammar.start),
            rules: this.serializeGrammarRules(depth + 1)
        }, depth);
    }
    serializeGrammarRules(depth = 0) {
        const map = {};
        for (const rule in this.generator.state.grammar.rules) {
            map[rule] = this.generator.state.grammar.rules[rule].map(v => this.generator.serializeGrammarRule(v));
        }
        return generator_1.Generator.Pretty(map, depth);
    }
}
exports.StandardGrammar = StandardGrammar;
//# sourceMappingURL=standard.js.map