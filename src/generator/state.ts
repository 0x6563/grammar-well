import { GeneratorGrammarProductionRule, GeneratorLexerConfig, GeneratorLexerState, GeneratorStateGrammar } from "../typings/index.js";

export class GeneratorState {
    grammar?: GeneratorStateGrammar;
    lexer?: GeneratorLexerConfig;

    head: string[] = [];
    body: string[] = [];
    config = {};
    version: string = 'unknown';

    merge(state: GeneratorState) {
        if (state.grammar) {
            this.initializeGrammar();
            Object.assign(this.grammar.rules, state.grammar.rules);
            this.grammar.start = state.grammar.start || this.grammar.start;
            this.grammar.config.postprocessorDefault = state.grammar.config.postprocessorDefault || this.grammar.config.postprocessorDefault;
            this.grammar.config.postprocessorOverride = state.grammar.config.postprocessorOverride || this.grammar.config.postprocessorOverride;
        }

        if (state.lexer) {
            this.initializeLexer();
            Object.assign(this.lexer.states, state.lexer.states);
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

    initializeGrammar() {
        if (!this.grammar) {
            this.grammar = {
                start: '',
                config: {},
                rules: {},
                uuids: {},
            }
        }
    }

    addGrammarRule(rule: GeneratorGrammarProductionRule) {
        this.grammar.rules[rule.name] = this.grammar.rules[rule.name] || [];
        this.grammar.rules[rule.name].push(rule);
    }

    initializeLexer() {
        if (!this.lexer) {
            this.lexer = {
                start: '',
                states: {}
            };
        }
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
