import fs from 'fs';
import * as vscode from 'vscode';
import { ImportPathFixer } from './import_path_fixer';


export function activate(context: vscode.ExtensionContext) {
	//Notes: for multi-select file move event, the whole operation counts as one rename event
	let didRenameEvent = vscode.workspace.onDidRenameFiles(async (e) => {
		for (const file of e.files) {
			console.log("renamed from " + file.oldUri.fsPath + " to " + file.newUri.fsPath);
			await onPathChanged(file.oldUri.fsPath, file.newUri.fsPath);
		}
	});

	context.subscriptions.push(didRenameEvent);
}

async function onPathChanged(oldPath: string, newPath: string) {
	if (!fs.statSync(newPath).isDirectory() && !isDartFile(newPath)) {
		console.log("Return for non-dart file/repository " + newPath);
		return;
	}

	let oldSubPath = getSubPathAfterLib(oldPath);
	let newSubPath = getSubPathAfterLib(newPath);
	let fixer = new ImportPathFixer('/' + oldSubPath + '/', '/' + newSubPath + '/');
	await fixer.executeImportFixes();
}

//#region path functions
function isDartFile(path: String): boolean {
	return path.endsWith('.dart');
}

function getSubPathAfterLib(filePath: string): string {
	let parts = filePath.split('/lib/');
	return parts.length > 1 ? parts[1] : '';
}
//#endregion
