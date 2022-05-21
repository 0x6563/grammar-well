import { parse } from 'yaml';
import { AsyncRun, BuildTest, Expected, GetFile, GetValue, GrammarWellRunner, NearleyRunner } from './testbed';

describe('Predefined Samples', () => {
    const groups = parse(GetFile('./predefined-samples.yml'));
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

describe('Compatibility Samples', () => {
    const groups = parse(GetFile('./compatibility-samples.yml'));
    for (const group in groups) {
        const tests = groups[group];
        describe(group, () => {
            for (const test of tests) {
                it(test.title, async () => {
                    const grammar = GetValue(test, 'grammar');
                    const input = GetValue(test, 'input');
                    const grammarWell = await AsyncRun(async () => (await GrammarWellRunner(grammar))(input));
                    const nearley = await AsyncRun(async () => (await NearleyRunner(grammar))(input));
                    Expected(grammarWell.success, nearley.success);
                    if (grammarWell.success && nearley.success) {
                        Expected(grammarWell.result, nearley.result);
                    }
                })
            }
        })
    }
})