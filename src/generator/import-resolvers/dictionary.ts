import { ImportResolver } from "../../typings";

export class DictionaryResolver implements ImportResolver {
    constructor(private files: { [key: string]: string }) { }

    path(path: string) {
        if (path in this.files)
            return path;
        throw new Error(`Unable to import "${path}"`)
    }

    async body(path: string) {
        return this.files[path];
    }
}