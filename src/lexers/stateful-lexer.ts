import { TokenQueue } from "./token-queue";

class StatefulLexer {
    private startState: string;
    private states: { [key: string]: CompiledStateDefinition };
    private buffer: string;
    private stack: string[];
    private index: number;
    private line: number;
    private column: number;
    private prefetched?: RegExpExecArray;
    private current: string;
    private unmatched: MatchRule;
    private rules: MatchRule[];
    private regexp: RegExp;

    constructor(states: { [key: string]: CompiledStateDefinition }, startState: string) {
        this.startState = startState;
        this.states = states;
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
        this.set(state ? state.state : this.startState);
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
            throw new Error('No Matching Rule');
        }
        const token = this.createToken(rule, text, index)
        this.processRule(rule);
        return token;
    }

    [Symbol.iterator]() {
        return new LexerIterator(this)
    }

    flush() {

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
        let rule;
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
            text = buffer.slice(index, match.index)
            this.prefetched = match;
        } else {
            rule = this.getGroup(match)
            text = match[0]
        }

        return { index, rule, text }
    }

    private createToken(rule: MatchRule, text: string, offset: number) {
        const token = {
            type: rule.type,
            value: text,
            text: text,
            offset: offset,
            line: this.line,
            column: this.column,
            state: this.current
        }

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

    private processRule(rule: MatchRule) {
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

    private getGroup(match): MatchRule {
        for (let i = 0; i < this.rules.length; i++) {
            if (match[i + 1] !== undefined) {
                return this.rules[i];
            }
        }
        throw new Error('Cannot find token type for matched text')
    }
}

class LexerIterator {
    constructor(private lexer: StatefulLexer) { }

    next() {
        const token = this.lexer.next()
        return { value: token, done: !token }
    }

    [Symbol.iterator]() {
        return this
    }
}

class RegexLib {

    static IsRegex(o: any) {
        return o instanceof RegExp
    }
    static Escape(s: string) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    }

    static HasGroups(s: string) {
        return (new RegExp('|' + s)).exec('').length > 1
    }

    static Capture(source: string) {
        return '(' + source + ')'
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

function CompileRegExp(state: ResolvedStateDefinition): RegExp {
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

export function NormalizeStates(states: StateDefinition[], start: string) {

    const statemap: { [key: string]: StateDefinition } = Object.create(null);
    const resolved = new Set<string>();
    const resolving = new Set<string>();
    const chain = new Set<string>();

    start = start || states[0].name;

    for (const state of states) {
        statemap[state.name] = state;
    }

    ResolveRuleImports(start, statemap, resolved, resolving, chain);
    for (const key in statemap) {
        if (!resolved.has(key)) {
            delete statemap[key];
        }
    }
    return statemap;
}

export function CompileStates(states: StateDefinition[], start: string): TokenQueue {
    const statemap = NormalizeStates(states, start);

    const map = Object.create(null);
    for (const key in statemap) {
        map[key] = {
            regexp: CompileRegExp(statemap[key] as ResolvedStateDefinition),
            rules: statemap[key].rules,
            unmatched: statemap[key].unmatched ? { type: statemap[key].unmatched } as MatchRule : null
        };
    }

    return new TokenQueue(new StatefulLexer(map, start));
}

function ResolveRuleImports(name: string, states: { [key: string]: StateDefinition }, resolved: Set<string>, resolving: Set<string>, chain: Set<string>) {
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
                rules.push(...states[ref].rules as MatchRule[]);
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
    rules: MatchRule[] = [];

    push(...rules: MatchRule[]) {
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

interface StateDefinition {
    name: string;
    unmatched?: string;
    default?: string;
    rules: (ImportRule | MatchRule)[];
}
interface ImportRule {
    import: string[]
}
interface MatchRule {
    when: string | RegExp
    type?: string;
    pop?: number | 'all';
    inset?: number;
    goto?: string;
    set?: string;
}

interface ResolvedStateDefinition {
    name: string;
    unmatched?: string;
    rules: MatchRule[];
}

interface CompiledStateDefinition {
    rules: MatchRule[];
    regexp: RegExp;
    unmatched?: MatchRule;
}

interface LexerConfig {
    config: {}
    states: StateDefinition[]
}