import { parse } from 'yaml';
import { Samples } from './samples.ts';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function ReadConfigFile(...filepaths: string[]) {
    const filepath = filepaths.length > 1 ? join(...filepaths) : filepaths[0];
    return parse(readFileSync(filepath, 'utf8'));
}

export function GetValue(test: UnitTest, prefix: TestPrefix) {
    if (test[prefix + 'Source' as keyof UnitTest]) {
        return Samples[test[prefix + 'Source' as keyof UnitTest]];
    }

    if (test[prefix + 'JSON' as keyof UnitTest])
        return JSON.parse(Samples[test[prefix + 'JSON' as keyof UnitTest]]);

    if (test[prefix + 'Regex' as keyof UnitTest])
        return new RegExp(test[prefix + 'Regex' as keyof UnitTest] as string);

    return test[prefix as keyof UnitTest];
}



interface UnitTest { 
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