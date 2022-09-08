import { Dictionary, GeneratorState, GrammarBuilderRule, GrammarBuilderRuleSymbol, LexerConfig, LexerStateDefinition } from "../typings";

const PostProcessors = {
    "join": "({data}) => data.join('')",
    "concat": "({data}) => data[0].concat([data[1]])",
    "null": "() => null",
    "first": "({data}) => data[0]"
};

export function SerializeState(state: GeneratorState, depth: number = 0) {
    return PrettyObject({
        grammar: SerializeGrammar(state.grammar, depth + 1),
        lexer: SerializeLexerConfig(state.lexer, depth + 1)
    }, depth);
}

function SerializeGrammar(grammar: GeneratorState['grammar'], depth: number = 0) {
    if (!grammar) {
        return null;
    }
    return PrettyObject({
        start: JSON.stringify(grammar.start),
        rules: SerializeGrammarRules(grammar.rules, depth + 1)
    }, depth);
}

function SerializeGrammarRules(rules: Dictionary<GrammarBuilderRule[]>, depth: number = 0) {
    const map = {};
    for (const rule in rules) {
        map[rule] = rules[rule].map(v => SerializeGrammarRule(v))
    }
    return PrettyObject(map, depth);
}

function NewLine(depth: number) {
    return '\n' + ' '.repeat(depth * 4);
}

function SerializeSymbol(s: GrammarBuilderRuleSymbol) {
    if (typeof s === 'string') {
        return JSON.stringify(s);
    } else if ('rule' in s) {
        return JSON.stringify(s.rule);
    } else if ('regex' in s) {
        return `/${s.regex}/${s.flags || ''}`;
    } else if ('token' in s) {
        return `{ token: ${JSON.stringify(s.token)} }`;
    } else if ('literal' in s) {
        return `{ literal: ${JSON.stringify(s.literal)} }`;
    } else {
        return JSON.stringify(s);
    }
}

function SerializeGrammarRule(rule: GrammarBuilderRule) {
    const symbols = [];
    const alias = {};
    let hasAlias = false;
    for (let i = 0; i < rule.symbols.length; i++) {
        symbols.push(SerializeSymbol(rule.symbols[i]));
        if (rule.symbols[i].alias) {
            alias[rule.symbols[i].alias] = i;
            hasAlias = true;
        }
    }
    return PrettyObject({
        name: JSON.stringify(rule.name),
        symbols: PrettyArray(symbols, -1),
        postprocess: SerializePostProcess(rule.postprocess, alias)

    }, -1);
}


function SerializePostProcess(postprocess: GrammarBuilderRule['postprocess'], alias: Dictionary<number>) {
    if (!postprocess)
        return null;
    if (typeof postprocess == 'string')
        return postprocess;
    if ('builtin' in postprocess)
        return PostProcessors[postprocess.builtin];
    if ('template' in postprocess)
        return TemplatePostProcess(postprocess.template, alias);
}
function TemplatePostProcess(str, alias) {
    for (const key in alias) {
        str = str.replace(new RegExp('(?:\\$)' + key + '(?![a-zA-Z\\d\\$_])'), `data[${alias[key]}]`);
    }
    return "({data}) => { return " + str.replace(/\$(\d+)/g, "data[$1]") + "; }";
}

function SerializeLexerConfig(config: GeneratorState['lexer'] | string, depth: number = 0) {
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

function SerializeLexerConfigStates(states: Dictionary<LexerStateDefinition>, depth: number) {
    const map = {};
    for (const key in states) {
        const state = states[key];
        map[state.name] = PrettyObject({
            name: JSON.stringify(state.name),
            default: state.default ? JSON.stringify(state.default) : null,
            unmatched: state.unmatched ? JSON.stringify(state.unmatched) : null,
            rules: SerializeLexerConfigStateRules(state.rules, depth + 2)
        }, depth + 1);
    }
    return PrettyObject(map, depth);
}

function SerializeLexerConfigStateRules(rules: LexerConfig['states'][0]['rules'], depth: number) {
    const ary = rules.map(rule => {
        if ('import' in rule)
            return PrettyObject({ import: JSON.stringify(rule.import) }, -1)
        return PrettyObject({
            when: SerializeSymbol(rule.when as any),
            type: JSON.stringify(rule.type),
            tag: JSON.stringify(rule.tag),
            pop: JSON.stringify(rule.pop),
            set: JSON.stringify(rule.set),
            inset: JSON.stringify(rule.inset),
            goto: JSON.stringify(rule.goto),
        }, -1);
    });
    return PrettyArray(ary, depth);
}

function PrettyObject(obj: { [key: string]: string | (string[]) }, depth = 0) {
    let r = `{`;
    const keys = Object.keys(obj).filter(v => isVal(obj[v]));
    const prefix = depth >= 0 ? NewLine(depth + 1) : ' ';
    for (let i = 0; i < keys.length; i++) {
        const key = /[a-z_][a-z\d_$]*/i.test(keys[i]) ? keys[i] : keys[i];
        const value = Array.isArray(obj[keys[i]]) ? PrettyArray(obj[keys[i]] as string[], depth >= 0 ? depth + 1 : -1) : obj[keys[i]];
        const suffix = (isVal(obj[keys[i + 1]]) ? ',' : '');
        r += `${prefix}${key}: ${value}${suffix}`;
    }
    r += `${depth >= 0 ? NewLine(depth) : ' '}}`;
    return r;
}

function PrettyArray(obj: string[], depth = 0) {
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