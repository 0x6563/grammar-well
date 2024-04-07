import { LexerConfig } from "../typings";

export function CreateMonarchTokenizer(lexer: LexerConfig) {
    const tokenizer: any = {}; // languages.IMonarchLanguage['tokenizer']
    const { start, states } = lexer;
    for (const key in states) {
        const { name, rules } = states[key];
        tokenizer[name] = [];
        for (const rule of rules) {
            if ('import' in rule) {
                for (const i of rule.import) {
                    tokenizer[name].push({ include: i })
                }
            } else if ('pop' in rule) {
                tokenizer[name].push([TransformWhen(rule.when), { token: rule.highlight || 'source', next: '@pop' }])
            } else if ('goto' in rule) {
                tokenizer[name].push([TransformWhen(rule.when), { token: rule.highlight || 'source', next: '@' + rule.goto }])
            } else if ('set' in rule) {
                tokenizer[name].push([TransformWhen(rule.when), { token: rule.highlight || 'source', switchTo: '@' + rule.set }])
            } else if ('inset' in rule) {
                tokenizer[name].push([TransformWhen(rule.when), { token: rule.highlight || 'source', next: '@push' }])
            } else if ('when' in rule) {
                tokenizer[name].push([TransformWhen(rule.when), { token: rule.highlight || 'source' }])
            }
        }
    }
    return { start, tokenizer };
}

function TransformWhen(obj) {
    return typeof obj == 'string' ? new RegExp(RegexEscape(obj)) : new RegExp(obj.regex, obj.flags);
}

function RegexEscape(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}