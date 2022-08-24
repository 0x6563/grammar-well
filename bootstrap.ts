import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Compile } from "./src";
const BaseDir = './src/grammars';

(async () => {
    const files = readdirSync(BaseDir);
    for (const file of files) {
        console.log(fullpath(file))
        if (/\.ne$/.test(file)) {
            const json = await Compile(read(file), { format: 'json' });
            const js = await Compile(read(file), { exportName: 'grammar', format: 'esmodule' });
            write(file.replace(/.ne$/, '.json'), json);
            write(file.replace(/.ne$/, '.js'), js);
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