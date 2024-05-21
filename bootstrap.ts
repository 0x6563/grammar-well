import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Generate, Parser } from "./src";
import { V2GrammarString } from './src/generator/stringify/grammar/v2';
import Language from './src/generator/grammars/v2';
const BaseDir = './src/generator/builtin/';
const parser = new Parser(Language() as any);
(async () => {
    const files = readdirSync(BaseDir);
    const registry = {};
    for (const file of files) {
        try {
            if (typeof file == 'string') {
                if (/\.well$/.test(file)) {
                    console.log(file);
                    const content = format(read(file));
                    const name = file.split('.')[0] as string;
                    registry[name] = content;
                    write(file, content);
                }
            }
        } catch (error) {
            console.log(file);
            console.log(error);
            throw error;
        }
    }
    write(`./registry.json`, JSON.stringify(registry));
    write('../grammars/v2.well', format(read('../grammars/v2.well')));
    await Transpile('../grammars/v2.well');
})();

async function Transpile(path) {
    const content = read(path);
    const js = await Generate(content, { exportName: 'grammar', template: 'esmodule', overrides: {} });
    write(path.replace(/\.well$/, '.js'), js);
}

function read(filename) {
    return readFileSync(fullpath(filename), 'utf-8')
}

function write(filename, body) {
    return writeFileSync(fullpath(filename), body, 'utf8');
}

function fullpath(file: string) {
    return resolve(BaseDir, file)
}

function format(content: string) {
    const stringer = new V2GrammarString();
    stringer.append(parser.run(content).results[0]);
    return stringer.source;
}