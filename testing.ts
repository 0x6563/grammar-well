import { readFileSync, writeFileSync } from 'fs';
import { AsyncRun, BuildTest } from './tests/system/testbed';
(async () => {
    const options: any = {};
    const grammar = Read('./tests/samples/grammars/lr.gwell');
    const input = "{}{}{}}";
    options.algorithm = 'lr0';
    const execution = await AsyncRun(() => BuildTest(grammar, input, options));
    console.log(execution);

})()

function Read(path) {
    return readFileSync(path, 'utf-8');
}
function Write(path, body) {
    return writeFileSync(path, typeof body == 'string' ? body : JSON.stringify(body, null, 2), 'utf-8');
}