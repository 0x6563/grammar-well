import { Lexer } from "./lexer";
import { Dictionary, Rule } from "../typings";

export class Grammar {
    public map: Dictionary<Rule[]> = Object.create(null);
    public lexer: Lexer;
    constructor(
        public rules: Rule[],
        public start: string
    ) {
        this.start = this.start || this.rules[0].name;

        for (const rule of rules) {
            if (!this.map[rule.name])
                this.map[rule.name] = [rule];
            else
                this.map[rule.name].push(rule);
        }

    }

    static fromCompiled({ rules, start, lexer }: PrecompiledGrammar): Grammar {
        const grammar = new Grammar(rules, start);
        grammar.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return grammar;
    }
}

export interface PrecompiledGrammar {
    lexer?: Lexer;
    start: string;
    rules: Rule[];
} 