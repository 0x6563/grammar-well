import { type ImportResolver } from "../../typings/index.ts";

export class DictionaryResolver implements ImportResolver {
    private files: { [key: string]: string }
    constructor(files: { [key: string]: string }) {
        this.files = files;
    }

    path(path: string) {
        if (path in this.files)
            return path;
        throw new Error(`Unable to import "${path}"`)
    }

    async body(path: string) {
        return this.files[path];
    }
}