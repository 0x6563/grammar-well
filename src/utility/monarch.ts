import type { ASTLexerStateNonMatchRule, RuntimeLexerConfig, RuntimeLexerStateMatchRule } from "../typings/index.ts";

export function CreateMonarchTokenizer(lexer: RuntimeLexerConfig) {
    const tokenizer: any = {}; // languages.IMonarchLanguage['tokenizer']
    const { start, states } = lexer;
    for (const name in states) {
        const { rules, unmatched } = states[name];
        tokenizer[name] = [];
        for (const rule of rules) {
            tokenizer[name].push([TransformWhen(rule.when), CreateAction(rule)])
        }
        if (unmatched) {
            tokenizer[name].push([`.*?(?:(${tokenizer[name].map(v => `(${v.source})`).join('|')}))`, CreateAction(unmatched)]);
        }
    }
    return { start, tokenizer };
}

function CreateAction(rule: RuntimeLexerStateMatchRule | ASTLexerStateNonMatchRule) {
    const action: any = { token: rule.highlight || 'source' };
    if ('pop' in rule) {
        action.next = '@pop';
    } else if ('goto' in rule) {
        action.next = '@' + rule.goto;
    } else if ('set' in rule) {
        action.switchTo = '@' + rule.set;
    } else if ('inset' in rule) {
        action.next = '@push';
    }

    if ('embed' in rule) {
        action.nextEmbedded = rule.embed;
    } else if ('unembed' in rule) {
        action.nextEmbedded = '@pop';
    }

    if (rule.before) {
        action.token = '@rematch';
    }
    return action;
}

function TransformWhen(obj: RuntimeLexerStateMatchRule['when']) {
    return typeof obj == 'string' ? new RegExp(RegexEscape(obj)) : obj;
}

function RegexEscape(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}