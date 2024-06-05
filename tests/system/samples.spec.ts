import test, { describe } from "node:test";
import { parse } from 'yaml';
import { AsyncRun, RunTest, Expected, GetFile, GetValue } from './testbed';


describe('Predefined Samples', () => {
    const groups = parse(GetFile('./predefined-samples.yml'));

    for (const group in groups) {
        const tests = groups[group];
        describe(group, () => {
            for (const t of tests) {
                test(t.title, async () => {
                    const options: any = {};
                    const grammar = GetValue(t, 'grammar');
                    const input = GetValue(t, 'input');
                    const result = GetValue(t, 'result');
                    const error = GetValue(t, 'error');
                    options.algorithm = GetValue(t, 'algorithm') || 'earley';
                    const execution = await AsyncRun(() => RunTest(grammar, input, options));
                    try {
                        if (typeof t.throw == 'boolean') {
                            if (execution.success == t.throw) {
                                // console.log(execution.error);
                                // console.log(input)
                            }
                            Expected(execution.success, !t.throw, `Expected to ${t.throw ? '' : 'not '}throw.`);
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