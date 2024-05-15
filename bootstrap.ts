import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Generate } from "./src";
const BaseDir = './src/generator/builtin/';

(async () => {
    const files = readdirSync(BaseDir);
    const registry = {};
    for (const file of files) {
        try {
            if (typeof file == 'string') {
                if (/\.gwell$/.test(file)) {
                    console.log(file);
                    const content = read(file);
                    const name = file.split('.')[0] as string;
                    registry[name] = content;
                }
            }
        } catch (error) {
            console.log(file);
            console.log(error);
            throw error;
        }
    }
    write(`./registry.json`, JSON.stringify(registry));
    await Transpile('../gwell.gwell');
})();

async function Transpile(path) {
    const content = read(path);
    const js = await Generate(content, { exportName: 'grammar', template: 'esmodule', overrides: {} });
    write(path.replace(/\.gwell$/, '.js'), js);
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