import { Dictionary, GeneratorOutputOptions, GeneratorGrammarProductionRule } from "../../typings/index.js";
import { BasicGrammarTable } from "../artifacts/basic.js";
import { LexerArtifact } from "../artifacts/lexer.js";
import { LRParseTableBuilder } from "../artifacts/lr.js";
import { GeneratorState } from "../state.js";
import { CommonGenerator } from "./common.js";

const PostProcessors = {
    "join": "({data}) => data.join('')",
    "concat": "({data}) => data[0].concat([data[1]])",
    "null": "() => null",
    "first": "({data}) => data[0]"
};

export class JavaScriptGenerator {

    constructor(public state: GeneratorState, public options: GeneratorOutputOptions) { }

    name() {
        return this.options.name || 'GWLanguage';
    }

    lifecycle(lifecycle: string) {
        if (this.options.noscript)
            return [];
        return this.state.lifecycle[lifecycle] || [];
    }

    artifacts(depth: number = 0) {
        let output: { [key: string]: string } = {};
        const artifacts = this.options.artifacts || { grammar: true, lexer: true };

        if (artifacts && artifacts.lr) {
            const table = new LRParseTableBuilder(this);
            output.lr = CommonGenerator.JSON({
                k: "0",
                table: table.stringify(depth + 2)
            }, depth + 1);
        }

        if ('lexer' in this.state && artifacts.lexer) {
            const l = new LexerArtifact(this.state.lexer);
            output.lexer = l.output(depth + 1);
        }

        if (artifacts.grammar) {
            const basic = new BasicGrammarTable(this);
            output.grammar = basic.stringify(depth + 1);
        }

        const onToken = this.lifecycle('token');
        if (onToken.length) {
            output.tokenProcessor = `() => {`
            output.tokenProcessor += `${CommonGenerator.SmartIndent(depth + 1)}return (token) => {`
            output.tokenProcessor += `${CommonGenerator.SmartIndent(depth + 2)}const processors = [`;
            output.tokenProcessor += `${CommonGenerator.SmartIndent(depth + 3)}${onToken.map(v => `({ token, state }) => ${v}`).join(',' + CommonGenerator.SmartIndent(depth + 3))}`
            output.tokenProcessor += `${CommonGenerator.SmartIndent(depth + 2)}];`
            output.tokenProcessor += `${CommonGenerator.SmartIndent(depth + 2)}for (const processor of processors) {`
            output.tokenProcessor += `${CommonGenerator.SmartIndent(depth + 3)}token = processor({ token, state: this.state })`
            output.tokenProcessor += `${CommonGenerator.SmartIndent(depth + 2)}}`
            output.tokenProcessor += `${CommonGenerator.SmartIndent(depth + 2)}return token;`
            output.tokenProcessor += `${CommonGenerator.SmartIndent(depth + 1)}}`
            output.tokenProcessor += `${CommonGenerator.SmartIndent(depth)}}`;
        }
        return CommonGenerator.JSON(output, depth);
    }

    f(token) {
        const processors = [({ token, state }) => token]
        for (const processor of processors) {
            token = processor({ token, state: this.state })
        }
        return token;
    }

    postProcess(postprocess: GeneratorGrammarProductionRule['postprocess'], alias: Dictionary<number>) {
        postprocess = this.state.grammar.config.postprocessorOverride || postprocess || this.state.grammar.config.postprocessorDefault;
        if (!postprocess)
            return null;
        if ('builtin' in postprocess)
            return PostProcessors[postprocess.builtin];
        if (this.options.noscript)
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

}