import { ImportResolver } from "../../typings";

export class BrowserImportResolver implements ImportResolver {
    constructor(private baseURL: string) { }

    path(path: string) {
        return (new URL(path, this.baseURL)).href;
    }

    async body(path: string) {
        return (await fetch(path)).text();
    }
}
