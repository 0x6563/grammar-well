import { type ImportResolver } from "../../typings/index.ts";
export declare class DictionaryResolver implements ImportResolver {
    private files;
    constructor(files: {
        [key: string]: string;
    });
    path(path: string): string;
    body(path: string): Promise<string>;
}
