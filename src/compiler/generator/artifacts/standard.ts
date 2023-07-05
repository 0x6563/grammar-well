import { GeneratorGrammarRule, } from "../../../typings";
import { Generator } from "../generator";

export class StandardGrammar {

    constructor(private generator: Generator) { }

    serialize(depth: number = 0) {
        if (!this.generator.state.grammar) {
            return null;
        }
        return Generator.Pretty({
            start: JSON.stringify(this.generator.state.grammar.start),
            rules: this.serializeGrammarRules(depth + 1)
        }, depth);
    }

    private serializeGrammarRules(depth: number = 0) {
        const map = {};
        for (const rule in this.generator.state.grammar.rules) {
            map[rule] = this.generator.state.grammar.rules[rule].map(v => this.generator.serializeGrammarRule(v))
        }
        return Generator.Pretty(map, depth);
    }

}