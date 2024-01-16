import * as path from 'path';

export class ImportPathFixer {
    fileName: string;
    sourcePath: string | null;
    destinationPath: string | null;

    constructor(filePath: string) {
        this.fileName = path.basename(filePath);
        this.sourcePath = null;
        this.destinationPath = null;
    }

    setSourcePath(filePath: string) {
        this.sourcePath = filePath;
    }

    setDestinationPath(filePath: string) {
        this.destinationPath = filePath;
    }

    shouldExecute(): boolean {
        return this.sourcePath !== null && this.destinationPath !== null;
    }

    executeImportFixes() {
        console.log("About to replace import path\n source:" + this.sourcePath + "\n destination: " + this.destinationPath);
        console.log("--------------------");
    }
}
