import { GeneratorState, LexerConfig } from "../../typings";

const PostProcessors = {
    "joiner": "({data}) => data.join('')",
    "arrconcat": "({data}) => [data[0]].concat(data[1])",
    "arrpush": "({data}) => data[0].concat([data[1]])",
    "nuller": "() => null",
    "id": "({data}) => data[0]"
};

export function SerializeState(state: GeneratorState, depth: number = 0) {
    return PrettyObject({
        grammar: SerializeGrammar(state.grammar, depth + 1),
        lexer: SerializeLexerConfig(state.lexer, depth + 1)
    }, depth);
}

export function SerializeGrammar(grammar: GeneratorState['grammar'], depth: number = 0) {
    return PrettyObject({
        start: JSON.stringify(grammar.start),
        rules: SerializeGrammarRules(grammar.rules, depth + 1)
    }, depth);
}

function SerializeGrammarRules(rules, depth: number = 0) {
    return `[${rules.map((rule) => NewLine(depth + 1) + SerializeGrammarRule(rule)).join()}${NewLine(depth)}]`;
}

function NewLine(depth: number) {
    return '\n' + ' '.repeat(depth * 4);
}

function SerializeSymbol(s) {
    if (s.regex) {
        return `/${s.regex}/${s.flags || ''}`;
    } else if (s.token) {
        return s.token;
    } else {
        return JSON.stringify(s);
    }
}

function SerializeGrammarRule(rule) {
    return PrettyObject({
        name: JSON.stringify(rule.name),
        symbols: '[' + rule.symbols.map(SerializeSymbol).join(', ') + ']',
        postprocess: rule.postprocess ? rule.postprocess.builtin ? PostProcessors[rule.postprocess.builtin] : rule.postprocess : null

    }, -1);
}

export function SerializeLexerConfig(config: LexerConfig | string, depth: number = 0) {
    if (!config) {
        return 'null';
    }
    if (typeof config === 'string')
        return config;
    return `{${NewLine(depth + 1)}start: ${JSON.stringify(config.start)},${NewLine(depth + 1)}states: ${SerializeLexerConfigStates(config.states, depth + 1)}${NewLine(depth)}}`;
}

function SerializeLexerConfigStates(states: LexerConfig['states'], depth: number) {
    let s = `[`;
    let ss = [];
    for (const state of states) {
        let r = NewLine(depth + 1) + PrettyObject({
            name: JSON.stringify(state.name),
            default: state.default ? JSON.stringify(state.default) : null,
            unmatched: state.unmatched ? JSON.stringify(state.unmatched) : null,
            rules: SerializeLexerConfigStateRules(state.rules, depth + 2)
        }, depth + 1);
        ss.push(r);
    }
    s += ss.join();
    s += NewLine(depth) + ']';
    return s;
}

function SerializeLexerConfigStateRules(rules: LexerConfig['states'][0]['rules'], depth: number) {
    let s = `[${NewLine(depth + 1)}`;
    let ss = [];
    for (const rule of rules) {
        let r;
        if ('import' in rule) {
            r = PrettyObject({
                import: JSON.stringify(rule.import)
            }, -1)
        } else {
            r = PrettyObject({
                when: SerializeSymbol(rule.when as any),
                type: JSON.stringify(rule.type),
                pop: JSON.stringify(rule.pop),
                set: JSON.stringify(rule.set),
                inset: JSON.stringify(rule.inset),
                goto: JSON.stringify(rule.goto),
            }, -1);
        }
        ss.push(r);
    }
    s += ss.join(',' + NewLine(depth + 1));
    s += NewLine(depth) + ']';
    return s;
}
function PrettyObject(obj: { [key: string]: string }, depth = 0) {
    let r = `{`;
    const keys = Object.keys(obj).filter(v => isVal(obj[v]));
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = obj[key];
        r += `${depth >= 0 ? NewLine(depth + 1) : ' '}${key}: ${value}${(isVal(obj[keys[i + 1]]) ? ',' : '')}`;
    }
    r += `${depth >= 0 ? NewLine(depth) : ' '}}`;
    return r;

}

function isVal(value) {
    return typeof value !== 'undefined' && value !== null;
}