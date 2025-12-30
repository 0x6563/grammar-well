import { readFileSync } from 'fs';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
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
export const Samples = dictionary;
export const Grammars = filtered;