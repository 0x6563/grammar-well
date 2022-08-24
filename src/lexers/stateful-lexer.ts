import { LegacyLexerAdapter } from "./legacy-adapter";

const DefaultErrorRule = TransformRule('error', { lineBreaks: true, shouldThrow: true });

function isRegExp(o: any) { return o?.toString() === '[object RegExp]' }
function isObject(o: any) { return o && typeof o === 'object' && !isRegExp(o) && !Array.isArray(o) }

function RegexEscape(s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
function RegexGroups(s: string) {
    return (new RegExp('|' + s)).exec('').length - 1
}

function RegexCapture(source: string) {
    return '(' + source + ')'
}
function RegexUnion(regexps: string[]) {
    if (!regexps.length)
        return '(?!)';
    const source = regexps.map((s) => `(?:${s})`).join('|');
    return `(?:${source})`;
}

function regexpOrLiteral(obj: string | RegExp) {
    if (typeof obj === 'string') {
        return `(?:${RegexEscape(obj)})`;
    }
    if (isRegExp(obj)) {
        // TODO: consider /u support
        if (obj.ignoreCase)
            throw new Error('RegExp /i flag not allowed')
        if (obj.global)
            throw new Error('RegExp /g flag is implied')
        if (obj.sticky)
            throw new Error('RegExp /y flag is implied')
        if (obj.multiline)
            throw new Error('RegExp /m flag is implied')
        return obj.source
    }
    throw new Error('Not a pattern: ' + obj)
}

function LastNLines(string: string, numLines: number) {
    let position = string.length;
    while (numLines > 0 && --position >= 0) {
        if (string[position] == '\n') {
            numLines--;
        }
    }
    return string.substring(position + 1).split("\n");
}

function ConvertObjectToRules(obj): LexerRule[] {
    const result: LexerRule[] = [];
    for (const key in obj) {
        const rules = [].concat(obj[key]);
        if (key === 'include') {
            rules.forEach(rule => result.push({ include: rule }));
        } else {
            let match = [];
            for (const rule of rules) {
                if (isObject(rule)) {
                    if (match.length)
                        result.push(TransformRule(key, match))
                    result.push(TransformRule(key, rule))
                    match = []
                } else {
                    match.push(rule)
                }
            }
            if (match.length)
                result.push(TransformRule(key, match))
        }
    }
    return result;
}

function ConvertArrayToRules(array): LexerRule[] {
    const result: LexerRule[] = [];
    for (const obj of array) {
        if (obj.include) {
            const includes = [].concat(obj.include);
            includes.forEach(include => result.push({ include }));
        } else if (obj.type) {
            result.push(TransformRule(obj.type, obj))
        } else {
            throw new Error('Rule has no type: ' + JSON.stringify(obj))
        }
    }
    return result;
}

function TransformRule(type: string, ref: LexerRule | string | RegExp | ((RegExp | string)[])): LexerRule {
    const obj: LexerRule = isObject(ref) ? { match: (ref as RegExp[]) } as LexerRule : ref as LexerRule;

    const options: LexerRule = {
        defaultType: type,
        lineBreaks: !!obj.error || !!obj.fallback,
        pop: false,
        next: null,
        push: null,
        error: false,
        fallback: false,
        value: null,
        type: null,
        shouldThrow: false,
    }

    Object.assign(options, obj);

    // type transform cannot be a string
    if (typeof options.type === 'string' && type !== options.type) {
        throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')")
    }

    // convert to array
    const { match } = options;
    options.match = Array.isArray(match) ? match : match ? [match] : []
    options.match.sort((a, b) => {
        const isARegex = isRegExp(a);
        const isBRegex = isRegExp(b);
        if (isARegex && isBRegex)
            return 0;
        if (isARegex)
            return 1;
        if (isBRegex)
            return -1;
        return (b as string).length - (a as string).length
    })
    return options;
}

function CompileRules(rules: LexerRule[], hasStates?: boolean) {
    const fast = Object.create(null)
    const groups = [];
    const parts = [];

    let errorRule = null
    let unicodeFlag = null
    let fastAllowed = rules.findIndex((v) => v.fallback) < 0;

    for (const options of rules) {
        if (options.error || options.fallback) {
            // errorRule can only be set once
            if (errorRule) {
                if (!options.fallback === !errorRule.fallback)
                    throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')")
                throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')")
            }
            errorRule = options
        }

        const matches = options.match.slice();

        if (fastAllowed) {
            while (matches.length && typeof matches[0] === 'string' && matches[0].length === 1) {
                const word = matches.shift() as string;
                fast[word.charCodeAt(0)] = options
            }
        }

        if (options.pop || options.push || options.next) {
            if (!hasStates) {
                throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')")
            }
            if (options.fallback) {
                throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')")
            }
        }

        if (matches.length === 0) {
            continue
        }
        fastAllowed = false

        groups.push(options)

        for (const match of matches) {
            if (!isRegExp(match)) {
                continue;
            }
            const obj = match as RegExp;
            if (unicodeFlag === null) {
                unicodeFlag = obj.unicode
            } else if (unicodeFlag !== obj.unicode && options.fallback === false) {
                throw new Error('If one rule is /u then all must be')
            }
        }

        // convert to RegExp
        const pat = RegexUnion(matches.map(regexpOrLiteral))

        // validate
        const regexp = new RegExp(pat)
        if (regexp.test("")) {
            throw new Error("RegExp matches empty string: " + regexp)
        }
        const groupCount = RegexGroups(pat)
        if (groupCount > 0) {
            throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead")
        }

        // try and detect rules matching newlines
        if (!options.lineBreaks && regexp.test('\n')) {
            throw new Error('Rule should declare lineBreaks: ' + regexp)
        }

        // store regex
        parts.push(RegexCapture(pat))
    }

    let flags = !(errorRule && errorRule.fallback) ? 'ym' : 'gm'

    if (unicodeFlag === true)
        flags += "u"
    const regexp = new RegExp(RegexUnion(parts), flags)
    return {
        regexp,
        groups,
        fast,
        error: errorRule || DefaultErrorRule
    }
}

function CheckStateGroup(g, name: string, map: { [key: string]: never }) {
    const state = g && (g.push || g.next);
    if (state && !map[state]) {
        throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')")
    }
    if (g && g.pop && +g.pop !== 1) {
        throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')")
    }
}
export function CompileStates(states, start): LegacyLexerAdapter {
    const ruleMap: { [key: string]: LexerRule[] } = Object.create(null)

    for (const key in states) {
        start = start || key;
        ruleMap[key] = Array.isArray(states[key]) ? ConvertArrayToRules(states[key]) : ConvertObjectToRules(states[key]);
    }

    for (const key in states) {
        const rules = ruleMap[key]
        const included = new Set(rules);
        const includedState = new Set();
        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j]
            if (!rule.include)
                continue;
            const splice: [number, number, ...LexerRule[]] = [j, 1]
            if (rule.include !== key && !includedState.has(rule.include)) {
                includedState.add(rule.include);
                const newRules = ruleMap[rule.include];
                if (!newRules) {
                    throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')")
                }
                for (const newRule of newRules) {
                    if (included.has(newRule))
                        continue;
                    splice.push(newRule);
                    included.add(newRule);
                }
            }
            rules.splice.apply(rules, splice)
            j--
        }
    }

    const map = Object.create(null);
    for (const key in states) {
        map[key] = CompileRules(ruleMap[key], true)
    }

    for (const key in states) {
        const state = map[key];
        for (const group of state.groups) {
            CheckStateGroup(group, key, map);
        }
        for (const f in state.fast) {
            CheckStateGroup(state.fast[f], key, map);
        }
    }

    return new LegacyLexerAdapter(new StatefulLexer(map, start));
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

