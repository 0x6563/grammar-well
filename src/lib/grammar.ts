import { Rule } from "./rule";
import { StreamLexer } from "./streamlexer";
import { Dictionary } from "../typings";


export class Grammar {
    public byName: Dictionary<Rule[]> = {};
    public lexer: StreamLexer;
    constructor(
        public rules: Rule[],
        public start
    ) {
        this.start = start || this.rules[0].name;
        this.rules.forEach((rule) => {
            if (!this.byName.hasOwnProperty(rule.name)) {
                this.byName[rule.name] = [];
            }
            this.byName[rule.name].push(rule);
        });
    }

    // So we can allow passing (rules, start) directly to Parser for backwards compatibility
    static fromCompiled(rules, start?) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
            start = rules.ParserStart;
            rules = rules.ParserRules;
        }
        var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
        let g = new Grammar(rules, start);
        g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return g;
    }
}
