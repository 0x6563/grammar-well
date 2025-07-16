import { readFileSync } from 'fs';
import assert from "node:assert";
import { join } from 'path';
import { Generate, Parse } from '../../build';
import { DictionaryResolver } from '../../build/generator/import-resolvers/dictionary';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
const grammarDir = './tests/samples/grammars';
const files = readdirSync(grammarDir);
// const grammars = new DictionaryResolver();
const dictionary = {};
for (const file of files) {
    if (typeof file == 'string') {
        dictionary[file] = read(grammarDir, file);
    }
}

export function Expected(actual: any, expected: any, message?: string) {
    if (expected instanceof RegExp) {
        return assert.match(actual, expected, message);
    } else if (typeof expected == 'object') {
        return assert.deepEqual(actual, expected, message);
    } else {
        return assert.equal(actual, expected, message);
    }
}

export async function AsyncRun(method) {
    let error;
    let result;
    let success = false;
    try {
        result = await method();
        success = true;
    } catch (err) {
        error = err;
    }
    return { error, result, success };
}

export function GetValue(test, prefix) {
    if (test[prefix + 'Source']) {
        return GetFile('../samples/' + test[prefix + 'Source']);
    }

    if (test[prefix + 'JSON'])
        return JSON.parse(GetFile('../samples/' + test[prefix + 'JSON']));

    if (test[prefix + 'Regex'])
        return new RegExp(test[prefix + 'Regex']);

    return test[prefix];
}

export function GetFile(path: string) {
    return readFileSync(join(import.meta.dirname, path), 'utf8')
}


export async function RunTest(source: string, input: string, options: any) {
    return Parse(await Build(source), input, options);
}

export async function GrammarWellRunner(source: string) {
    const compiled = Evalr(await Generate(source, { output: { name: 'grammar', format: 'commonjs' } }));
    return (input) => Parse(new compiled(), input, { algorithm: 'earley' }, 'full');
}

async function Build(source: string): Promise<any> {
    return new (Evalr(await Generate(source, { output: { name: 'grammar', format: 'commonjs' }, resolver: new DictionaryResolver(dictionary) })) as () => void);
}

function Evalr(source): any {
    const module = { exports: null };
    eval(source);
    return module.exports;
}



function read(dir: string, filename: string) {
    return readFileSync(fullpath(dir, filename), 'utf-8')
}


function fullpath(dir: string, file: string) {
    return resolve(dir, file)
} 