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
var PathType;
(function (PathType) {
    PathType[PathType["Source"] = 0] = "Source";
    PathType[PathType["Destination"] = 1] = "Destination";
})(PathType || (PathType = {}));
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
            onFolderPathChange(e.fsPath, PathType.Destination);
        }
        else {
            onFilePathChange(e.fsPath, PathType.Destination);
        }
    });
    file_watcher.onDidDelete((e) => {
        // console.log(`File deleted at ${e.fsPath}`);
        //Cannot use fs.statSync(e.fsPath).isDirectory() because the file is already deleted
        if (!isFilePath(e.fsPath)) {
            onFolderPathChange(e.fsPath, PathType.Source);
        }
        else {
            onFilePathChange(e.fsPath, PathType.Source);
        }
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(file_watcher);
}
exports.activate = activate;
function onFolderPathChange(folderPath, pathType) {
    let folderName = getName(folderPath);
    let fixer = fixerDictionary[folderName] || (fixerDictionary[folderName] = new import_path_fixer_1.ImportPathFixer(folderName));
    ;
    let subPath = getSubPathAfterLib(folderPath);
    if (pathType === PathType.Source) {
        fixer.setSourcePath(subPath);
    }
    else if (pathType === PathType.Destination) {
        fixer.setDestinationPath(subPath);
    }
    if (fixer.shouldExecute()) {
        fixer.executeImportFixes();
        delete fixerDictionary[folderName];
    }
}
function onFilePathChange(filePath, pathType) {
    if (!isDartFile(filePath)) {
        return;
    }
    let fileName = getName(filePath);
    let fixer = fixerDictionary[fileName] || (fixerDictionary[fileName] = new import_path_fixer_1.ImportPathFixer(fileName));
    ;
    let subPath = getSubPathAfterLib(filePath);
    if (pathType === PathType.Source) {
        fixer.setSourcePath(subPath);
    }
    else if (pathType === PathType.Destination) {
        fixer.setDestinationPath(subPath);
    }
    if (fixer.shouldExecute()) {
        fixer.executeImportFixes();
        delete fixerDictionary[fileName];
    }
}
//#region path functions
function isDartFile(path) {
    return path.endsWith('.dart');
}
function isFilePath(pathString) {
    return path.extname(pathString) !== '';
}
function getSubPathAfterLib(filePath) {
    let parts = filePath.split('/lib/');
    return parts.length > 1 ? parts[1] : '';
}
function getName(pathString) {
    return path.basename(pathString);
}
//#endregion
//# sourceMappingURL=extension.js.map