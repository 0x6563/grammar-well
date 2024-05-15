"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorState = void 0;
class GeneratorState {
    grammar = {
        start: '',
        config: {},
        rules: {},
        uuids: {},
    };
    lexer;
    head = [];
    body = [];
    config = {};
    version = 'unknown';
    merge(state) {
        Object.assign(this.grammar.rules, state.grammar.rules);
        this.grammar.start = state.grammar.start || this.grammar.start;
        this.grammar.config.postprocessorDefault = state.grammar.config.postprocessorDefault || this.grammar.config.postprocessorDefault;
        this.grammar.config.postprocessorOverride = state.grammar.config.postprocessorOverride || this.grammar.config.postprocessorOverride;
        if (state.lexer) {
            if (this.lexer) {
                Object.assign(this.lexer.states, state.lexer.states);
            }
            else {
                this.lexer = state.lexer;
            }
            this.lexer.start = state.lexer.start || this.lexer.start;
        }
        this.head.push(...state.head);
        this.body.push(...state.body);
        Object.assign(this.config, state.config);
    }
    grammarUUID(name) {
        this.grammar.uuids[name] = (this.grammar.uuids[name] || 0) + 1;
        return name + 'x' + this.grammar.uuids[name];
    }
    addGrammarRule(rule) {
        this.grammar.rules[rule.name] = this.grammar.rules[rule.name] || [];
        this.grammar.rules[rule.name].push(rule);
    }
    addLexerState(state) {
        this.lexer.states[state.name] = this.lexer.states[state.name] || { name: state.name, rules: [] };
        const target = this.lexer.states[state.name];
        target.default = typeof state.default == 'string' ? state.default : target.default;
        target.unmatched = typeof state.unmatched == 'string' ? state.unmatched : target.unmatched;
        target.rules.push(...state.rules);
    }
    export() {
        return {
            grammar: this.grammar,
            lexer: this.lexer,
            head: this.head,
            body: this.body,
            config: this.config,
            version: this.version
        };
    }
}
exports.GeneratorState = GeneratorState;
//# sourceMappingURL=state.js.map