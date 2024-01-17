import fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { ImportPathFixer } from './import_path_fixer';

let fixerDictionary: { [key: string]: ImportPathFixer } = {};

enum PathType {
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
			onFolderPathChange(e.fsPath, PathType.Destination);
		} else {
			onFilePathChange(e.fsPath, PathType.Destination);
		}
	});

	file_watcher.onDidDelete((e) => {
		// console.log(`File deleted at ${e.fsPath}`);
		//Cannot use fs.statSync(e.fsPath).isDirectory() because the file is already deleted
		if (!isFilePath(e.fsPath)) {
			onFolderPathChange(e.fsPath, PathType.Source);
		} else {
			onFilePathChange(e.fsPath, PathType.Source);
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(file_watcher);
}



function onFolderPathChange(folderPath: string, pathType: PathType) {
	let folderName = getName(folderPath);
	let fixer = fixerDictionary[folderName] || (fixerDictionary[folderName] = new ImportPathFixer(folderName));;
	let subPath = getSubPathAfterLib(folderPath);
	if (pathType === PathType.Source) {
		fixer.setSourcePath(subPath);
	} else if (pathType === PathType.Destination) {
		fixer.setDestinationPath(subPath);
	}

	if (fixer.shouldExecute()) {
		fixer.executeImportFixes();
		delete fixerDictionary[folderName];
	}
}

function onFilePathChange(filePath: string, pathType: PathType) {
	if (!isDartFile(filePath)) {
		return;
	}

	let fileName = getName(filePath);
	let fixer = fixerDictionary[fileName] || (fixerDictionary[fileName] = new ImportPathFixer(fileName));;
	let subPath = getSubPathAfterLib(filePath);
	if (pathType === PathType.Source) {
		fixer.setSourcePath(subPath);
	} else if (pathType === PathType.Destination) {
		fixer.setDestinationPath(subPath);
	}
	if (fixer.shouldExecute()) {
		fixer.executeImportFixes();
		delete fixerDictionary[fileName];
	}
}

//#region path functions
function isDartFile(path: String): boolean {
	return path.endsWith('.dart');
}

function isFilePath(pathString: string): boolean {
	return path.extname(pathString) !== '';
}


function getSubPathAfterLib(filePath: string): string {
	let parts = filePath.split('/lib/');
	return parts.length > 1 ? parts[1] : '';
}

function getName(pathString: string): string {
	return path.basename(pathString);
}
//#endregion
