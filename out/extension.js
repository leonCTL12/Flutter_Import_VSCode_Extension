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
const vscode = __importStar(require("vscode"));
const import_path_fixer_1 = require("./import_path_fixer");
function activate(context) {
    let renameEvent = vscode.workspace.onDidRenameFiles((e) => {
        e.files.forEach((file) => {
            console.log(`File has been renamed from ${file.oldUri.fsPath} to ${file.newUri.fsPath}`);
            onPathChanged(file.oldUri.fsPath, file.newUri.fsPath);
        });
    });
    context.subscriptions.push(renameEvent);
}
exports.activate = activate;
async function onPathChanged(oldPath, newPath) {
    if (!fs_1.default.statSync(newPath).isDirectory() && !isDartFile(newPath)) {
        return;
    }
    let oldSubPath = getSubPathAfterLib(oldPath);
    let newSubPath = getSubPathAfterLib(newPath);
    let fixer = new import_path_fixer_1.ImportPathFixer(oldSubPath, newSubPath);
    await fixer.executeImportFixes();
}
//#region path functions
function isDartFile(path) {
    return path.endsWith('.dart');
}
function getSubPathAfterLib(filePath) {
    let parts = filePath.split('/lib/');
    return parts.length > 1 ? parts[1] : '';
}
//#endregion
//# sourceMappingURL=extension.js.map