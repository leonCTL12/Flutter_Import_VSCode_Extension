import * as fs from 'fs';
import * as readline from 'readline';
import * as vscode from 'vscode';

export class ImportPathFixer {
    name: string;
    sourcePath: string | null;
    destinationPath: string | null;

    constructor(name: string) {
        this.name = name;
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

    async executeImportFixes() {
        console.log("File ------------------");
        console.log("About to replace import path\n source:" + this.sourcePath + "\n destination: " + this.destinationPath);
        console.log("--------------------");

        let dartFiles = await this.findAllDartFiles();

        dartFiles.forEach((filePath) => {
            this.replaceImportPathInFile(filePath);
        });
    }

    async findAllDartFiles(): Promise<string[]> {
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

    replaceImportPathInFile(filePath: string) {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let newFileContent = '';

        rl.on('line', (line) => {
            if (this.isImportStatement(line)) {
                // Replace 'import' with 'export'
                line = line.replace(this.sourcePath as string, this.destinationPath as string);
            }
            newFileContent += line + '\n';
        });

        rl.on('close', () => {
            fs.writeFileSync(filePath, newFileContent);
        });
    }

    isImportStatement(line: string): boolean {
        return line.trim().startsWith("import");
    }
}