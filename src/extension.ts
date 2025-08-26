
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('extension.convertToApp',
		async (uri: vscode.Uri) => {
			if (!uri || !fs.lstatSync(uri.fsPath).isDirectory()) {
				vscode.window.showErrorMessage("Selecione uma pasta.");
				return;
			}

			const folderPath = uri.fsPath;
			const folderName = path.basename(folderPath);
			const appFile = path.join(path.dirname(folderPath), `${folderName}.app`);
			try {
				const output = fs.createWriteStream(appFile);
				const archive = archiver("zip", { zlib: { level: 9 } });

				archive.pipe(output);
				archive.directory(folderPath, false);

				await archive.finalize();

				vscode.window.showInformationMessage(`Convertido para: ${appFile}`);
			} catch (err: any) {
				vscode.window.showErrorMessage("Erro: " + err.message);
			}

		});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
