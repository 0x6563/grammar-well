"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptGenerator = void 0;
const basic_1 = require("../artifacts/basic");
const lr_1 = require("../artifacts/lr");
const common_1 = require("./common");
const PostProcessors = {
    "join": "({data}) => data.join('')",
    "concat": "({data}) => data[0].concat([data[1]])",
    "null": "() => null",
    "first": "({data}) => data[0]"
};
class JavaScriptGenerator {
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
        const basic = new basic_1.BasicGrammarTable(this);
        let lr = null;
        if ('lr' in this.state.config) {
            const table = new lr_1.LRParseTableBuilder(this);
            lr = common_1.CommonGenerator.JSON({
                k: "0",
                table: table.stringify(depth + 2)
            }, depth + 1);
        }
        return common_1.CommonGenerator.JSON({
            grammar: basic.stringify(depth + 1),
            lexer: this.lexerConfig(depth + 1),
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
            symbols.push(common_1.CommonGenerator.SerializeSymbol(rule.symbols[i]));
            if (rule.symbols[i].alias) {
                alias[rule.symbols[i].alias] = i;
            }
        }
        return common_1.CommonGenerator.JSON({
            name: JSON.stringify(rule.name),
            symbols: common_1.CommonGenerator.JSON(symbols, -1),
            postprocess: this.postProcess(rule.postprocess, alias)
        }, -1);
    }
    templatePostProcess(templateBody, alias) {
        for (const key in alias) {
            templateBody = templateBody.replace(new RegExp('(?:\\$)' + key + '(?![a-zA-Z\\d\\$_])'), `data[${alias[key]}]`);
        }
        return "({data}) => { return " + templateBody.replace(/\$(\d+)/g, "data[$1]") + "; }";
    }
    lexerConfig(depth = 0) {
        if (!this.state.lexer)
            return null;
        if (typeof this.state.lexer === 'string')
            return this.state.lexer;
        return common_1.CommonGenerator.JSON({
            start: JSON.stringify(this.state.lexer.start),
            states: this.lexerConfigStates(depth + 1)
        }, depth);
    }
    lexerConfigStates(depth) {
        const map = {};
        for (const key in this.state.lexer.states) {
            const state = this.state.lexer.states[key];
            map[state.name] = common_1.CommonGenerator.JSON({
                name: JSON.stringify(state.name),
                default: state.default ? this.lexerConfigStateRule(state.default) : null,
                unmatched: state.unmatched ? this.lexerConfigStateRule(state.unmatched) : null,
                rules: this.lexerConfigStateRules(state.rules, depth + 2)
            }, depth + 1);
        }
        return common_1.CommonGenerator.JSON(map, depth);
    }
    lexerConfigStateRules(rules, depth) {
        const ary = rules.map(rule => {
            if ('import' in rule)
                return common_1.CommonGenerator.JSON({ import: JSON.stringify(rule.import) }, -1);
            return this.lexerConfigStateRule(rule);
        });
        return common_1.CommonGenerator.JSON(ary, depth);
    }
    lexerConfigStateRule(rule) {
        return common_1.CommonGenerator.JSON({
            when: 'when' in rule ? common_1.CommonGenerator.SerializeSymbol(rule.when) : null,
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
exports.JavaScriptGenerator = JavaScriptGenerator;
//# sourceMappingURL=javascript.js.map