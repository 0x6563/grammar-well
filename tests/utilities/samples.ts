import { readFileSync } from 'fs';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { PseudoRandomJSONGenerator } from './prjg.ts';
const dir = resolve(import.meta.dirname, '../samples');
const files = readdirSync(dir, { recursive: true, withFileTypes: true });
const dictionary: { [key: string]: string } = {};

const filtered: { [key: string]: string } = {};
const baseGrammarDir = 'grammars/';
for (const file of files) {
    if (file.isFile()) {
        const fullPath = resolve(file.parentPath, file.name);
        const key = fullPath.substring(dir.length + 1).replace(/\\/, '/');
        dictionary[key] = readFileSync(fullPath, 'utf-8');
        if (key.startsWith(baseGrammarDir)) {
            filtered[key.slice(baseGrammarDir.length)] = dictionary[key];
        }
    }
}
dictionary['mem:\\\\1k.json'] = new PseudoRandomJSONGenerator(787253, 1000).generate();
dictionary['mem:\\\\10k.json'] = new PseudoRandomJSONGenerator(893241, 10000).generate();
dictionary['mem:\\\\50k.json'] = new PseudoRandomJSONGenerator(53897, 50000).generate();
dictionary['mem:\\\\100k.json'] = new PseudoRandomJSONGenerator(812240, 100000).generate();
export const Samples = dictionary;
export const Grammars = filtered;