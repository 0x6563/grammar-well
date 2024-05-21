import { ASTLexerStateImportRule, ASTLexerStateMatchRule, ASTLexerStateNonMatchRule, Dictionary, GeneratorGrammarProductionRule } from "../../typings";
import { BasicGrammarTable } from "../artifacts/basic";
import { LRParseTableBuilder } from "../artifacts/lr";
import { GeneratorState } from "../state";
import { CommonGenerator } from "./common";

const PostProcessors = {
    "join": "({data}) => data.join('')",
    "concat": "({data}) => data[0].concat([data[1]])",
    "null": "() => null",
    "first": "({data}) => data[0]"
};

export class JavaScriptGenerator {

    constructor(public state: GeneratorState) { }

    head() {
        if (this.state.config.noscript)
            return '';
        return this.state.head.join('\n');
    }

    body() {
        if (this.state.config.noscript)
            return '';
        return this.state.body.join('\n');
    }

    artifacts(depth: number = 0) {
        const basic = new BasicGrammarTable(this);
        let lr = null;

        if ('lr' in this.state.config) {
            const table = new LRParseTableBuilder(this);
            lr = CommonGenerator.JSON({
                k: "0",
                table: table.stringify(depth + 2)
            }, depth + 1);
        }

        return CommonGenerator.JSON({
            grammar: basic.stringify(depth + 1),
            lexer: this.lexerConfig(depth + 1),
            lr
        }, depth);
    }

    postProcess(postprocess: GeneratorGrammarProductionRule['postprocess'], alias: Dictionary<number>) {
        postprocess = this.state.grammar.config.postprocessorOverride || postprocess || this.state.grammar.config.postprocessorDefault;
        if (!postprocess)
            return null;
        if ('builtin' in postprocess)
            return PostProcessors[postprocess.builtin];
        if (this.state.config.noscript)
            return;
        if (typeof postprocess == 'string')
            return postprocess;
        if ('js' in postprocess)
            return postprocess.js;
        if ('template' in postprocess)
            return this.templatePostProcess(postprocess.template, alias);
    }

    grammarRule(rule: GeneratorGrammarProductionRule) {
        const symbols = [];
        const alias = {};
        for (let i = 0; i < rule.symbols.length; i++) {
            symbols.push(CommonGenerator.SerializeSymbol(rule.symbols[i]));
            if (rule.symbols[i].alias) {
                alias[rule.symbols[i].alias] = i;
            }
        }

        return CommonGenerator.JSON({
            name: JSON.stringify(rule.name),
            symbols: CommonGenerator.JSON(symbols, -1),
            postprocess: this.postProcess(rule.postprocess, alias)
        }, -1);
    }

    private templatePostProcess(templateBody: string, alias: { [key: string]: number }) {
        for (const key in alias) {
            templateBody = templateBody.replace(new RegExp('(?:\\$)' + key + '(?![a-zA-Z\\d\\$_])'), `data[${alias[key]}]`);
        }
        return "({data}) => { return " + templateBody.replace(/\$(\d+)/g, "data[$1]") + "; }";
    }

    private lexerConfig(depth: number = 0) {
        if (!this.state.lexer)
            return null;

        if (typeof this.state.lexer === 'string')
            return this.state.lexer;

        return CommonGenerator.JSON({
            start: JSON.stringify(this.state.lexer.start),
            states: this.lexerConfigStates(depth + 1)
        }, depth);
    }

    private lexerConfigStates(depth: number) {
        const map = {};
        for (const key in this.state.lexer.states) {
            const state = this.state.lexer.states[key];
            map[state.name] = CommonGenerator.JSON({
                name: JSON.stringify(state.name),
                default: state.default ? this.lexerConfigStateRule(state.default) : null,
                unmatched: state.unmatched ? this.lexerConfigStateRule(state.unmatched) : null,
                rules: this.lexerConfigStateRules(state.rules, depth + 2)
            }, depth + 1);
        }
        return CommonGenerator.JSON(map, depth);
    }

    private lexerConfigStateRules(rules: (ASTLexerStateImportRule | ASTLexerStateMatchRule)[], depth: number) {
        const ary = rules.map(rule => {
            if ('import' in rule)
                return CommonGenerator.JSON({ import: JSON.stringify(rule.import) }, -1)
            return this.lexerConfigStateRule(rule)
        });
        return CommonGenerator.JSON(ary, depth);
    }

    private lexerConfigStateRule(rule: ASTLexerStateMatchRule | ASTLexerStateNonMatchRule) {
        return CommonGenerator.JSON({
            when: 'when' in rule ? CommonGenerator.SerializeSymbol(rule.when as any) : null,
            before: JSON.stringify(rule.before),

            type: JSON.stringify(rule.type),
            tag: JSON.stringify(rule.tag),
            open: JSON.stringify(rule.open),
            close: JSON.stringify(rule.close),
            highlight: JSON.stringify(rule.highlight),

            pop: JSON.stringify(rule.pop),
            set: JSON.stringify(rule.set),
            inset: JSON.stringify(rule.inset),
            goto: JSON.stringify(rule.goto),
        }, -1);
    }
}