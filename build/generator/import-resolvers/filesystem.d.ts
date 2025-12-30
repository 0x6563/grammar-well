import type { ImportResolver } from "../../typings/index.ts";
export declare class FileSystemResolver implements ImportResolver {
    private baseDir;
    constructor(baseDir: string);
    path(path: string): string;
    body(path: string): Promise<string>;
}
