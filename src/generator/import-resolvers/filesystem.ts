/// <reference types="typescript/lib/lib.webworker" />
import { readFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { ImportResolver } from "../../typings";

export class FileSystemResolver implements ImportResolver {
    private baseDir: string;
    constructor(baseDir: string) {
        this.baseDir = baseDir ? dirname(baseDir) : process?.cwd();
    }

    path(path: string) {
        return resolve(this.baseDir, path);
    }

    body(path: string) {
        return readFile(path, 'utf-8');
    }
}