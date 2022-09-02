import { readFileSync, writeFileSync } from "fs";
import GWell from './src/grammars/gwell';
import { Parser } from './src/index';
const lexer = GWell();
let file = '';
WriteLine(`start: ${JSON.stringify(lexer.start)}`);

for (const state of lexer.lexer.states) {
    WriteLine(`${state.name} ->`);
    if (state.default) {
        WriteLine(`\tdefault: "${state.default}"`)
    }
    if (state.unmatched) {
        WriteLine(`\tunmatched: "${state.unmatched}"`)
    }
    for (const rule of state.rules) {
        let s = '\t-';
        if ("import" in rule) {
            s += ` import: ${Print(rule.import)}`;
        }
        if ("when" in rule) {
            s += ` when: ${Print(rule.when)}`;
        }
        if ("type" in rule) {
            s += ` type: ${Print(rule.type)}`;
        }
        if ("pop" in rule) {
            s += ` pop: ${Print(rule.pop)}`;
        }
        if ("goto" in rule) {
            s += ` goto: ${rule.goto}`;
        }
        if ("set" in rule) {
            s += ` set: ${rule.set}`;
        }
        WriteLine(s);
    }
}
writeFileSync('./out.txt', file);


// const lexer = CompileStates(States, "start");
// const s = readFileSync('./src/grammars/grammar-well.gwell', 'utf-8')
// lexer.feed(s)
// let next = lexer.next();
// while (next) {
//     console.log({ type: next.type, value: next.value });
//     next = lexer.next();
// }
function WriteLine(s) {
    file += s + '\n';
}

function Print(val) {
    if (val instanceof RegExp) {
        return `/${val.source}/`;
    }
    if (typeof val == 'string') {
        return JSON.stringify(val);
    }
    if (typeof val == 'number') {
        return val;
    }
    if (Array.isArray(val)) {
        return val.join(', ');
    }
}


Write('./out1.json', TestGrammar(GWell, Read('./src/grammars/gwell.gwell')))

function TestGrammar(grammar, input) {
    try {
        const i = new Parser(grammar() as any);
        return { result: i.run(input) };
    } catch (error) {
        return error.toString()
    }
}


function Read(path) {
    return readFileSync(path, 'utf-8');
}
function Write(path, body) {
    return writeFileSync(path, typeof body == 'string' ? body : JSON.stringify(body, null, 2), 'utf-8');
}