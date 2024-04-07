"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveStates = exports.StatefulLexer = void 0;
class StatefulLexer {
    start;
    states = Object.create(null);
    buffer;
    stack;
    index;
    line;
    column;
    prefetched;
    current;
    unmatched;
    rules;
    regexp;
    tags = new Map();
    constructor({ states, start }) {
        ResolveStates(states, start);
        for (const key in states) {
            this.states[key] = {
                regexp: CompileRegExp(states[key]),
                rules: states[key].rules,
                unmatched: states[key].unmatched ? { type: states[key].unmatched } : null
            };
        }
        this.start = start;
        this.buffer = '';
        this.stack = [];
        this.feed();
    }
    feed(data, state) {
        this.buffer = data || '';
        this.index = 0;
        this.line = state ? state.line : 1;
        this.column = state ? state.column : 1;
        this.prefetched = state?.prefetched;
        this.set(state ? state.state : this.start);
        this.stack = state && state.stack ? state.stack.slice() : [];
    }
    state() {
        return {
            line: this.line,
            column: this.column,
            state: this.current,
            stack: this.stack.slice(),
            prefetched: this.prefetched,
        };
    }
    next() {
        const next = this.matchNext();
        if (!next) {
            return;
        }
        const { rule, text, index } = next;
        if (!rule) {
            throw new Error(`No matching rule for ${text}`);
        }
        const token = this.createToken(rule, text, index);
        this.processRule(rule);
        return token;
    }
    set(current) {
        if (!current || this.current === current)
            return;
        const info = this.states[current];
        this.current = current;
        this.rules = info.rules;
        this.unmatched = info.unmatched;
        this.regexp = info.regexp;
    }
    pop() {
        this.set(this.stack.pop());
    }
    goto(state) {
        this.stack.push(this.current);
        this.set(state);
    }
    matchNext() {
        if (this.index === this.buffer.length) {
            return;
        }
        const { index, buffer } = this;
        let text;
        let rule;
        let match;
        this.regexp.lastIndex = index;
        if (this.prefetched) {
            match = this.prefetched;
            this.prefetched = null;
        }
        else {
            match = this.regexp.exec(buffer);
        }
        if (match == null) {
            rule = this.unmatched;
            text = buffer.slice(index, buffer.length);
        }
        else if (match.index !== index) {
            rule = this.unmatched;
            text = buffer.slice(index, match.index);
            this.prefetched = match;
        }
        else {
            rule = this.getGroup(match);
            text = match[0];
        }
        return { index, rule, text };
    }
    createToken(rule, text, offset) {
        const token = {
            type: rule.type,
            tag: this.getTags(rule.tag),
            value: text,
            text: text,
            offset: offset,
            line: this.line,
            column: this.column,
            state: this.current
        };
        for (let i = 0; i < text.length; i++) {
            this.index++;
            this.column++;
            if (text[i] == '\n') {
                this.line++;
                this.column = 1;
            }
        }
        return token;
    }
    getTags(tags) {
        if (!tags)
            return undefined;
        if (!this.tags.has(tags))
            this.tags.set(tags, new Set(tags));
        return this.tags.get(tags);
    }
    processRule(rule) {
        if (rule.pop) {
            let i = rule.pop === 'all' ? this.stack.length : rule.pop;
            while (i-- > 0) {
                this.pop();
            }
        }
        if (rule.set) {
            this.set(rule.set);
        }
        if (rule.goto) {
            this.goto(rule.goto);
        }
        if (rule.inset) {
            let i = rule.inset;
            while (--i >= 0) {
                this.goto(this.current);
            }
        }
    }
    getGroup(match) {
        for (let i = 0; i < this.rules.length; i++) {
            if (match[i + 1] !== undefined) {
                return this.rules[i];
            }
        }
        throw new Error('Cannot find token type for matched text');
    }
}
exports.StatefulLexer = StatefulLexer;
class RegexLib {
    static IsRegex(o) {
        return o instanceof RegExp;
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
        if (RegexLib.IsRegex(search)) {
            return search.source;
        }
        throw new Error('Not a pattern: ' + search);
    }
}
function CompileRegExp(state) {
    const rules = [];
    const subexpressions = [];
    let isUnicode = null;
    let isCI = null;
    for (const options of state.rules) {
        if (RegexLib.IsRegex(options.when)) {
            const when = options.when;
            if (isUnicode === null) {
                isUnicode = when.unicode;
            }
            else if (isUnicode !== when.unicode && !state.unmatched) {
                throw new Error(`Inconsistent Regex Flag /u in state: ${state.name}`);
            }
            if (isCI === null) {
                isCI = when.ignoreCase;
            }
            else if (isCI !== when.ignoreCase) {
                throw new Error(`Inconsistent Regex Flag /i in state: ${state.name}`);
            }
        }
        else {
            if (isCI == null) {
                isCI = false;
            }
            else if (isCI != false) {
                throw new Error(`Inconsistent Regex Flag /i in state: ${state.name}`);
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
    return new RegExp(RegexLib.Join(subexpressions), flags);
}
function ResolveStates(states, start) {
    const resolved = new Set();
    const resolving = new Set();
    const chain = new Set();
    ResolveRuleImports(start, states, resolved, resolving, chain);
    for (const key in states) {
        if (!resolved.has(key)) {
            delete states[key];
        }
    }
    return states;
}
exports.ResolveStates = ResolveStates;
function ResolveRuleImports(name, states, resolved, resolving, chain) {
    if (chain.has(name))
        throw new Error(`Can not resolve circular import of ${name}`);
    if (!states[name])
        throw new Error(`Can not import unknown state ${name}`);
    if (resolved.has(name) || resolving.has(name))
        return;
    const state = states[name];
    const rules = new UniqueRules();
    chain.add(name);
    resolving.add(name);
    for (let i = 0; i < state.rules.length; i++) {
        const rule = state.rules[i];
        if ("import" in rule) {
            for (const ref of rule.import) {
                ResolveRuleImports(ref, states, resolved, resolving, chain);
                rules.push(...states[ref].rules);
            }
        }
        else {
            rules.push(rule);
            if ("set" in rule && !resolving.has(rule.set)) {
                ResolveRuleImports(rule.set, states, resolved, resolving, new Set());
            }
            if ("goto" in rule && !resolving.has(rule.goto)) {
                ResolveRuleImports(rule.goto, states, resolved, resolving, new Set());
            }
        }
    }
    state.rules = rules.rules;
    chain.delete(name);
    resolved.add(name);
}
class UniqueRules {
    regexps = new Set();
    strings = new Set();
    rules = [];
    push(...rules) {
        for (const rule of rules) {
            if (RegexLib.IsRegex(rule.when)) {
                if (!this.regexps.has(rule.when.source)) {
                    this.rules.push(rule);
                }
            }
            else {
                if (!this.strings.has(rule.when)) {
                    this.rules.push(rule);
                }
            }
        }
    }
}
//# sourceMappingURL=stateful-lexer.js.map