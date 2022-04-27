"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemResolver = void 0;
class FileSystemResolver {
    constructor(baseDir) {
        const { readFileSync } = require('fs');
        const { resolve, dirname } = require('path');
        this.resolve = resolve;
        this.readFile = readFileSync;
        this.baseDir = baseDir ? dirname(baseDir) : process === null || process === void 0 ? void 0 : process.cwd();
    }
    path(path) {
        return this.resolve(this.baseDir, path);
    }
    body(path) {
        return this.readFile(path, 'utf-8');
    }
}
exports.FileSystemResolver = FileSystemResolver;
//# sourceMappingURL=import-resolver.js.map