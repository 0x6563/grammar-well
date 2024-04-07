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
            else if ('pop' in rule) {
                tokenizer[name].push([TransformWhen(rule.when), { token: rule.highlight || 'source', next: '@pop' }]);
            }
            else if ('goto' in rule) {
                tokenizer[name].push([TransformWhen(rule.when), { token: rule.highlight || 'source', next: '@' + rule.goto }]);
            }
            else if ('set' in rule) {
                tokenizer[name].push([TransformWhen(rule.when), { token: rule.highlight || 'source', switchTo: '@' + rule.set }]);
            }
            else if ('inset' in rule) {
                tokenizer[name].push([TransformWhen(rule.when), { token: rule.highlight || 'source', next: '@push' }]);
            }
            else if ('when' in rule) {
                tokenizer[name].push([TransformWhen(rule.when), { token: rule.highlight || 'source' }]);
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