"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserImportResolver = exports.FileSystemResolver = void 0;
class FileSystemResolver {
    baseDir;
    readFile;
    resolve;
    constructor(baseDir) {
        const { readFile } = require('fs');
        const { resolve, dirname } = require('path');
        const { promisify } = require('util');
        this.readFile = promisify(readFile);
        this.resolve = resolve;
        this.baseDir = baseDir ? dirname(baseDir) : process?.cwd();
    }
    path(path) {
        return this.resolve(this.baseDir, path);
    }
    body(path) {
        return this.readFile(path, 'utf-8');
    }
}
exports.FileSystemResolver = FileSystemResolver;
class BrowserImportResolver {
    baseURL;
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    path(path) {
        return (new URL(path, this.baseURL)).href;
    }
    async body(path) {
        return (await fetch(path)).text();
    }
}
exports.BrowserImportResolver = BrowserImportResolver;
//# sourceMappingURL=import-resolver.js.map