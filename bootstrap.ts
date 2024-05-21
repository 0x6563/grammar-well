import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { MigrateV1toV2 } from './src/utility/migrate';
const BaseDir = './tests/samples/grammars/';
(async () => {
    const files = readdirSync(BaseDir);
    const registry = {};
    for (const file of files) {
        try {
            if (typeof file == 'string') {
                if (/\.gwell$/.test(file)) {
                    console.log(file);
                    const content = MigrateV1toV2(read(file));
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
