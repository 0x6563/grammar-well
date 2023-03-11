import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Compile } from "./src";
const BaseDir = './src/grammars';

(async () => {
    const files = readdirSync(BaseDir);
    for (const file of files) {
        try {
            console.log(fullpath(file))
            if (/\.gwell$/.test(file)) {
                const json = await Compile(read(file), { template: 'json' });
                const js = await Compile(read(file), { exportName: 'grammar', template: 'esmodule' });
                write(file.replace(/.gwell$/, '.json'), json);
                write(file.replace(/.gwell$/, '.js'), js);
            }
        } catch (error) {
            console.log(file);
            console.log(error);
            throw error;
        }
    }
})();

function read(filename) {
    return readFileSync(fullpath(filename), 'utf-8')
}

function write(filename, body) {
    return writeFileSync(fullpath(filename), body, 'utf8');
}

function fullpath(file: string) {
    return resolve(BaseDir, file)
}