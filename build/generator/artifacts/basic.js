import { CommonGenerator } from "../stringify/common.js";
export class BasicGrammarTable {
    generator;
    constructor(generator) {
        this.generator = generator;
    }
    stringify(depth = 0) {
        if (!this.generator.state.grammar) {
            return null;
        }
        return CommonGenerator.JSON({
            start: JSON.stringify(this.generator.state.grammar.start),
            rules: this.stringifyGrammarRules(depth + 1)
        }, depth);
    }
    stringifyGrammarRules(depth = 0) {
        const map = {};
        for (const rule in this.generator.state.grammar.rules) {
            map[rule] = this.generator.state.grammar.rules[rule].map(v => this.generator.grammarRule(v));
        }
        return CommonGenerator.JSON(map, depth);
    }
}
//# sourceMappingURL=basic.js.map