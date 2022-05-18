import { expect } from "chai";
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';
import { Compile, Interpret } from '../../src';

describe('Parse Samples', () => {
    const groups = parse(GetFile('./samples.yml'));
    for (const group in groups) {
        const tests = groups[group];
        describe(group, () => {
            for (const test of tests) {
                it(test.title, async () => {
                    const grammar = GetValue(test, 'grammar');
                    const input = GetValue(test, 'input');
                    const result = GetValue(test, 'result');
                    const error = GetValue(test, 'error');
                    const execution = await AsyncRun(() => BuildTest(grammar, input));
                    if (typeof test.throw == 'boolean') {
                        Expected(execution.success, !test.throw, `Expected to ${test.throw ? '' : 'not '}throw.`);
                    } else if (error) {
                        Expected(execution.error, error);
                        Expected(execution.success, false, 'Expected to throw error.');
                    } else {
                        Expected(execution.result, result);
                        Expected(execution.success, true, 'Expected to not throw error.');
                    }
                })
            }
        })
    }
})

function Expected(actual: any, expected: any, message?: string) {
    if (expected instanceof RegExp) {
        expect(actual).matches(expected, message);
    } else if (typeof expected == 'object') {
        expect(actual).deep.equals(expected, message);
    } else {
        expect(actual).equals(expected, message);
    }
}

async function AsyncRun(method) {
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

function GetValue(test, prefix) {
    if (test[prefix + 'Source']) {
        return GetFile('../samples/' + test[prefix + 'Source']);
    }

    if (test[prefix + 'JSON'])
        return JSON.parse(GetFile('../samples/' + test[prefix + 'JSON']));

    if (test[prefix + 'Regex'])
        return new RegExp(test[prefix + 'Regex']);

    return test[prefix];
}

function GetFile(path: string) {
    return readFileSync(join(__dirname, path), 'utf8')
}

async function Build(grammar) {
    const compiled = await Compile(grammar, { exportName: 'grammar' }) as string;
    const module = { exports: null };
    eval(compiled)
    return module.exports;
}

async function BuildTest(grammar, input) {
    return Interpret(await Build(grammar), input);
} 
