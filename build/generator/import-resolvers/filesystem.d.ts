import { ImportResolver } from "../../typings";
export declare class FileSystemResolver implements ImportResolver {
    private baseDir;
    constructor(baseDir: string);
    path(path: string): string;
    body(path: string): Promise<string>;
}
