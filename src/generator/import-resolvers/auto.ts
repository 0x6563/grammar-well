import type { ImportResolverConstructor } from "../../typings/index.ts";
let resolver;

if (typeof process && process?.release?.name?.search(/node|io\.js/) >= 0) {
    const { FileSystemResolver } = await import("./filesystem.ts");
    resolver = FileSystemResolver;
} else {
    const { BrowserImportResolver } = await import("./browser.ts");
    resolver = BrowserImportResolver;
}

export const AutoImportResolver = resolver as ImportResolverConstructor;