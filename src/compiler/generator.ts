import { Dictionary, GeneratorState, GeneratorGrammarRule, GeneratorGrammarSymbol, LexerConfig, LexerStateDefinition } from "../typings";

const PostProcessors = {
    "join": "({data}) => data.join('')",
    "concat": "({data}) => data[0].concat([data[1]])",
    "null": "() => null",
    "first": "({data}) => data[0]"
};

export class Generator {

    state: GeneratorState = {
        grammar: {
            start: '',
            rules: {},
            uuids: {}
        },
        lexer: null,
        head: [],
        body: [],
        config: {},
        version: 'unknown',
    }

    serializeHead() {
        if (this.state.config.noscript)
            return '';
        return this.state.head.join('\n');
    }

    serializeBody() {
        if (this.state.config.noscript)
            return '';
        return this.state.body.join('\n');
    }

    serializeLanguage(depth: number = 0) {
        return this.pretty({
            grammar: this.serializeGrammar(depth + 1),
            lexer: this.serializeLexerConfig(depth + 1)
        }, depth);
    }

    merge(state: GeneratorState) {
        // TODO: Resolve Conflicting Rules and UUIDS
        Object.assign(this.state.grammar.rules, state.grammar.rules);
        this.state.grammar.start = state.grammar.start || this.state.grammar.start;

        if (state.lexer) {
            if (this.state.lexer) {
                Object.assign(this.state.lexer.states, state.lexer.states);
            } else {
                this.state.lexer = state.lexer;
            }
            this.state.lexer.start = state.lexer.start || this.state.lexer.start;
        }
        this.state.head.push(...state.head);
        this.state.body.push(...state.body);
        Object.assign(this.state.config, state.config);
    }

    grammarUUID(name: string) {
        this.state.grammar.uuids[name] = (this.state.grammar.uuids[name] || 0) + 1;
        return name + 'x' + this.state.grammar.uuids[name];
    }

    addGrammarRule(rule: GeneratorGrammarRule) {
        this.state.grammar.rules[rule.name] = this.state.grammar.rules[rule.name] || [];
        this.state.grammar.rules[rule.name].push(rule);
    }

    addLexerState(state: LexerStateDefinition) {
        this.state.lexer.states[state.name] = this.state.lexer.states[state.name] || { name: state.name, rules: [] }
        const target = this.state.lexer.states[state.name];
        target.default = typeof state.default == 'string' ? state.default : target.default;
        target.unmatched = typeof state.unmatched == 'string' ? state.unmatched : target.unmatched;
        target.rules.push(...state.rules);
    }

    private serializeGrammar(depth: number = 0) {
        if (!this.state.grammar) {
            return null;
        }
        return this.pretty({
            start: JSON.stringify(this.state.grammar.start),
            rules: this.serializeGrammarRules(depth + 1)
        }, depth);
    }

    private serializeGrammarRules(depth: number = 0) {
        const map = {};
        for (const rule in this.state.grammar.rules) {
            map[rule] = this.state.grammar.rules[rule].map(v => this.serializeGrammarRule(v))
        }
        return this.pretty(map, depth);
    }

    private serializeSymbol(s: GeneratorGrammarSymbol) {
        if (typeof s === 'string') {
            return JSON.stringify(s);
        } else if ('rule' in s) {
            return JSON.stringify(s.rule);
        } else if ('regex' in s) {
            return `/${s.regex}/${s.flags || ''}`;
        } else if ('token' in s) {
            return `{ token: ${JSON.stringify(s.token)} }`;
        } else if ('literal' in s) {
            return `{ literal: ${JSON.stringify(s.literal)} }`;
        } else if ('js' in s) {
            return s.js;
        } else {
            return JSON.stringify(s);
        }
    }