interface LexerRule {
    defaultType?: string;
    type?: string | ((s: string) => string);
    value?: string | ((s: string) => string);
    push?: string;
    pop?: boolean;
    next?: string;
    shouldThrow?: boolean;
    lineBreaks?: boolean;
    match?: (string | RegExp)[];
    error?: boolean;
    fallback?: boolean;
    include?: string;
}

class StatefulLexer {
    startState: string;
    states: { [key: string]: { groups: LexerRule[], error: { error: boolean }, regexp: RegExp, fast: { [key: string]: LexerRule } } };
    buffer: string;
    stack: string[];
    index: number;
    line: number;
    col: number;
    queuedText: string;
    state: string;
    error: { error: boolean };
    groups: LexerRule[];
    fast: LexerRule;
    queuedGroup: LexerRule;
    regexp: RegExp;

    constructor(states: { [key: string]: { groups: LexerRule[], error: { error: boolean }, regexp: RegExp, fast: { [key: string]: LexerRule } } }, state: string) {
        this.startState = state;
        this.states = states;
        this.buffer = '';
        this.stack = [];
        this.reset();
    }

    reset(data?: string, info?: { line: number, col: number, queuedText: string, state: string, stack: string[] }) {
        this.buffer = data || '';
        this.index = 0;
        this.line = info ? info.line : 1;
        this.col = info ? info.col : 1;
        this.queuedText = info ? info.queuedText : "";
        this.setState(info ? info.state : this.startState);
        this.stack = info && info.stack ? info.stack.slice() : [];
    }

