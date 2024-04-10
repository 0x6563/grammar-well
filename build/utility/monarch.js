"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMonarchTokenizer = void 0;
function CreateMonarchTokenizer(lexer) {
    const tokenizer = {};
    const { start, states } = lexer;
    for (const key in states) {
        const { name, rules } = states[key];
        tokenizer[name] = [];
        for (const rule of rules) {
            if ('import' in rule) {
                for (const i of rule.import) {
                    tokenizer[name].push({ include: i });
                }
            }
            else {
                const action = { token: rule.highlight || 'source' };
                if ('pop' in rule) {
                    action.next = '@pop';
                }
                else if ('goto' in rule) {
                    action.next = '@' + rule.goto;
                }
                else if ('set' in rule) {
                    action.switchTo = '@' + rule.set;
                }
                else if ('inset' in rule) {
                    action.next = '@push';
                }
                if ('embed' in rule) {
                    action.nextEmbedded = rule.embed;
                }
                else if ('unembed' in rule) {
                    action.nextEmbedded = '@pop';
                }
                tokenizer[name].push([TransformWhen(rule.when), action]);
            }
        }
    }
    return { start, tokenizer };
}
exports.CreateMonarchTokenizer = CreateMonarchTokenizer;
function TransformWhen(obj) {
    return typeof obj == 'string' ? new RegExp(RegexEscape(obj)) : new RegExp(obj.regex, obj.flags);
}
function RegexEscape(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
//# sourceMappingURL=monarch.js.map