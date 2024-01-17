import fs from 'fs';
import * as vscode from 'vscode';
import { ImportPathFixer } from './import_path_fixer';

export function activate(context: vscode.ExtensionContext) {
	let renameEvent = vscode.workspace.onDidRenameFiles((e) => {
		e.files.forEach((file) => {
			console.log(`File has been renamed from ${file.oldUri.fsPath} to ${file.newUri.fsPath}`);

			onPathChanged(file.oldUri.fsPath, file.newUri.fsPath);
		});
	});

	context.subscriptions.push(renameEvent);
}

async function onPathChanged(oldPath: string, newPath: string) {
	if (!fs.statSync(newPath).isDirectory() && !isDartFile(newPath)) {
		return;
	}

	let oldSubPath = getSubPathAfterLib(oldPath);
	let newSubPath = getSubPathAfterLib(newPath);
	let fixer = new ImportPathFixer(oldSubPath, newSubPath);
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
