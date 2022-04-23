export class FileSystemResolver implements ImportResolver {
    private baseDir: string;
    private readFile: (path: string, type: string) => string;
    private resolve: (path: string, ...paths: string[]) => string;

    constructor(baseDir: string) {
        const { readFileSync } = require('fs');
        const { resolve, dirname } = require('path');
        const { promisify } = require('util');
        this.resolve = resolve;
        // this.readFile = promisify(readFile);
        this.readFile = readFileSync;
        this.baseDir = baseDir ? dirname(baseDir) : process?.cwd();
    }

    path(path: string) {
        return this.resolve(this.baseDir, path);
    }

    body(path: string) {
        return this.readFile(path, 'utf-8');
    }
}


export interface ImportResolver {
    path(path: string): string;
    body(path: string): string;
}


export interface ImportResolverConstructor {
    new(baseDir: string): ImportResolver;
}