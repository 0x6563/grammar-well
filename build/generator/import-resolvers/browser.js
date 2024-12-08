export class BrowserImportResolver {
    baseURL;
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    path(path) {
        return (new URL(path, this.baseURL)).href;
    }
    async body(path) {
        return (await fetch(path)).text();
    }
}
//# sourceMappingURL=browser.js.map