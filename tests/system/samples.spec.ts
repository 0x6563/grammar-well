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
                it(test.title, () => {
                    const grammar = GetValue(test, 'grammar');
                    const input = GetValue(test, 'input');
                    const result = GetValue(test, 'result');
                    const error = GetValue(test, 'error');
                    if (typeof test.throw == 'boolean') {
                        if (test.throw) {
                            expect(() => BuildTest(grammar, input)).to.throw();
                        } else {
                            expect(() => BuildTest(grammar, input)).not.to.throw();
                        }
                    } else if (error) {
                        expect(() => BuildTest(grammar, input)).throws(error);
                    } else if (typeof result == 'object') {
                        expect(BuildTest(grammar, input)).deep.equals(result);
                    } else {
                        expect(BuildTest(grammar, input)).equals(result);
                    }
                })
            }
        })
    }
})

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

function Build(grammar) {
    const compiled = Compile(grammar, { exportName: 'grammar' }) as string;
    const module = { exports: null };
    eval(compiled)
    return module.exports;
}

function BuildTest(grammar, input) {
    return Interpret(Build(grammar), input);
} 
