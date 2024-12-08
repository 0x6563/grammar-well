import { ImportResolverConstructor } from "../../typings/index.js";
let resolver;

if (typeof process && process?.release?.name?.search(/node|io\.js/) >= 0) {
    const { FileSystemResolver } = await import("./filesystem.js");
    resolver = FileSystemResolver;
} else {
    const { BrowserImportResolver } = await import("./browser.js");
    resolver = BrowserImportResolver;
}

export const AutoImportResolver = resolver as ImportResolverConstructor;