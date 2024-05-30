export class StatefulLexer {
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
        this.states = states;
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
    next(skipped = false) {
        const next = this.matchNext(skipped);
        if (!next) {
            return;
        }
        const { rule, text, index } = next;
        if (!rule) {
            throw new Error(`No matching rule for ${text}`);
        }
        const token = {
            type: rule.type,
            highlight: rule.highlight,
            open: rule.open,
            close: rule.close,
            tag: this.getTags(rule.tag),
            value: text,
            text: text,
            offset: index,
            line: this.line,
            lines: 0,
            column: this.column,
            state: this.current
        };
        this.adjustPosition(text);
        token.lines = this.line - token.line;
        this.adjustStack(rule);
        return token;
    }
    set(current) {
        if (!current || this.current === current)
            return;
        const info = this.states[current];
        this.current = current;
        this.rules = info.rules;
        this.unmatched = info.unmatched;
        this.regexp = info.regex;
    }
    pop() {
        this.set(this.stack.pop());
    }
    goto(state) {
        this.stack.push(this.current);
        this.set(state);
    }
    matchNext(skipped = false) {
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
            if (rule.before) {
                this.adjustStack(rule);
                return this.matchNext(skipped);
            }
            else if (rule.skip && !skipped) {
                this.adjustPosition(text);
                this.adjustStack(rule);
                return this.matchNext();
            }
        }
        return { index, rule, text };
    }
    getTags(tags) {
        if (!tags)
            return undefined;
        if (!this.tags.has(tags))
            this.tags.set(tags, new Set(tags));
        return this.tags.get(tags);
    }
    adjustPosition(text) {
        this.index += text.length;
        for (let i = 0; i < text.length; i++) {
            this.column++;
            if (text[i] == '\n') {
                this.line++;
                this.column = 1;
            }
        }
    }
    adjustStack(rule) {
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
//# sourceMappingURL=stateful-lexer.js.map