    save() {
        return {
            line: this.line,
            col: this.col,
            state: this.state,
            stack: this.stack.slice(),
            queuedText: this.queuedText,
        }
    }

    setState(state: string) {
        if (!state || this.state === state)
            return
        const info = this.states[state];
        this.state = state;
        this.groups = info.groups;
        this.error = info.error;
        this.regexp = info.regexp;
        this.fast = info.fast;
    }

    pop() {
        this.setState(this.stack.pop());
    }

    push(state: string) {
        this.stack.push(this.state)
        this.setState(state)
    }
    next() {
        const index = this.index

        // If a fallback token matched, we don't need to re-run the RegExp
        if (this.queuedGroup) {
            const token = this.token(this.queuedGroup, this.queuedText, index)
            this.queuedGroup = null
            this.queuedText = ""
            return token
        }

        const buffer = this.buffer
        if (index === buffer.length) {
            return // EOF
        }

        // Fast matching for single characters
        let group = this.fast[buffer.charCodeAt(index)]
        if (group) {
            return this.token(group, buffer.charAt(index), index)
        }

        // Execute RegExp
        const re = this.regexp
        re.lastIndex = index
        const match = re.exec(buffer)


        // Error tokens match the remaining buffer
        const error = this.error
        if (match == null) {
            return this.token(error, buffer.slice(index, buffer.length), index)
        }

        group = this.getGroup(match)
        const text = match[0]

        if ('fallback' in error && match.index !== index) {
            this.queuedGroup = group
            this.queuedText = text

            // Fallback tokens contain the unmatched portion of the buffer
            return this.token(error, buffer.slice(index, match.index), index)
        }

        return this.token(group, text, index)
    }

    formatError(token, message) {
        if (token == null) {
            // An undefined token indicates EOF
            const text = this.buffer.slice(this.index)
            token = {
                text: text,
                offset: this.index,
                lineBreaks: text.indexOf('\n') === -1 ? 0 : 1,
                line: this.line,
                col: this.col,
            }
        }

        const numLinesAround = 2
        const firstDisplayedLine = Math.max(token.line - numLinesAround, 1)
        const lastDisplayedLine = token.line + numLinesAround
        const lastLineDigits = String(lastDisplayedLine).length
        const displayedLines = LastNLines(
            this.buffer,
            (this.line - token.line) + numLinesAround + 1
        )
            .slice(0, 5)
        const errorLines = []
        errorLines.push(message + " at line " + token.line + " col " + token.col + ":")
        errorLines.push("")
        for (let i = 0; i < displayedLines.length; i++) {
            const line = displayedLines[i]
            const lineNo = firstDisplayedLine + i
            errorLines.push(lineNo.toString().padStart(lastLineDigits, ' ') + "  " + line);
            if (lineNo === token.line) {
                errorLines.push("".padStart(lastLineDigits + token.col + 1, " ") + "^")
            }
        }
        return errorLines.join("\n")
    }

    clone() {
        return new StatefulLexer(this.states, this.state)
    }

    [Symbol.iterator]() {
        return new LexerIterator(this)
    }


    private token(group: LexerRule, text, offset) {
        // count line breaks
        let lineBreaks = 0
        let nl = 0;
        if (group.lineBreaks) {
            const matchNL = /\n/g
            nl = 1
            if (text === '\n') {
                lineBreaks = 1
            } else {
                while (matchNL.exec(text)) {
                    lineBreaks++;
                    nl = matchNL.lastIndex
                }
            }
        }

        const token = {
            type: (typeof group.type === 'function' && group.type(text)) || group.defaultType,
            value: typeof group.value === 'function' ? group.value(text) : text,
            text: text,
            toString() {
                return this.value;
            },
            offset: offset,
            lineBreaks: lineBreaks,
            line: this.line,
            col: this.col,
        }
        // nb. adding more props to token object will make V8 sad!

        const size = text.length
        this.index += size
        this.line += lineBreaks
        if (lineBreaks !== 0) {
            this.col = size - nl + 1
        } else {
            this.col += size
        }

        // throw, if no rule with {error: true}
        if (group.shouldThrow) {
            const err = new Error(this.formatError(token, "invalid syntax"))
            throw err;
        }

        if (group.pop)
            this.pop()
        else if (group.push)
            this.push(group.push)
        else if (group.next)
            this.setState(group.next)

        return token;
    }

    private getGroup(match): LexerRule {
        const groupCount = this.groups.length
        for (let i = 0; i < groupCount; i++) {
            if (match[i + 1] !== undefined) {
                return this.groups[i]
            }
        }
        throw new Error('Cannot find token type for matched text')
    }
}

