import { ImportResolverConstructor } from "../../typings";

let resolver;
declare const window;
if (typeof window === 'undefined') {
    const { BrowserImportResolver } = await import("./browser");
    resolver = BrowserImportResolver;
} else {
    const { FileSystemResolver } = await import("./filesystem");
    resolver = FileSystemResolver;
}

export const DefaultImportResolver = resolver as ImportResolverConstructor;