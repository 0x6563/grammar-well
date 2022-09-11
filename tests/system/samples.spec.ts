import { parse } from 'yaml';
import { AsyncRun, BuildTest, Expected, GetFile, GetValue } from './testbed';

describe('Predefined Samples', () => {
    const groups = parse(GetFile('./predefined-samples.yml'));
    for (const group in groups) {
        const tests = groups[group];
        describe(group, () => {
            for (const test of tests) {
                it(test.title, async () => {
                    const options: any = {};
                    const grammar = GetValue(test, 'grammar');
                    const input = GetValue(test, 'input');
                    const result = GetValue(test, 'result');
                    const error = GetValue(test, 'error');
                    options.algorithm = GetValue(test, 'algorithm') || 'earley';
                    const execution = await AsyncRun(() => BuildTest(grammar, input, options));
                    try {
                        if (typeof test.throw == 'boolean') {
                            Expected(execution.success, !test.throw, `Expected to ${test.throw ? '' : 'not '}throw.`);
                        } else if (error) {
                            Expected(execution.error, error);
                            Expected(execution.success, false, 'Expected to throw error.');
                        } else {
                            Expected(execution.result, result);
                            Expected(execution.success, true, 'Expected to not throw error.');
                        }
                    } catch (error) {
                        if (execution.error) {
                            console.error(execution.error);
                        }
                        throw error;
                    }
                })
            }
        })
    }
}) 