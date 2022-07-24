import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Compile, Parse, Parser } from "./src/";
import { Message } from "./src/utility/message";
const BaseDir = './src/grammars';
(async () => {
    const files = readdirSync(BaseDir);
    for (const file of files) {
        console.log(file)
        if (/\.ne$/.test(file)) {
            const json = await Compile(readFileSync(filename(file), 'utf-8'), { format: 'json' });
            const js = await Compile(readFileSync(filename(file), 'utf-8'), { exportName: 'grammar' });
            writeFileSync(filename(file.replace(/.ne$/, '.json')), json as any, 'utf8');
            writeFileSync(filename(file.replace(/.ne$/, '.js')), js as any, 'utf8');
        }
    }
    const n = new Parser(require('./src/grammars/json.js'), { algorithm: 'earley', parserOptions: { keepHistory: true } });
    n.parser.feed('{"":[],    "1":3 }');
    const { table, start } = (n.parser as any);
    console.log(`Results: ${n.parser.results.length}`);
    const stateMap = new Map();
    const ruleMap = new Map();
    const charts = [];
    let ruleId = 0;
    let stateId = 0;
    for (let i = 0; i < table.length; i++) {
        const chart = [];
        const { states, data } = table[i];
        console.log(`Chart ${i} ${data}`)
        charts.push({ data, states: chart });
        for (let ii = 0; ii < states.length; ii++) {
            const state = states[ii];
            const { rule, dot, reference, isComplete, left, wantedBy } = state;
            const { symbols, name } = rule;

            if (!ruleMap.has(rule)) {
                ruleMap.set(rule, ruleId++);
            }

            if (!stateMap.has(state)) {
                stateMap.set(state, stateId++);
            }

            chart.push(stateId);
            console.log(BuildString([
                ii.toString().padEnd(4, ' '),
                (name === start ? 'Start' : '').padEnd(7, ' '),
                (isComplete ? 'Complete' : '').padEnd(10, ' '),
                `dot: ${(dot.toString().padEnd(3, ' '))}`,
                `from: ${reference.toString().padEnd(4, ' ')}`,
                `id: ${stateId.toString().padEnd(4, ' ')}`,
                `left: ${(stateMap.get(left) || '').toString().padEnd(4, ' ')}`,
                `wantedBy: ${(wantedBy.map(v => stateMap.get(v)).join(', ')).toString().padEnd(12, ' ')}`,
                `${name}  →  ${SymbolString(symbols, dot)}`
            ]))
        }

    }
    const rules = [];
    const states = [];
    for (const [rule, id] of ruleMap) {
        const { symbols, name } = rule;
        rules[id] = {
            name,
            symbols: symbols.map(v => Message.GetSymbolDisplay(v, true))
        }
    }

    for (const [state, id] of stateMap) {
        const { rule, dot, reference, isComplete, left, wantedBy } = state;

        states[id] = {
            left: stateMap.get(left),
            wantedBy: wantedBy.map(v => stateMap.get(v)),
            reference,
            ruleId: ruleMap.get(rule),
            dot
        }
    }
    writeFileSync('test.json', JSON.stringify({ start, charts, states, rules }), 'utf-8');

})();

function BuildString(strings: string[]) {
    return strings.join('; ');
}

function SymbolString(symbols: any[], dot: number) {
    const r = symbols.map(v => Message.GetSymbolDisplay(v, true));
    r.splice(dot || 0, 0, ' ● ');
    return r.join(' ');
}
function filename(file: string) {
    return resolve(BaseDir, file)
}