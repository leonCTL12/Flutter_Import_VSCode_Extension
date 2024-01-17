"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderImportPathFixer = void 0;
const import_path_fixer_1 = require("./import_path_fixer");
class FolderImportPathFixer extends import_path_fixer_1.ImportPathFixer {
    executeImportFixes() {
        console.log("Folder ------------------");
        console.log("About to replace import path\n source:" + this.sourcePath + "\n destination: " + this.destinationPath);
        console.log("--------------------");
    }
}
exports.FolderImportPathFixer = FolderImportPathFixer;
//# sourceMappingURL=folder_import_path_fixer.js.map