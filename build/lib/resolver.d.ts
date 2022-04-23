export declare class FileSystemResolver implements ImportResolver {
    private baseDir;
    private readFile;
    private resolve;
    constructor(baseDir: string);
    path(path: string): string;
    body(path: string): string;
}
export interface ImportResolver {
    path(path: string): string;
    body(path: string): string;
}
export interface ImportResolverConstructor {
    new (baseDir: string): ImportResolver;
}
