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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const import_path_fixer_1 = require("./import_path_fixer");
let fixerDictionary = {};
var FileType;
(function (FileType) {
    FileType[FileType["Source"] = 0] = "Source";
    FileType[FileType["Destination"] = 1] = "Destination";
})(FileType || (FileType = {}));
function activate(context) {
    console.log('Congratulations, your extension "flutter-import-fixer" is now active!');
    let disposable = vscode.commands.registerCommand('flutter-import-fixer.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Flutter Import Fixer!');
    });
    context.subscriptions.push(disposable);
    let file_watcher = vscode.workspace.createFileSystemWatcher("**/*");
    file_watcher.onDidCreate((e) => {
        // console.log(`File created at ${e.fsPath}`);
        if (fs_1.default.statSync(e.fsPath).isDirectory()) {
            recursiveTriggerOnFileChange(e.fsPath, FileType.Destination);
        }
        else {
            onFilePathChange(e.fsPath, FileType.Destination);
        }
    });
    file_watcher.onDidDelete((e) => {
        // console.log(`File deleted at ${e.fsPath}`);
        if (fs_1.default.statSync(e.fsPath).isDirectory()) {
            recursiveTriggerOnFileChange(e.fsPath, FileType.Source);
        }
        else {
            onFilePathChange(e.fsPath, FileType.Source);
        }
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(file_watcher);
    context.subscriptions.push(file_deleteWatcher);
}
exports.activate = activate;
function recursiveTriggerOnFileChange(folderPath, fileType) {
    fs_1.default.readdirSync(folderPath).forEach(file => {
        const absolutePath = path.join(folderPath, file);
        if (fs_1.default.statSync(absolutePath).isDirectory()) {
            recursiveTriggerOnFileChange(absolutePath, fileType);
        }
        else {
            onFilePathChange(absolutePath, fileType); // or FileType.Destination based on your logic
        }
    });
}
function onFilePathChange(filePath, fileType) {
    if (!isDartFile(filePath)) {
        return;
    }
    console.log(`File path changed at ${filePath}`);
    let fileName = getFileName(filePath);
    let fixer = getOrCreateImportPathFixer(fileName);
    let subPath = getSubPathAfterLib(filePath);
    if (fileType === FileType.Source) {
        fixer.setSourcePath(subPath);
    }
    else if (fileType === FileType.Destination) {
        fixer.setDestinationPath(subPath);
    }
    if (fixer.shouldExecute()) {
        fixer.executeImportFixes();
        delete fixerDictionary[fileName];
    }
}
//#region dictionary functions
function getOrCreateImportPathFixer(fileName) {
    if (fixerDictionary[fileName]) {
        return fixerDictionary[fileName];
    }
    else {
        fixerDictionary[fileName] = new import_path_fixer_1.ImportPathFixer(fileName);
        return fixerDictionary[fileName];
    }
}
//#endregion
//#region File path functions
function isDartFile(path) {
    return path.endsWith('.dart');
}
function getSubPathAfterLib(filePath) {
    let parts = filePath.split('/lib/');
    return parts.length > 1 ? parts[1] : '';
}
function getFileName(filePath) {
    return path.basename(filePath);
}
//#endregion
//# sourceMappingURL=extension.js.map