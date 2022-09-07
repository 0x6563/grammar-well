"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializeState = void 0;
const PostProcessors = {
    "join": "({data}) => data.join('')",
    "concat": "({data}) => data[0].concat([data[1]])",
    "null": "() => null",
    "first": "({data}) => data[0]"
};
function SerializeState(state, depth = 0) {
    return PrettyObject({
        grammar: SerializeGrammar(state.grammar, depth + 1),
        lexer: SerializeLexerConfig(state.lexer, depth + 1)
    }, depth);
}
exports.SerializeState = SerializeState;
function SerializeGrammar(grammar, depth = 0) {
    if (!grammar) {
        return null;
    }
    return PrettyObject({
        start: JSON.stringify(grammar.start),
        rules: SerializeGrammarRules(grammar.rules, depth + 1)
    }, depth);
}
function SerializeGrammarRules(rules, depth = 0) {
    const map = {};
    for (const rule of rules) {
        map[rule.name] = map[rule.name] || [];
        map[rule.name].push(SerializeGrammarRule(rule));
    }
    return PrettyObject(map, depth);
}
function NewLine(depth) {
    return '\n' + ' '.repeat(depth * 4);
}
function SerializeSymbol(s) {
    if (typeof s === 'string') {
        return JSON.stringify(s);
    }
    else if ('rule' in s) {
        return JSON.stringify(s.rule);
    }
    else if ('regex' in s) {
        return `/${s.regex}/${s.flags || ''}`;
    }
    else if ('token' in s) {
        return `{ token: ${JSON.stringify(s.token)} }`;
    }
    else {
        return JSON.stringify(s);
    }
}
function SerializeGrammarRule(rule) {
    return PrettyObject({
        name: JSON.stringify(rule.name),
        symbols: PrettyArray(rule.symbols.map(SerializeSymbol), -1),
        postprocess: rule.postprocess ? rule.postprocess.builtin ? PostProcessors[rule.postprocess.builtin] : rule.postprocess : null
    }, -1);
}
function SerializeLexerConfig(config, depth = 0) {
    if (!config) {
        return null;
    }
    if (typeof config === 'string')
        return config;
    return PrettyObject({
        start: JSON.stringify(config.start),
        states: SerializeLexerConfigStates(config.states, depth + 1)
    }, depth);
}
function SerializeLexerConfigStates(states, depth) {
    const map = {};
    for (const state of states) {
        map[state.name] = PrettyObject({
            name: JSON.stringify(state.name),
            default: state.default ? JSON.stringify(state.default) : null,
            unmatched: state.unmatched ? JSON.stringify(state.unmatched) : null,
            rules: SerializeLexerConfigStateRules(state.rules, depth + 2)
        }, depth + 1);
    }
    return PrettyObject(map, depth);
}
function SerializeLexerConfigStateRules(rules, depth) {
    const ary = rules.map(rule => {
        if ('import' in rule)
            return PrettyObject({ import: JSON.stringify(rule.import) }, -1);
        return PrettyObject({
            when: SerializeSymbol(rule.when),
            type: JSON.stringify(rule.type),
            pop: JSON.stringify(rule.pop),
            set: JSON.stringify(rule.set),
            inset: JSON.stringify(rule.inset),
            goto: JSON.stringify(rule.goto),
        }, -1);
    });
    return PrettyArray(ary, depth);
}
function PrettyObject(obj, depth = 0) {
    let r = `{`;
    const keys = Object.keys(obj).filter(v => isVal(obj[v]));
    const prefix = depth >= 0 ? NewLine(depth + 1) : ' ';
    for (let i = 0; i < keys.length; i++) {
        const key = /[a-z_][a-z\d_$]*/i.test(keys[i]) ? keys[i] : keys[i];
        const value = Array.isArray(obj[keys[i]]) ? PrettyArray(obj[keys[i]], depth >= 0 ? depth + 1 : -1) : obj[keys[i]];
        const suffix = (isVal(obj[keys[i + 1]]) ? ',' : '');
        r += `${prefix}${key}: ${value}${suffix}`;
    }
    r += `${depth >= 0 ? NewLine(depth) : ' '}}`;
    return r;
}
function PrettyArray(obj, depth = 0) {
    let r = `[`;
    for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        r += `${depth >= 0 ? NewLine(depth + 1) : ' '}${value}${(isVal(obj[i + 1]) ? ',' : '')}`;
    }
    r += `${depth >= 0 ? NewLine(depth) : ' '}]`;
    return r;
}
function isVal(value) {
    return typeof value !== 'undefined' && value !== null;
}
//# sourceMappingURL=generator.js.map