let resolver;
if (typeof window === 'undefined') {
    const { BrowserImportResolver } = await import("./browser.js");
    resolver = BrowserImportResolver;
}
else {
    const { FileSystemResolver } = await import("./filesystem.js");
    resolver = FileSystemResolver;
}
export const DefaultImportResolver = resolver;
//# sourceMappingURL=default.js.map