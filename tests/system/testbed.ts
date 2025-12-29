import { readFileSync } from 'fs';
import assert from "node:assert";
import { join } from 'path';
import { Generate, Parse, RuntimeParserClass } from '../../build';
import { DictionaryResolver } from '../../build/generator/import-resolvers/dictionary';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
const grammarDir = './tests/samples/grammars';
const files = readdirSync(grammarDir);
// const grammars = new DictionaryResolver();
const dictionary: { [key: string]: string } = {};
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

export async function AsyncRun(method: () => Promise<any>) {
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

export function GetValue(test: UnitTest, prefix: TestPrefix) {
    if (test[prefix + 'Source' as keyof UnitTest]) {
        return GetFile('../samples/' + test[prefix + 'Source' as keyof UnitTest]);
    }

    if (test[prefix + 'JSON' as keyof UnitTest])
        return JSON.parse(GetFile('../samples/' + test[prefix + 'JSON' as keyof UnitTest]));

    if (test[prefix + 'Regex' as keyof UnitTest])
        return new RegExp(test[prefix + 'Regex' as keyof UnitTest] as string);

    return test[prefix as keyof UnitTest];
}

export function GetFile(path: string) {
    return readFileSync(join(import.meta.dirname, path), 'utf8')
}


export async function RunTest(source: string, input: string, options: any, results: 'first' | 'full' = 'first') {
    return Parse(await Build(source), input, options, results);
}

export async function GrammarWellRunner(source: string) {
    const compiled = Evalr(await Generate(source, { output: { name: 'grammar', format: 'commonjs' } }) as string);
    return (input: string) => Parse(new compiled(), input, { algorithm: 'earley' }, 'full');
}

async function Build(source: any): Promise<any> {
    return new (Evalr(
        await Generate(source, {
            output: {
                name: 'grammar',
                format: 'commonjs'
            },
            resolver: new DictionaryResolver(dictionary)
        }) as string
    )
    );
}

function Evalr(source: string): any {
    const module = { exports: null };
    eval(source);
    return module.exports as unknown as RuntimeParserClass;
}



function read(dir: string, filename: string) {
    return readFileSync(fullpath(dir, filename), 'utf-8')
}


function fullpath(dir: string, file: string) {
    return resolve(dir, file)
}

interface UnitTest {
    title: string;
    throw?: boolean;

    algorithm?: string;
    algorithmSource?: string;

    input?: any;
    inputSource?: string;

    grammar?: any;
    grammarSource?: string;
    grammarJSON?: string;

    result?: any;
    resultSource?: string;
    resultJSON?: string;
    resultRegex?: string;

    results?: any;
    resultsSource?: string;
    resultsJSON?: string;
    resultsRegex?: string;

    error?: any;
    errorSource?: string;
    errorJSON?: string;
    errorRegex?: string;
}

type TestPrefix = "algorithm" | "input" | "error" | "grammar" | "result" | "results";
type TestSuffix = "Source" | "JSON" | "Regex";