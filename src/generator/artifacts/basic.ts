import { CommonGenerator } from "../stringify/common.ts";
import { JavaScriptGenerator } from "../stringify/javascript.ts";

export class BasicGrammarTable {
    private generator: JavaScriptGenerator
    constructor(generator: JavaScriptGenerator) {
        this.generator = generator;
    }

    stringify(depth: number = 0) {
        if (!this.generator.state.grammar) {
            return null;
        }
        return CommonGenerator.JSON({
            start: JSON.stringify(this.generator.state.grammar.start),
            rules: this.stringifyGrammarRules(depth + 1)
        }, depth);
    }

    private stringifyGrammarRules(depth: number = 0) {
        const map = {};
        for (const rule in this.generator.state.grammar.rules) {
            map[rule] = this.generator.state.grammar.rules[rule].map(v => this.generator.grammarRule(v))
        }
        return CommonGenerator.JSON(map, depth);
    }

}