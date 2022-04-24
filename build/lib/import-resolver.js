"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemResolver = void 0;
var FileSystemResolver = (function () {
    function FileSystemResolver(baseDir) {
        var readFileSync = require('fs').readFileSync;
        var _a = require('path'), resolve = _a.resolve, dirname = _a.dirname;
        this.resolve = resolve;
        this.readFile = readFileSync;
        this.baseDir = baseDir ? dirname(baseDir) : process === null || process === void 0 ? void 0 : process.cwd();
    }
    FileSystemResolver.prototype.path = function (path) {
        return this.resolve(this.baseDir, path);
    };
    FileSystemResolver.prototype.body = function (path) {
        return this.readFile(path, 'utf-8');
    };
    return FileSystemResolver;
}());
exports.FileSystemResolver = FileSystemResolver;
//# sourceMappingURL=import-resolver.js.map