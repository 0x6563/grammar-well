export class V2GrammarString {
    source = '';
    append(directives) {
        directives = Array.isArray(directives) ? directives : [directives];
        for (const directive of directives) {
            if ("lifecycle" in directive) {
                this.appendSection("on:" + directive.lifecycle, directive.js.js.trim());
            }
            else if ("import" in directive) {
                this.appendImportDirective(directive);
            }
            else if ("config" in directive) {
                this.appendConfigDirective(directive);
            }
            else if ("grammar" in directive) {
                this.appendGrammarDirective(directive);
            }
            else if ("lexer" in directive) {
                this.appendLexerDirective(directive);
            }
        }
    }
    appendImportDirective(directive) {
        this.source += `import * from ${directive.path ? JSON.stringify(directive.import) : directive.import};\n`;
    }
    appendConfigDirective(directive) {
        this.appendSection('config', this.formatKV(directive.config, 1));
    }
    appendGrammarDirective(directive) {
        let body = '';
        if (directive.grammar.config) {
            body += this.formatKV(directive.grammar.config, 1);
        }
        if (directive.grammar.rules) {
            for (const rule of directive.grammar.rules) {
                body += this.formatGrammarRule(rule);
            }
        }
        this.appendSection('grammar', body);
    }
    formatGrammarRule(rule) {
        let body = '\n' + this.indent(1, `[${rule.name}]`);
        if (rule.postprocess) {
            body += ` ${this.formatPostProcess(rule.postprocess)}`;
        }
        for (const exp of rule.expressions) {
            body += '\n' + this.indent(2, '| ') + this.formatSymbols(exp.symbols);
            if (exp.postprocess) {
                body += ` ${this.formatPostProcess(exp.postprocess)}`;
            }
        }
        body += '\n';
        return body;
    }
    formatSymbols(exp) {
        return exp.map(v => this.formatSymbol(v) + (v.alias ? "@" + v.alias : '')).join(' ');
    }
    formatSymbol(exp) {
        if (typeof exp == 'string') {
            return JSON.stringify(exp);
        }
        if ('subexpression' in exp) {
            return `(${exp.subexpression.map(v => this.formatSymbols(v.symbols)).join(' | ')})`;
        }
        if ('rule' in exp) {
            return exp.rule;
        }
        if ('literal' in exp) {
            return (exp.insensitive ? '\\i ' : '') + JSON.stringify(exp.literal);
        }
        if ('regex' in exp) {
            let { regex, flags } = exp;
            return `r${flags || ''}:{${regex}}`;
        }
        if ('token' in exp) {
            return `<${exp.token}>`;
        }
        if ('expression' in exp) {
            return this.formatSymbol(exp.expression) + (exp.repeat || '');
        }
    }
    formatPostProcess(postProcess) {
        if ('js' in postProcess) {
            return `=> \${ ${postProcess.js} }`;
        }
        if ('template' in postProcess) {
            const prefix = postProcess.template.slice(0, 1);
            const suffix = postProcess.template.slice(-1);
            return `=> ${prefix} ${postProcess.template.slice(1, -1).trim()} ${suffix}`;
        }
    }
    appendLexerDirective(directive) {
        let body = '';
        if (directive.lexer.start) {
            body += this.formatKV({ start: directive.lexer.start }, 1);
        }
        if (directive.lexer.states) {
            for (const { state, name } of directive.lexer.states) {
                if ('span' in state) {
                    body += '\n' + this.indent(1, `[${name}] span {\n`);
                    const stateOpen = state.span.find(v => v.name == 'start');
                    const stateBody = state.span.find(v => v.name == 'span');
                    const stateClose = state.span.find(v => v.name == 'stop');
                    if (state.config) {
                        body += this.formatKV(state.config, 2);
                    }
                    if (stateOpen) {
                        body += this.formatLexerState('start', stateOpen.state, 2);
                    }
                    if (stateBody) {
                        body += this.formatLexerState('span', stateBody.state, 2);
                    }
                    if (stateClose) {
                        body += this.formatLexerState('stop', stateClose.state, 2);
                    }
                    body += '\n' + this.indent(1, `}\n`);
                }
                else {
                    body += this.formatLexerState(name, state, 1);
                }
            }
        }
        this.appendSection('lexer', body);
    }
    formatLexerState(name, state, depth = 0) {
        let body = '\n' + this.indent(depth, `[${name}]\n`);
        if (state.default) {
            body += this.indent(depth + 1, 'default: ' + this.formatLexerStateRule(state.default) + ';\n');
        }
        if (state.unmatched) {
            body += this.indent(depth + 1, 'unmatched: ' + this.formatLexerStateRule(state.unmatched) + ';\n');
        }
        for (const rule of state.rules) {
            if ('span' in rule)
                continue;
            body += this.indent(depth + 1, '- ' + this.formatLexerStateRule(rule) + '\n');
        }
        return body;
    }
    formatLexerStateRule(rule) {
        let body = '';
        if ('import' in rule) {
            body += 'import ' + rule.import.join(', ');
        }
        else {
            if (rule.before) {
                body += 'before ' + this.formatSymbol(rule.when);
            }
            else if (rule.skip) {
                body += 'skip ' + this.formatSymbol(rule.when);
            }
            else if ('when' in rule) {
                body += 'when ' + this.formatSymbol(rule.when);
            }
            if (typeof rule.type != 'undefined') {
                body += ` type ${JSON.stringify(rule.type)}`;
            }
            if (typeof rule.tag != 'undefined') {
                body += ` tag ${rule.tag.map(v => JSON.stringify(v)).join(', ')}`;
            }
            if (typeof rule.open != 'undefined') {
                body += ` open ${JSON.stringify(rule.open)}`;
            }
            if (typeof rule.close != 'undefined') {
                body += ` close ${JSON.stringify(rule.close)}`;
            }
            if (typeof rule.highlight != 'undefined') {
                body += ` highlight ${JSON.stringify(rule.highlight)}`;
            }
            if (typeof rule.unembed != 'undefined') {
                body += ` unembed`;
            }
            if (typeof rule.embed != 'undefined') {
                body += ` embed`;
            }
            if (typeof rule.pop != 'undefined') {
                body += ` pop` + (rule.pop == 'all' || rule.pop > 1 ? ' ' + rule.pop : '');
            }
            if (typeof rule.inset != 'undefined') {
                body += ` inset` + (rule.inset > 1 ? ' ' + rule.inset : '');
            }
            if (typeof rule.goto != 'undefined') {
                body += ` goto ${rule.goto}`;
            }
            if (typeof rule.set != 'undefined') {
                body += ` set ${rule.set}`;
            }
            if ("stay" in rule && rule.stay) {
                body += ` stay`;
            }
        }
        return body.trim();
    }
    formatKV(obj, depth = 0) {
        let body = '';
        for (const key in obj) {
            body += this.indent(depth, `${key}: ${JSON.stringify(obj[key])}\n`);
        }
        return body;
    }
    appendSection(label, body) {
        if (this.source) {
            this.source += '\n';
        }
        this.source += `${label} {\n${body}\n}\n`;
    }
    indent(depth = 0, content) {
        return `\t`.repeat(depth) + content;
    }
}
//# sourceMappingURL=v2.js.map