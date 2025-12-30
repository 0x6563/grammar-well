import type { ImportResolver } from "../../typings/index.ts";
export declare class BrowserImportResolver implements ImportResolver {
    private baseURL;
    constructor(baseURL: string);
    path(path: string): string;
    body(path: string): Promise<string>;
}
