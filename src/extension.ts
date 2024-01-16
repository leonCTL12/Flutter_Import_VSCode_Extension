import fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { ImportPathFixer } from './import_path_fixer';

let fixerDictionary: { [key: string]: ImportPathFixer } = {};

enum FileType {
	Source,
	Destination
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "flutter-import-fixer" is now active!');

	let disposable = vscode.commands.registerCommand('flutter-import-fixer.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Flutter Import Fixer!');
	});
	context.subscriptions.push(disposable);

	let file_watcher = vscode.workspace.createFileSystemWatcher("**/*");

	file_watcher.onDidCreate((e) => {
		// console.log(`File created at ${e.fsPath}`);
		if (fs.statSync(e.fsPath).isDirectory()) {
			recursiveTriggerOnFileChange(e.fsPath, FileType.Destination);
		} else {
			onFilePathChange(e.fsPath, FileType.Destination);
		}
	});

	file_watcher.onDidDelete((e) => {
		// console.log(`File deleted at ${e.fsPath}`);
		if (fs.statSync(e.fsPath).isDirectory()) {
			recursiveTriggerOnFileChange(e.fsPath, FileType.Source);
		} else {
			onFilePathChange(e.fsPath, FileType.Source);
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(file_watcher);
	context.subscriptions.push(file_deleteWatcher);
}

function recursiveTriggerOnFileChange(folderPath: string, fileType: FileType): void {
	fs.readdirSync(folderPath).forEach(file => {
		const absolutePath = path.join(folderPath, file);

		if (fs.statSync(absolutePath).isDirectory()) {
			recursiveTriggerOnFileChange(absolutePath, fileType);
		} else {
			onFilePathChange(absolutePath, fileType); // or FileType.Destination based on your logic
		}
	});
}

function onFilePathChange(filePath: string, fileType: FileType) {
	if (!isDartFile(filePath)) {
		return;
	}
	console.log(`File path changed at ${filePath}`);
	let fileName = getFileName(filePath);
	let fixer = getOrCreateImportPathFixer(fileName);
	let subPath = getSubPathAfterLib(filePath);
	if (fileType === FileType.Source) {
		fixer.setSourcePath(subPath);
	} else if (fileType === FileType.Destination) {
		fixer.setDestinationPath(subPath);
	}
	if (fixer.shouldExecute()) {
		fixer.executeImportFixes();
		delete fixerDictionary[fileName];
	}
}

//#region dictionary functions
function getOrCreateImportPathFixer(fileName: string): ImportPathFixer {
	if (fixerDictionary[fileName]) {
		return fixerDictionary[fileName];
	} else {
		fixerDictionary[fileName] = new ImportPathFixer(fileName);
		return fixerDictionary[fileName];
	}
}
//#endregion

//#region File path functions
function isDartFile(path: String): boolean {
	return path.endsWith('.dart');
}

function getSubPathAfterLib(filePath: string): string {
	let parts = filePath.split('/lib/');
	return parts.length > 1 ? parts[1] : '';
}

function getFileName(filePath: string): string {
	return path.basename(filePath);
}



//#endregion