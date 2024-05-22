let resolver;
if (typeof window === 'undefined') {
    const { BrowserImportResolver } = await import("./browser");
    resolver = BrowserImportResolver;
}
else {
    const { FileSystemResolver } = await import("./filesystem");
    resolver = FileSystemResolver;
}
export const DefaultImportResolver = resolver;
//# sourceMappingURL=default.js.map