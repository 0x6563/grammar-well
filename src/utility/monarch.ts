import { RuntimeLexerConfig, RuntimeLexerStateMatchRule } from "../typings/index.js";

export function CreateMonarchTokenizer(lexer: RuntimeLexerConfig) {
    const tokenizer: any = {}; // languages.IMonarchLanguage['tokenizer']
    const { start, states } = lexer;
    for (const name in states) {
        const { rules } = states[name];
        tokenizer[name] = [];
        for (const rule of rules) {

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
    return { start, tokenizer };
}

function TransformWhen(obj: RuntimeLexerStateMatchRule['when']) {
    return typeof obj == 'string' ? new RegExp(RegexEscape(obj)) : obj;
}

function RegexEscape(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}