    private serializeGrammarRule(rule: GeneratorGrammarRule) {
        const symbols = [];
        const alias = {};
        for (let i = 0; i < rule.symbols.length; i++) {
            symbols.push(this.serializeSymbol(rule.symbols[i]));
            if (rule.symbols[i].alias) {
                alias[rule.symbols[i].alias] = i;
            }
        }
        return this.pretty({
            name: JSON.stringify(rule.name),
            symbols: this.pretty(symbols, -1),
            postprocess: this.serializePostProcess(rule.postprocess, alias)
        }, -1);
    }

    private serializePostProcess(postprocess: GeneratorGrammarRule['postprocess'], alias: Dictionary<number>) {
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

    private templatePostProcess(templateBody: string, alias: { [key: string]: number }) {
        for (const key in alias) {
            templateBody = templateBody.replace(new RegExp('(?:\\$)' + key + '(?![a-zA-Z\\d\\$_])'), `data[${alias[key]}]`);
        }
        return "({data}) => { return " + templateBody.replace(/\$(\d+)/g, "data[$1]") + "; }";
    }

    private serializeLexerConfig(depth: number = 0) {
        if (!this.state.lexer)
            return null;

        if (typeof this.state.lexer === 'string')
            return this.state.lexer;

        return this.pretty({
            start: JSON.stringify(this.state.lexer.start),
            states: this.serializeLexerConfigStates(depth + 1)
        }, depth);
    }

    private serializeLexerConfigStates(depth: number) {
        const map = {};
        for (const key in this.state.lexer.states) {
            const state = this.state.lexer.states[key];
            map[state.name] = this.pretty({
                name: JSON.stringify(state.name),
                default: state.default ? JSON.stringify(state.default) : null,
                unmatched: state.unmatched ? JSON.stringify(state.unmatched) : null,
                rules: this.serializeLexerConfigStateRules(state.rules, depth + 2)
            }, depth + 1);
        }
        return this.pretty(map, depth);
    }

    private serializeLexerConfigStateRules(rules: LexerConfig['states'][0]['rules'], depth: number) {
        const ary = rules.map(rule => {
            if ('import' in rule)
                return this.pretty({ import: JSON.stringify(rule.import) }, -1)
            return this.pretty({
                when: this.serializeSymbol(rule.when as any),
                type: JSON.stringify(rule.type),
                tag: JSON.stringify(rule.tag),
                pop: JSON.stringify(rule.pop),
                highlight: JSON.stringify(rule.highlight),
                set: JSON.stringify(rule.set),
                inset: JSON.stringify(rule.inset),
                goto: JSON.stringify(rule.goto),
            }, -1);
        });
        return this.pretty(ary, depth);
    }

    private newLine(depth: number) {
        return '\n' + ' '.repeat(depth * 4);
    }

    private pretty(obj: string[] | { [key: string]: string | (string[]) }, depth = 0) {
        if (Array.isArray(obj)) {
            let r = `[`;
            for (let i = 0; i < obj.length; i++) {
                const value = obj[i];
                r += `${depth >= 0 ? this.newLine(depth + 1) : ' '}${value}${(this.isVal(obj[i + 1]) ? ',' : '')}`;
            }
            r += `${depth >= 0 ? this.newLine(depth) : ' '}]`;
            return r;
        }

        let r = `{`;
        const keys = Object.keys(obj).filter(v => this.isVal(obj[v]));
        const prefix = depth >= 0 ? this.newLine(depth + 1) : ' ';
        for (let i = 0; i < keys.length; i++) {
            const key = /[a-z_][a-z\d_$]*/i.test(keys[i]) ? keys[i] : keys[i];
            const value = Array.isArray(obj[keys[i]]) ? this.pretty(obj[keys[i]] as string[], depth >= 0 ? depth + 1 : -1) : obj[keys[i]];
            const suffix = (this.isVal(obj[keys[i + 1]]) ? ',' : '');
            r += `${prefix}${key}: ${value}${suffix}`;
        }
        r += `${depth >= 0 ? this.newLine(depth) : ' '}}`;
        return r;
    }

    private isVal(value) {
        return typeof value !== 'undefined' && value !== null;
    }
}