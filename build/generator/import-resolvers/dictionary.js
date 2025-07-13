export class DictionaryResolver {
    files;
    constructor(files) {
        this.files = files;
    }
    path(path) {
        if (path in this.files)
            return path;
        throw new Error(`Unable to import "${path}"`);
    }
    async body(path) {
        return this.files[path];
    }
}
//# sourceMappingURL=dictionary.js.map