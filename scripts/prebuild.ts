import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Format, Generate } from "../src";
const BaseDir = './src/generator/builtin/';
(async () => {
    const files = readdirSync(BaseDir);
    const registry = {};
    for (const file of files) {
        try {
            if (typeof file == 'string') {
                if (/\.well$/.test(file)) {
                    console.log(file);
                    const content = Format(read(file));
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
    write('../grammars/v2.well', Format(read('../grammars/v2.well')));
    write('../grammars/v1.well', Format(read('../grammars/v1.well')));
    await Transpile('../grammars/v1.well');
    await Transpile('../grammars/v2.well');
})();

async function Transpile(path) {
    const source = read(path);
    const js = await Generate(source, { exportName: 'grammar', template: 'esmodule', overrides: {} });
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