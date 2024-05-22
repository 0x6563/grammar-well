import { ImportResolver } from "../../typings";
export declare class BrowserImportResolver implements ImportResolver {
    private baseURL;
    constructor(baseURL: string);
    path(path: string): string;
    body(path: string): Promise<string>;
}
