import test, { describe } from "node:test";
import assert from "node:assert";
import { Candidate } from "../utilities/language.ts";
import { Eval } from "../utilities/eval.ts";
import { GetValue, ReadConfigFile } from "../utilities/config.ts";
import { type RuntimeParserClass } from "../../build/index.js";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";


describe('Predefined Samples', () => {
    const groups = ReadConfigFile(import.meta.dirname, './system.config.yml');
    for (const group in groups) {
        const tests = groups[group];
        describe(group, () => {
            for (const t of tests) {
                test(t.title, async () => {
                    const options: any = {};
                    const grammar = GetValue(t, 'grammar');
                    const input = GetValue(t, 'input');
                    const result = GetValue(t, 'result');
                    const results = GetValue(t, 'results');
                    const error = GetValue(t, 'error');
                    options.algorithm = GetValue(t, 'algorithm') || 'earley';
                    const resultType = !result && results ? 'full' : 'first';
                    const execution = await AsyncRun(() => RunTest(grammar, input, options, resultType));
                    if (t.save) {
                        writeFileSync(resolve(import.meta.dirname, '../dumps/' + t.save), JSON.stringify({
                            grammar,
                            input,
                            result,
                            results,
                            execution
                        }))
                    }
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
                            if (resultType == 'full') {
                                Expected(execution.result.results, results);
                            } else {
                                Expected(execution.result, result);
                            }
                            Expected(execution.success, true, 'Expected to not throw error.');
                        }
                    } catch (error) {
                        console.log(error)
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


async function AsyncRun(method: () => Promise<any>) {
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

async function RunTest(source: string, input: string, options: any, results: 'first' | 'full' = 'first') {
    const c = await Candidate.Compile(source);
    const parser: RuntimeParserClass = Eval(c);
    return Candidate.Parse(new parser(), input, options, results);
}


function Expected(actual: any, expected: any, message?: string) {
    if (expected instanceof RegExp) {
        return assert.match(actual, expected, message);
    } else if (typeof expected == 'object') {
        return assert.deepEqual(actual, expected, message);
    } else {
        return assert.equal(actual, expected, message);
    }
}