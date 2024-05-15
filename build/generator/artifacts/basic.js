"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicGrammarTable = void 0;
const common_1 = require("../stringify/common");
class BasicGrammarTable {
    generator;
    constructor(generator) {
        this.generator = generator;
    }
    stringify(depth = 0) {
        if (!this.generator.state.grammar) {
            return null;
        }
        return common_1.CommonGenerator.JSON({
            start: JSON.stringify(this.generator.state.grammar.start),
            rules: this.stringifyGrammarRules(depth + 1)
        }, depth);
    }
    stringifyGrammarRules(depth = 0) {
        const map = {};
        for (const rule in this.generator.state.grammar.rules) {
            map[rule] = this.generator.state.grammar.rules[rule].map(v => this.generator.grammarRule(v));
        }
        return common_1.CommonGenerator.JSON(map, depth);
    }
}
exports.BasicGrammarTable = BasicGrammarTable;
//# sourceMappingURL=basic.js.map