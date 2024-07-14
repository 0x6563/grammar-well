import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Generate } from "../src/index.js";
const BaseDir = './src/generator/builtin/';
(async () => {
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