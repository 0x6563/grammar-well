let resolver;
if (typeof process && process?.release?.name?.search(/node|io\.js/) >= 0) {
    const { FileSystemResolver } = await import("./filesystem.js");
    resolver = FileSystemResolver;
}
else {
    const { BrowserImportResolver } = await import("./browser.js");
    resolver = BrowserImportResolver;
}
export const DefaultImportResolver = resolver;
//# sourceMappingURL=default.js.map