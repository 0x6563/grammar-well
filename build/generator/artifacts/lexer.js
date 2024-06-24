import { CommonGenerator } from "../stringify/common.js";
export class LexerArtifact {
    lexer;
    resolved = new Set();
    resolving = new Set();
    constructor(lexer) {
        this.lexer = lexer;
    }
    output(depth = 0) {
        if (!this.lexer)
            return null;
        if (typeof this.lexer === 'string')
            return this.lexer;
        return CommonGenerator.JSON({
            start: JSON.stringify(this.lexer.start),
            states: this.lexerConfigStates(this.lexer.states, depth + 1)
        }, depth);
    }
    lexerConfigStates(states, depth) {
        this.resolveStates(this.lexer.start);
        const map = {};
        for (const key in states) {
            const state = states[key];
            map[key] = CommonGenerator.JSON({
                unmatched: state.unmatched ? this.lexerConfigStateRule(state.unmatched) : null,
                rules: this.lexerConfigStateRules(state.rules, depth + 2),
                regex: CompileRegExp(key, state)
            }, depth + 1);
        }
        return CommonGenerator.JSON(map, depth);
    }
    lexerConfigStateRules(rules, depth) {
        const ary = rules.map(rule => {
            if ('import' in rule)
                return CommonGenerator.JSON({ import: JSON.stringify(rule.import) }, -1);
            return this.lexerConfigStateRule(rule);
        });
        return CommonGenerator.JSON(ary, depth);
    }
    lexerConfigStateRule(rule) {
        return CommonGenerator.JSON({
            when: 'when' in rule ? CommonGenerator.SerializeSymbol(rule.when) : null,
            before: JSON.stringify(rule.before),
            skip: JSON.stringify(rule.skip),
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
    resolveStates(start) {
        this.resolved = new Set();
        this.resolving = new Set();
        this.resolveRuleImports(start, new Set());
        for (const key in this.lexer.states) {
            if (!this.resolved.has(key)) {
                delete this.lexer.states[key];
            }
        }
    }
    resolveRuleImports(name, chain) {
        if (chain.has(name))
            throw new Error(`Can not resolve circular import of ${name}`);
        if (!this.lexer.states[name])
            throw new Error(`Can not import unknown state ${name}`);
        if (this.resolved.has(name) || this.resolving.has(name))
            return;
        const state = this.lexer.states[name];
        const rules = new UniqueRules();
        chain.add(name);
        this.resolving.add(name);
        for (let i = 0; i < state.rules.length; i++) {
            const rule = state.rules[i];
            if ("import" in rule) {
                for (const ref of rule.import) {
                    this.resolveRuleImports(ref, chain);
                    rules.push(...this.lexer.states[ref].rules);
                }
            }
            else {
                rules.push(rule);
                if (rule.set && !this.resolving.has(rule.set)) {
                    this.resolveRuleImports(rule.set, new Set());
                }
                if (rule.goto && !this.resolving.has(rule.goto)) {
                    this.resolveRuleImports(rule.goto, new Set());
                }
            }
        }
        state.rules = rules.rules;
        chain.delete(name);
        this.resolved.add(name);
    }
}
class UniqueRules {
    regexps = new Set();
    strings = new Set();
    rules = [];
    push(...rules) {
        for (const rule of rules) {
            if (typeof rule.when === 'object') {
                if (!this.regexps.has(rule.when.regex)) {
                    this.regexps.add(rule.when.regex);
                    this.rules.push(rule);
                }
            }
            else {
                if (!this.strings.has(rule.when)) {
                    this.strings.add(rule.when);
                    this.rules.push(rule);
                }
            }
        }
    }
}
function CompileRegExp(name, state) {
    const rules = [];
    const subexpressions = [];
    let isUnicode = null;
    let isCI = null;
    for (const options of state.rules) {
        if (RegexLib.IsRegex(options.when)) {
            const { flags } = options.when;
            const u = flags.includes('u');
            const i = flags.includes('i');
            if (isUnicode === null) {
                isUnicode = u;
            }
            else if (isUnicode !== u && !state.unmatched) {
                throw new Error(`Inconsistent Regex Flag /u in state: ${name}`);
            }
            if (isCI === null) {
                isCI = i;
            }
            else if (isCI !== i) {
                throw new Error(`Inconsistent Regex Flag /i in state: ${name}`);
            }
        }
        else {
            if (!isCI) {
                isCI = false;
            }
            else if (isCI) {
                throw new Error(`Inconsistent Regex Flag /i in state: ${name}`);
            }
        }
        rules.push(options);
        const pat = RegexLib.Source(options.when);
        const regexp = new RegExp(pat);
        if (regexp.test("")) {
            throw new Error("RegExp matches empty string: " + regexp);
        }
        if (RegexLib.HasGroups(pat)) {
            throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead");
        }
        subexpressions.push(RegexLib.Capture(pat));
    }
    let flags = !state.unmatched ? 'ym' : 'gm';
    if (isUnicode === true)
        flags += "u";
    if (isCI === true)
        flags += "i";
    return `/${RegexLib.Join(subexpressions)}/${flags}`;
}
class RegexLib {
    static IsRegex(o) {
        return typeof o == 'object' && 'regex' in o;
    }
    static Escape(s) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    static HasGroups(s) {
        return (new RegExp('|' + s)).exec('').length > 1;
    }
    static Capture(source) {
        return '(' + source + ')';
    }
    static Join(regexps) {
        if (!regexps.length)
            return '(?!)';
        const source = regexps.map((s) => `(?:${s})`).join('|');
        return `(?:${source})`;
    }
    static Source(search) {
        if (typeof search === 'string') {
            return `(?:${RegexLib.Escape(search)})`;
        }
        try {
            if (RegexLib.IsRegex(search)) {
                return search.regex;
            }
            throw new Error('Not a pattern: ' + search);
        }
        catch (error) {
            throw error;
        }
    }
}
//# sourceMappingURL=lexer.js.map