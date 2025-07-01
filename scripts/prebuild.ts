import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Format, Generate } from "../src/index.js";
import { version } from "../package.json";

const BaseDir = './src/';
console.log('Prebuild Start');
write('./version.json', JSON.stringify({ version }));
await TranspileTypescript('./generator/grammars/v1.well');
await TranspileTypescript('./generator/grammars/v2.well');
const BuiltInDir = './generator/builtin/';
const files = readdirSync(fullpath(BuiltInDir));
const registry = {};
for (const file of files) {
    try {
        if (typeof file == 'string') {
            if (/\.well$/.test(file)) {
                console.log(file);
                const content = Format(read(BuiltInDir + file));
                const name = file.split('.')[0] as string;
                registry[name] = content;
                write(BuiltInDir + file, content);
            }
        }
    } catch (error) {
        console.log(file);
        console.log(error);
        throw error;
    }
}
write(`./generator/builtin/registry.json`, JSON.stringify(registry));
write('./generator/grammars/v2.well', Format(read('./generator/grammars/v2.well')));
write('./generator/grammars/v1.well', Format(read('./generator/grammars/v1.well')));
console.log('Prebuild End');

async function TranspileTypescript(path) {
    console.log('Transpiling ' + path);
    const source = read(path);
    const js = await Generate(source, {
        output: {
            name: 'grammar',
            format: 'typescript',
            artifacts: {
                lexer: true,
                grammar: true
            }
        }
    });
    write(path.replace(/\.well$/, '.ts'), js);
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