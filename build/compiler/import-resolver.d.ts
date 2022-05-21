export declare class FileSystemResolver implements ImportResolver {
    private baseDir;
    private readFile;
    private resolve;
    constructor(baseDir: string);
    path(path: string): string;
    body(path: string): Promise<string>;
}
export declare class BrowserImportResolver implements ImportResolver {
    private baseURL;
    constructor(baseURL: string);
    path(path: string): string;
    body(path: string): Promise<string>;
}
export interface ImportResolver {
    path(path: string): string;
    body(path: string): Promise<string>;
}
export interface ImportResolverConstructor {
    new (basePath: string): ImportResolver;
}
