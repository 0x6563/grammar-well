"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserImportResolver = exports.FileSystemResolver = void 0;
class FileSystemResolver {
    constructor(baseDir) {
        const { readFile } = require('fs');
        const { resolve, dirname } = require('path');
        const { promisify } = require('util');
        this.readFile = promisify(readFile);
        this.resolve = resolve;
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
class BrowserImportResolver {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    path(path) {
        return (new URL(path, this.baseURL)).href;
    }
    body(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield fetch(path)).text();
        });
    }
}
exports.BrowserImportResolver = BrowserImportResolver;
//# sourceMappingURL=import-resolver.js.map