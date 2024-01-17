"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileImportPathFixer = void 0;
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
const vscode = __importStar(require("vscode"));
const import_path_fixer_1 = require("./import_path_fixer");
class FileImportPathFixer extends import_path_fixer_1.ImportPathFixer {
    async executeImportFixes() {
        console.log("File ------------------");
        console.log("About to replace import path\n source:" + this.sourcePath + "\n destination: " + this.destinationPath);
        console.log("--------------------");
        let dartFiles = await this.findAllDartFiles();
        dartFiles.forEach((filePath) => {
            this.replaceImportPathInFile(filePath);
        });
    }
    async findAllDartFiles() {
        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showInformationMessage("Open a workspace first");
            return [];
        }
        const pattern = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], 'lib/**/*.dart');
        // Find the files that match the pattern
        const dartFiles = await vscode.workspace.findFiles(pattern, null, Number.MAX_SAFE_INTEGER);
        // Map the Uri objects to their fsPath properties
        const filePaths = dartFiles.map(file => file.fsPath);
        return filePaths;
    }
    replaceImportPathInFile(filePath) {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        let newFileContent = '';
        rl.on('line', (line) => {
            if (this.isImportStatement(line)) {
                // Replace 'import' with 'export'
                line = line.replace(this.sourcePath, this.destinationPath);
            }
            newFileContent += line + '\n';
        });
        rl.on('close', () => {
            fs.writeFileSync(filePath, newFileContent);
        });
    }
    isImportStatement(line) {
        return line.trim().startsWith("import");
    }
}
exports.FileImportPathFixer = FileImportPathFixer;
//# sourceMappingURL=file_import_path_fixer.js.map