
import { readFileSync } from 'fs';
import { join } from 'path';
import { Compile, Parser } from '../../build';

export function GetFile(path) {
    return readFileSync(join(__dirname, path), 'utf8')
}

export function GetValue(test, prefix) {

    if (test[prefix + 'Source']) {
        return GetFile('../samples/' + test[prefix + 'Source']);
    }

    if (test[prefix + 'JSON']) {
        return JSON.parse(GetFile('../samples/' + test[prefix + 'JSON']));
    }

    return test[prefix];
}


export async function GrammarWellRunner(source) {
    const compiled = await Compile(source, { exportName: 'grammar' });
    const interpreter = new Parser(Evalr(compiled)(), { algorithm: 'earley' });
    return (input) => interpreter.run(input);
}

function Evalr(source) {
    const module = { exports: null };
    eval(source)
    return module.exports;
}