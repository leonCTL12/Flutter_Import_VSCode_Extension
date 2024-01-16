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
exports.ImportPathFixer = void 0;
const path = __importStar(require("path"));
class ImportPathFixer {
    fileName;
    sourcePath;
    destinationPath;
    constructor(filePath) {
        this.fileName = path.basename(filePath);
        this.sourcePath = null;
        this.destinationPath = null;
    }
    setSourcePath(filePath) {
        this.sourcePath = filePath;
    }
    setDestinationPath(filePath) {
        this.destinationPath = filePath;
    }
    shouldExecute() {
        return this.sourcePath !== null && this.destinationPath !== null;
    }
    executeImportFixes() {
        console.log("About to replace import path\n source:" + this.sourcePath + "\n destination: " + this.destinationPath);
        console.log("--------------------");
    }
}
exports.ImportPathFixer = ImportPathFixer;
//# sourceMappingURL=import_path_fixer.js.map