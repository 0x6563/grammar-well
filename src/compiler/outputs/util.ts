import { GeneratorState, LexerConfig } from "../../typings";

const PostProcessors = {
    "joiner": "({data}) => data.join('')",
    "arrconcat": "({data}) => [data[0]].concat(data[1])",
    "arrpush": "({data}) => data[0].concat([data[1]])",
    "nuller": "() => null",
    "id": "({data}) => data[0]"
};

export function SerializeState(state: GeneratorState, depth: number = 0) {
    return `{${NewLine(depth + 1)}grammar: ${SerializeGrammar(state.grammar, depth + 1)},${NewLine(depth + 1)}lexer:${SerializeLexerConfig(state.lexer, depth + 1)}${NewLine(depth)}}`;
}

export function SerializeGrammar(grammar: GeneratorState['grammar'], depth: number = 0) {
    return `{${NewLine(depth + 1)}start: ${JSON.stringify(grammar.start)},${NewLine(depth + 1)}rules: ${SerializeGrammarRules(grammar.rules, depth + 1)}${NewLine(depth)}}`;
}

function SerializeGrammarRules(rules, depth: number = 0) {
    return `[${rules.map((rule) => NewLine(depth + 1) + SerializeGrammarRule(rule)).join()}${NewLine(depth)}]`;
}

function Indent(depth: number) {
    return ' '.repeat(depth * 4);
}

function NewLine(depth: number) {
    return '\n' + Indent(depth);
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
    var ret = '{';
    ret += ' name: ' + JSON.stringify(rule.name);
    ret += ', symbols: [' + rule.symbols.map(SerializeSymbol).join(', ') + ']';
    if (rule.postprocess) {
        if (rule.postprocess.builtin) {
            rule.postprocess = PostProcessors[rule.postprocess.builtin];
        }
        ret += ', postprocess: ' + rule.postprocess;
    }
    ret += '}';
    return ret;
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
        let r = NewLine(depth + 1) + '{';

        r += `${NewLine(depth + 2)}name: ${JSON.stringify(state.name)},`
        if (state.default) {
            r += `${NewLine(depth + 2)}default: ${JSON.stringify(state.default)},`
        }
        if (state.unmatched) {
            r += `${NewLine(depth + 2)}unmatched: ${JSON.stringify(state.unmatched)},`
        }
        r += `${NewLine(depth + 2)}rules: ${SerializeLexerConfigStateRules(state.rules, depth + 2)}`
        r += NewLine(depth + 1) + '}';
        ss.push(r);
    }
    s += ss.join();
    s += NewLine(depth) + ']';
    return s;
}

function SerializeLexerConfigStateRules(rules: LexerConfig['states'][0]['rules'], depth: number) {
    let s = `[`;
    let ss = [];
    for (const rule of rules) {
        let r = NewLine(depth + 1) + '{ ';
        if ('import' in rule) {
            r += `import: ${JSON.stringify(rule.import)}`;
        } else {
            r += `when: ${SerializeSymbol(rule.when as any)}`;
            if ('type' in rule)
                r += `, type: ${JSON.stringify(rule.type)}`;
            if ('pop' in rule)
                r += `, pop: ${JSON.stringify(rule.pop)}`;
            if ('set' in rule)
                r += `, set: ${JSON.stringify(rule.set)}`;
            if ('inset' in rule)
                r += `, inset: ${JSON.stringify(rule.inset)}`;
            if ('goto' in rule)
                r += `, goto: ${JSON.stringify(rule.goto)}`;
        }
        r += ' }';
        ss.push(r);
    }
    s += ss.join();
    s += NewLine(depth) + ']';
    return s;
}