import { ASTJavaScriptBuiltin, ASTJavaScriptLiteral, ASTLexerState, Dictionary, GeneratorGrammarProductionRule, GeneratorLexerConfig, GeneratorLexerState } from "../typings";

export class GeneratorState {
    grammar: {
        start: string;
        config: {
            postprocessorDefault?: ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
            postprocessorOverride?: ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
        }
        rules: Dictionary<GeneratorGrammarProductionRule[]>,
        uuids: { [key: string]: number }
    } = {
            start: '',
            config: {},
            rules: {},
            uuids: {},
        }
    lexer: GeneratorLexerConfig | undefined;

    head: string[] = [];
    body: string[] = [];
    config: Dictionary<string> = {};
    version: string = 'unknown';

    merge(state: GeneratorState) {
        Object.assign(this.grammar.rules, state.grammar.rules);
        this.grammar.start = state.grammar.start || this.grammar.start;
        this.grammar.config.postprocessorDefault = state.grammar.config.postprocessorDefault || this.grammar.config.postprocessorDefault;
        this.grammar.config.postprocessorOverride = state.grammar.config.postprocessorOverride || this.grammar.config.postprocessorOverride;

        if (state.lexer) {
            if (this.lexer) {
                Object.assign(this.lexer.states, state.lexer.states);
            } else {
                this.lexer = state.lexer;
            }
            this.lexer.start = state.lexer.start || this.lexer.start;
        }
        this.head.push(...state.head);
        this.body.push(...state.body);
        Object.assign(this.config, state.config);
    }

    grammarUUID(name: string) {
        this.grammar.uuids[name] = (this.grammar.uuids[name] || 0) + 1;
        return name + 'x' + this.grammar.uuids[name];
    }

    addGrammarRule(rule: GeneratorGrammarProductionRule) {
        this.grammar.rules[rule.name] = this.grammar.rules[rule.name] || [];
        this.grammar.rules[rule.name].push(rule);
    }

    addLexerState(name: string, state?: GeneratorLexerState) {
        this.lexer.states[name] = this.lexer.states[name] || { rules: [] }
        if (state) {
            const target = this.lexer.states[name];
            target.unmatched = typeof state.unmatched != "undefined" ? state.unmatched : target.unmatched;
            target.rules.push(...state.rules);
        }
    }

    export() {
        return {
            grammar: this.grammar,
            lexer: this.lexer,
            head: this.head,
            body: this.body,
            config: this.config,
            version: this.version
        }
    }
}
