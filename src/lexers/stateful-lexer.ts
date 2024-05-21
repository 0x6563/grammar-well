import { StatefulLexerStateDefinition, RuntimeLexerStateMatchRule, RuntimeLexerStateDefinition, RuntimeLexerState, RuntimeLexerConfig, RuntimeLexer, ASTLexerStateNonMatchRule } from "../typings";

export class StatefulLexer implements RuntimeLexer {
    private start: string;
    private states: { [key: string]: StatefulLexerStateDefinition } = Object.create(null);
    private buffer: string;
    private stack: string[];
    private index: number;
    private line: number;
    private column: number;
    private prefetched?: RegExpExecArray;
    private current: string;
    private unmatched: ASTLexerStateNonMatchRule;
    private rules: RuntimeLexerStateMatchRule[];
    private regexp: RegExp;
    private tags = new Map<string[], Set<string>>();

    constructor({ states, start }: RuntimeLexerConfig) {
        ResolveStates(states, start);
        for (const key in states) {
            this.states[key] = {
                regexp: CompileRegExp(states[key] as RuntimeLexerStateDefinition),
                rules: states[key].rules as RuntimeLexerStateMatchRule[],
                unmatched: states[key].unmatched
            };
        }
        this.start = start;
        this.buffer = '';
        this.stack = [];
        this.feed();
    }

    feed(data?: string, state?: ReturnType<StatefulLexer['state']>) {
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
        }
    }

    next() {
        const next = this.matchNext();
        if (!next) {
            return
        }
        const { rule, text, index } = next;
        if (!rule) {
            throw new Error(`No matching rule for ${text}`);
        }
        const token = this.createToken(rule, text, index)
        this.adjustStack(rule);
        return token;
    }

    private set(current: string) {
        if (!current || this.current === current)
            return
        const info = this.states[current];
        this.current = current;
        this.rules = info.rules;
        this.unmatched = info.unmatched;
        this.regexp = info.regexp;
    }

    private pop() {
        this.set(this.stack.pop());
    }

    private goto(state: string) {
        this.stack.push(this.current)
        this.set(state)
    }

    private matchNext() {
        if (this.index === this.buffer.length) {
            return;
        }

        const { index, buffer } = this;
        let text;
        let rule: RuntimeLexerStateMatchRule | ASTLexerStateNonMatchRule;
        let match;

        this.regexp.lastIndex = index;
        if (this.prefetched) {
            match = this.prefetched;
            this.prefetched = null;
        } else {
            match = this.regexp.exec(buffer)
        }
        if (match == null) {
            rule = this.unmatched;
            text = buffer.slice(index, buffer.length);
        } else if (match.index !== index) {
            rule = this.unmatched;
            text = buffer.slice(index, match.index);
            this.prefetched = match;
        } else {
            rule = this.getGroup(match);
            text = match[0];
            if (rule.before) {
                this.adjustStack(rule);
                return this.matchNext();
            }
        }

        return { index, rule, text }
    }

    private createToken(rule: RuntimeLexerStateMatchRule, text: string, offset: number) {
        const token = {
            type: rule.type,
            highlight: rule.highlight,
            open: rule.open,
            close: rule.close,
            tag: this.getTags(rule.tag),
            value: text,
            text: text,
            offset: offset,
            line: this.line,
            lines: 0,
            column: this.column,
            state: this.current
        }
        for (let i = 0; i < text.length; i++) {
            this.column++;
            if (text[i] == '\n') {
                token.lines++;
                this.column = 1;
            }
        }
        this.index += text.length;
        this.line += token.lines;
        return token;
    }

    private getTags(tags?: string[]) {
        if (!tags)
            return undefined;
        if (!this.tags.has(tags))
            this.tags.set(tags, new Set(tags));
        return this.tags.get(tags);
    }

    private adjustStack(rule: RuntimeLexerStateMatchRule) {
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

    private getGroup(match): RuntimeLexerStateMatchRule {
        for (let i = 0; i < this.rules.length; i++) {
            if (match[i + 1] !== undefined) {
                return this.rules[i];
            }
        }
        throw new Error('Cannot find token type for matched text')
    }
}

class RegexLib {

    static IsRegex(o: any) {
        return o instanceof RegExp;
    }

    static Escape(s: string) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    static HasGroups(s: string) {
        return (new RegExp('|' + s)).exec('').length > 1;
    }

    static Capture(source: string) {
        return '(' + source + ')';
    }

    static Join(regexps: string[]) {
        if (!regexps.length)
            return '(?!)';
        const source = regexps.map((s) => `(?:${s})`).join('|');
        return `(?:${source})`;
    }

    static Source(search: string | RegExp) {
        if (typeof search === 'string') {
            return `(?:${RegexLib.Escape(search)})`;
        }
        if (RegexLib.IsRegex(search)) {
            return search.source;
        }
        throw new Error('Not a pattern: ' + search)
    }

}

function CompileRegExp(state: RuntimeLexerStateDefinition): RegExp {
    const rules = [];
    const subexpressions = [];

    let isUnicode = null;
    let isCI = null;
    for (const options of state.rules) {
        if (RegexLib.IsRegex(options.when)) {
            const when = options.when as RegExp;
            if (isUnicode === null) {
                isUnicode = when.unicode
            } else if (isUnicode !== when.unicode && !state.unmatched) {
                throw new Error(`Inconsistent Regex Flag /u in state: ${state.name}`);
            }
            if (isCI === null) {
                isCI = when.ignoreCase
            } else if (isCI !== when.ignoreCase) {
                throw new Error(`Inconsistent Regex Flag /i in state: ${state.name}`);
            }
        } else {
            if (isCI == null) {
                isCI = false;
            } else if (isCI != false) {
                throw new Error(`Inconsistent Regex Flag /i in state: ${state.name}`);
            }
        }

        rules.push(options);
        const pat = RegexLib.Source(options.when);
        const regexp = new RegExp(pat)
        if (regexp.test("")) {
            throw new Error("RegExp matches empty string: " + regexp)
        }

        if (RegexLib.HasGroups(pat)) {
            throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead")
        }

        subexpressions.push(RegexLib.Capture(pat))
    }

    let flags = !state.unmatched ? 'ym' : 'gm';
    if (isUnicode === true)
        flags += "u"
    if (isCI === true)
        flags += "i"
    return new RegExp(RegexLib.Join(subexpressions), flags);
}

export function ResolveStates(states: { [key: string]: RuntimeLexerState }, start: string) {
    const resolved = new Set<string>();
    const resolving = new Set<string>();
    const chain = new Set<string>();

    ResolveRuleImports(start, states, resolved, resolving, chain);
    for (const key in states) {
        if (!resolved.has(key)) {
            delete states[key];
        }
    }
    return states;
}

function ResolveRuleImports(name: string, states: { [key: string]: RuntimeLexerState }, resolved: Set<string>, resolving: Set<string>, chain: Set<string>) {
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
                rules.push(...states[ref].rules as RuntimeLexerStateMatchRule[]);
            }
        } else {
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
    private regexps = new Set<string>();
    private strings = new Set<string>();
    rules: RuntimeLexerStateMatchRule[] = [];

    push(...rules: RuntimeLexerStateMatchRule[]) {
        for (const rule of rules) {
            if (RegexLib.IsRegex(rule.when)) {
                if (!this.regexps.has((rule.when as RegExp).source)) {
                    this.rules.push(rule);
                }
            } else {
                if (!this.strings.has(rule.when as string)) {
                    this.rules.push(rule);
                }
            }
        }
    }
}