import { readFile } from 'fs/promises';
import { dirname, resolve } from 'path';
export class FileSystemResolver {
    baseDir;
    constructor(baseDir) {
        this.baseDir = baseDir ? dirname(baseDir) : process?.cwd();
    }
    path(path) {
        return resolve(this.baseDir, path);
    }
    body(path) {
        return readFile(path, 'utf-8');
    }
}
//# sourceMappingURL=filesystem.js.map