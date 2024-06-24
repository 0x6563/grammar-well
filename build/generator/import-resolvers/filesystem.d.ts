import { ImportResolver } from "../../typings/index.js";
export declare class FileSystemResolver implements ImportResolver {
    private baseDir;
    constructor(baseDir: string);
    path(path: string): string;
    body(path: string): Promise<string>;
}
