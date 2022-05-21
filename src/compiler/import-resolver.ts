/// <reference types="typescript/lib/lib.webworker" />


export class FileSystemResolver implements ImportResolver {
    private baseDir: string;
    private readFile: (path: string, type: string) => Promise<string>;
    private resolve: (path: string, ...paths: string[]) => string;

    constructor(baseDir: string) {
        const { readFile } = require('fs');
        const { resolve, dirname } = require('path');
        const { promisify } = require('util');
        this.readFile = promisify(readFile);
        this.resolve = resolve;
        this.baseDir = baseDir ? dirname(baseDir) : process?.cwd();
    }

    path(path: string) {
        return this.resolve(this.baseDir, path);
    }

    body(path: string) {
        return this.readFile(path, 'utf-8');
    }
}

export class BrowserImportResolver implements ImportResolver {
    constructor(private baseURL: string) { }

    path(path: string) {
        return (new URL(path, this.baseURL)).href;
    }

    async body(path: string) {
        return (await fetch(path)).text();
    }
}

export interface ImportResolver {
    path(path: string): string;
    body(path: string): Promise<string>;
}


export interface ImportResolverConstructor {
    new(basePath: string): ImportResolver;
}