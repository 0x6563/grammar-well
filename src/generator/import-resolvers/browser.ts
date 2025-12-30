import type { ImportResolver } from "../../typings/index.ts";

export class BrowserImportResolver implements ImportResolver {
    private baseURL: string;
    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    path(path: string) {
        return (new URL(path, this.baseURL)).href;
    }

    async body(path: string) {
        return (await fetch(path)).text();
    }
}
