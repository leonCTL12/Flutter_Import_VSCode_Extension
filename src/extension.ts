import fs from 'fs';
import * as vscode from 'vscode';
import { Queue } from './data_structure/queue';
import { ImportPathFixer } from './import_path_fixer';


let queue = new Queue<() => Promise<void>>();

let renameCounter = 0;

export function activate(context: vscode.ExtensionContext) {
	let didRenameEvent = vscode.workspace.onDidRenameFiles((e) => {
		renameCounter--;
		e.files.forEach((file) => {
			queue.enqueue(
				() => onPathChanged(file.oldUri.fsPath, file.newUri.fsPath)
			);
			processQueue();
		});
	});

	let willRenameEvent = vscode.workspace.onWillRenameFiles((e) => {
		renameCounter++;
	});


	context.subscriptions.push(didRenameEvent);
}

async function onPathChanged(oldPath: string, newPath: string) {
	if (!fs.statSync(newPath).isDirectory() && !isDartFile(newPath)) {
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

async function processQueue() {
	while (!queue.isEmpty()) {
		//This does not work, coz rename counter is possible to increment when the task is executing
		if (renameCounter > 0) {
			continue;
		}
		const task = queue.dequeue();
		if (task) {
			await task();
		}
	}

}