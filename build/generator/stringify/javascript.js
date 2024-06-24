import { BasicGrammarTable } from "../artifacts/basic.js";
import { LexerArtifact } from "../artifacts/lexer.js";
import { LRParseTableBuilder } from "../artifacts/lr.js";
import { CommonGenerator } from "./common.js";
const PostProcessors = {
    "join": "({data}) => data.join('')",
    "concat": "({data}) => data[0].concat([data[1]])",
    "null": "() => null",
    "first": "({data}) => data[0]"
};
export class JavaScriptGenerator {
    state;
    constructor(state) {
        this.state = state;
    }
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
    artifacts(depth = 0) {
        const basic = new BasicGrammarTable(this);
        let lr = null;
        let lexer = null;
        if ('lr' in this.state.config) {
            const table = new LRParseTableBuilder(this);
            lr = CommonGenerator.JSON({
                k: "0",
                table: table.stringify(depth + 2)
            }, depth + 1);
        }
        if ('lexer' in this.state) {
            const l = new LexerArtifact(this.state.lexer);
            lexer = l.output(depth + 1);
        }
        return CommonGenerator.JSON({
            grammar: basic.stringify(depth + 1),
            lexer,
            lr
        }, depth);
    }
    postProcess(postprocess, alias) {
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
    grammarRule(rule) {
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
    templatePostProcess(templateBody, alias) {
        for (const key in alias) {
            templateBody = templateBody.replace(new RegExp('(?:\\$)' + key + '(?![a-zA-Z\\d\\$_])'), `data[${alias[key]}]`);
        }
        return "({data}) => { return " + templateBody.replace(/\$(\d+)/g, "data[$1]") + "; }";
    }
}
//# sourceMappingURL=javascript.js.map