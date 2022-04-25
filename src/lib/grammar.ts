import { Rule, RuleConfig } from "./rule";
import { Lexer } from "./lexer";
import { Dictionary } from "../typings";

export class Grammar {
    public byName: Dictionary<Rule[]> = Object.create(null);
    public lexer: Lexer;
    constructor(
        public rules: Rule[],
        public start: string
    ) {
        this.start = this.start || this.rules[0].name;

        for (const rule of this.rules) {
            if (!this.byName[rule.name])
                this.byName[rule.name] = [rule];
            else
                this.byName[rule.name].push(rule);
        }
    }

    static fromCompiled({ ParserRules, ParserStart, Lexer }: PrecompiledGrammar) {
        const rules: Rule[] = ParserRules.map(r => new Rule(r.name, r.symbols, r.postprocess));
        const grammar = new Grammar(rules, ParserStart);
        grammar.lexer = Lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return grammar;
    }
}

interface PrecompiledGrammar {
    Lexer: Lexer;
    ParserStart: string;
    ParserRules: RuleConfig[];
} 