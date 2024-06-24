import { ImportResolverConstructor } from "../../typings/index.js";

let resolver;
declare const window;
if (typeof window === 'undefined') {
    const { BrowserImportResolver } = await import("./browser.js");
    resolver = BrowserImportResolver;
} else {
    const { FileSystemResolver } = await import("./filesystem.js");
    resolver = FileSystemResolver;
}

export const DefaultImportResolver = resolver as ImportResolverConstructor;