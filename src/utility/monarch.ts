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
            } else {
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

                tokenizer[name].push([TransformWhen(rule.when), action])
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