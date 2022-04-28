import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Compile } from "./src/lib/compile";
const BaseDir = './src/grammars'
const files = readdirSync(BaseDir);
for (const file of files) {
    console.log(file)
    if (/\.ne$/.test(file)) {
        const json = Compile(readFileSync(filename(file), 'utf-8'), { format: 'json' });
        const js = Compile(readFileSync(filename(file), 'utf-8'), { exportName: 'grammar' });
        writeFileSync(filename(file.replace(/.ne$/, '.json')), json as any, 'utf8');
        writeFileSync(filename(file.replace(/.ne$/, '.js')), js as any, 'utf8');
    }
}

function filename(file: string) {
    return resolve(BaseDir, file)
}