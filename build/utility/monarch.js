export function CreateMonarchTokenizer(lexer) {
    const tokenizer = {};
    const { start, states } = lexer;
    for (const name in states) {
        const { rules, unmatched } = states[name];
        tokenizer[name] = [];
        for (const rule of rules) {
            tokenizer[name].push([TransformWhen(rule.when), CreateAction(rule)]);
        }
        if (unmatched) {
            tokenizer[name].push([/.*/, CreateAction(unmatched)]);
        }
    }
    return { start, tokenizer };
}
function CreateAction(rule) {
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
    if (rule.before) {
        action.token = '@rematch';
    }
    return action;
}
function TransformWhen(obj) {
    return typeof obj == 'string' ? new RegExp(RegexEscape(obj)) : obj;
}
function RegexEscape(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
//# sourceMappingURL=monarch.js.map