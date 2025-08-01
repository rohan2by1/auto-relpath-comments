"use strict";
//src/extension.ts
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
// Comment styles map
const commentStyles = {
    '.js': { start: '//' },
    '.jsx': { start: '//' },
    '.ts': { start: '//' },
    '.tsx': { start: '//' },
    '.java': { start: '//' },
    '.c': { start: '//' },
    '.cpp': { start: '//' },
    '.cs': { start: '//' },
    '.php': { start: '//' },
    '.go': { start: '//' },
    '.swift': { start: '//' },
    '.kt': { start: '//' },
    '.scala': { start: '//' },
    '.rust': { start: '//' },
    '.py': { start: '#' },
    '.rb': { start: '#' },
    '.sh': { start: '#' },
    '.yaml': { start: '#' },
    '.yml': { start: '#' },
    '.r': { start: '#' },
    '.pl': { start: '#' },
    '.css': { start: '/*', end: '*/' },
    '.scss': { start: '//' },
    '.sass': { start: '//' },
    '.less': { start: '//' },
    '.html': { start: '<!--', end: '-->' },
    '.xml': { start: '<!--', end: '-->' },
    '.sql': { start: '--' },
    '.lua': { start: '--' },
    '.vim': { start: '"' },
    '.bat': { start: 'REM' },
    '.ps1': { start: '#' }
};
const allSupportedExtensions = Object.keys(commentStyles);
const extensionNames = {
    '.js': 'JavaScript',
    '.jsx': 'JSX',
    '.ts': 'TypeScript',
    '.tsx': 'TSX',
    '.java': 'Java',
    '.c': 'C',
    '.cpp': 'C++',
    '.cs': 'C#',
    '.php': 'PHP',
    '.go': 'Go',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.scala': 'Scala',
    '.rust': 'Rust',
    '.py': 'Python',
    '.rb': 'Ruby',
    '.sh': 'Shell',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.r': 'R',
    '.pl': 'Perl',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.sass': 'SASS',
    '.less': 'LESS',
    '.html': 'HTML',
    '.xml': 'XML',
    '.sql': 'SQL',
    '.lua': 'Lua',
    '.vim': 'VimScript',
    '.bat': 'Batch',
    '.ps1': 'PowerShell'
};
// Undo history: Map file URI string => original first line text
const undoHistory = new Map();
// Configuration helpers
function getUseForwardSlashes() {
    const config = vscode.workspace.getConfiguration('relativePathComment');
    return config.get('useForwardSlashes') || false;
}
function getMaxFileSize() {
    const config = vscode.workspace.getConfiguration('relativePathComment');
    return config.get('maxFileSize') || 1048576; // 1MB default
}
function getConfirmLargeOperations() {
    const config = vscode.workspace.getConfiguration('relativePathComment');
    return config.get('confirmLargeOperations') !== false; // true by default
}
function getOpenFilesInEditor() {
    const config = vscode.workspace.getConfiguration('relativePathComment');
    return config.get('openFilesInEditor') !== false; // true by default
}
// Utility functions
function formatComment(ext, relPath) {
    const style = commentStyles[ext.toLowerCase()];
    const useForwardSlashes = getUseForwardSlashes();
    const formattedPath = useForwardSlashes ? relPath.replace(/\\/g, '/') : relPath.replace(/\//g, '\\');
    if (!style) {
        return `//${formattedPath}`;
    }
    else if (style.end) {
        return `${style.start}${formattedPath}${style.end}`;
    }
    else {
        return `${style.start}${formattedPath}`;
    }
}
function logError(message, error) {
    console.error(`[AutoRelPath Comments] ${message}`, error);
}
function showSummary(processed, skipped, errors) {
    const messages = [];
    if (processed > 0)
        messages.push(`${processed} processed`);
    if (skipped > 0)
        messages.push(`${skipped} skipped`);
    if (errors > 0)
        messages.push(`${errors} errors`);
    const summary = messages.length > 0 ? messages.join(', ') : 'No files processed';
    vscode.window.showInformationMessage(`Operation complete: ${summary}`);
}
// File processing functions
async function insertCommentInDoc(doc, commentLine, openInEditor = true) {
    try {
        let editor;
        if (openInEditor) {
            // Open file in editor
            editor = await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true });
        }
        else {
            // Process in background - check if file is already open
            const existingEditor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === doc.uri.toString());
            if (existingEditor) {
                editor = existingEditor;
            }
            else {
                // File not open, we need to create an editor temporarily
                editor = await vscode.window.showTextDocument(doc, {
                    preview: false,
                    preserveFocus: true,
                    viewColumn: vscode.ViewColumn.Beside // Open in background
                });
                // Close the tab immediately after processing
                setTimeout(() => {
                    vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                }, 100);
            }
        }
        // Check if comment already exists
        const firstLine = doc.lineAt(0);
        const fileName = path.basename(doc.fileName);
        if (firstLine.text.includes(fileName) &&
            (firstLine.text.includes('//') || firstLine.text.includes('/*') || firstLine.text.includes('#') || firstLine.text.includes('<!--'))) {
            return false; // Comment already exists
        }
        // Save original first line for undo
        const originalFirstLine = firstLine.text;
        undoHistory.set(doc.uri.toString(), originalFirstLine);
        await editor.edit(editBuilder => {
            if (firstLine.text.trim() === '') {
                editBuilder.replace(firstLine.range, commentLine);
            }
            else {
                editBuilder.insert(new vscode.Position(0, 0), commentLine + '\n');
            }
        });
        await doc.save();
        return true;
    }
    catch (error) {
        logError(`Error inserting comment in ${doc.fileName}`, error);
        return false;
    }
}
async function insertRelativePath(uri) {
    try {
        let doc;
        if (uri) {
            doc = await vscode.workspace.openTextDocument(uri);
        }
        else {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No file is open or selected.');
                return;
            }
            doc = editor.document;
        }
        const ext = path.extname(doc.fileName).toLowerCase();
        if (!commentStyles[ext]) {
            vscode.window.showInformationMessage(`Extension '${ext}' not supported.`);
            return;
        }
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri);
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('File is not inside a workspace folder!');
            return;
        }
        const relPath = path.relative(workspaceFolder.uri.fsPath, doc.uri.fsPath);
        const commentLine = formatComment(ext, relPath);
        const success = await insertCommentInDoc(doc, commentLine, true); // Always open single files
        if (success) {
            vscode.window.showInformationMessage(`Inserted comment in ${path.basename(doc.fileName)}`);
        }
        else {
            vscode.window.showInformationMessage(`Comment already exists in ${path.basename(doc.fileName)}`);
        }
    }
    catch (err) {
        vscode.window.showErrorMessage('Error inserting comment: ' + err);
    }
}
async function insertRelativePathInDirectory(directoryUri, extensions) {
    try {
        let extsToSearch;
        if (extensions && extensions.length > 0) {
            extsToSearch = extensions.map(e => e.replace(/^\./, ''));
        }
        else {
            extsToSearch = allSupportedExtensions.map(e => e.replace(/^\./, ''));
        }
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Processing directory...",
            cancellable: true
        }, async (progress, token) => {
            progress.report({ message: "Finding files..." });
            const includePattern = new vscode.RelativePattern(directoryUri, `**/*.{${extsToSearch.join(',')}}`);
            const files = await vscode.workspace.findFiles(includePattern);
            if (files.length === 0) {
                vscode.window.showInformationMessage('No matching files found in selected directory.');
                return;
            }
            // Show directory info and confirm
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(directoryUri);
            const dirName = workspaceFolder
                ? path.relative(workspaceFolder.uri.fsPath, directoryUri.fsPath) || workspaceFolder.name
                : path.basename(directoryUri.fsPath);
            const confirmLarge = getConfirmLargeOperations();
            let proceed = true;
            if (confirmLarge && files.length > 10) {
                const response = await vscode.window.showInformationMessage(`Found ${files.length} files in "${dirName}". Process them?`, 'Yes', 'Cancel');
                proceed = response === 'Yes';
            }
            if (!proceed) {
                return;
            }
            // Ask user about opening files in editor
            const openFilesDefault = getOpenFilesInEditor();
            let openFilesInEditor = openFilesDefault;
            // Show dialog for opening files choice
            const openFilesChoice = await vscode.window.showInformationMessage(`How would you like to process the files?`, {
                modal: true,
                detail: `${files.length} files will be processed. Choose whether to open them in the editor or process them in the background.`
            }, 'Open Files in Editor', 'Process in Background');
            if (!openFilesChoice) {
                return; // User cancelled
            }
            openFilesInEditor = openFilesChoice === 'Open Files in Editor';
            let processed = 0;
            let skipped = 0;
            let errors = 0;
            const total = files.length;
            const maxFileSize = getMaxFileSize();
            progress.report({ message: openFilesInEditor ? "Processing files (opening in editor)..." : "Processing files (in background)..." });
            for (const fileUri of files) {
                if (token.isCancellationRequested) {
                    break;
                }
                try {
                    const doc = await vscode.workspace.openTextDocument(fileUri);
                    const workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri);
                    if (!workspaceFolder) {
                        skipped++;
                        continue;
                    }
                    const ext = path.extname(doc.fileName).toLowerCase();
                    if (!commentStyles[ext]) {
                        skipped++;
                        continue;
                    }
                    // Check file size
                    if (doc.getText().length > maxFileSize) {
                        skipped++;
                        continue;
                    }
                    const relPath = path.relative(workspaceFolder.uri.fsPath, doc.uri.fsPath);
                    const commentLine = formatComment(ext, relPath);
                    const success = await insertCommentInDoc(doc, commentLine, openFilesInEditor);
                    if (success) {
                        processed++;
                    }
                    else {
                        skipped++;
                    }
                    progress.report({
                        increment: (100 / total),
                        message: `Processed ${processed + skipped + errors}/${total} files...`
                    });
                    // Add small delay to prevent overwhelming the editor when opening files
                    if (openFilesInEditor && processed % 5 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
                catch (error) {
                    errors++;
                    logError(`Error processing ${fileUri.fsPath}`, error);
                }
            }
            showSummary(processed, skipped, errors);
        });
    }
    catch (err) {
        vscode.window.showErrorMessage('Error processing directory: ' + err);
    }
}
async function insertRelativePathSpecificFormatInDirectory(directoryUri) {
    const items = allSupportedExtensions.map(ext => ({
        label: extensionNames[ext] || ext,
        description: ext,
        ext
    }));
    const chosen = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select the file extension to process in this directory',
    });
    if (!chosen) {
        return;
    }
    await insertRelativePathInDirectory(directoryUri, [chosen.ext]);
}
async function undoLastAction() {
    if (undoHistory.size === 0) {
        vscode.window.showInformationMessage('Nothing to undo.');
        return;
    }
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Undoing changes...",
        cancellable: false
    }, async (progress) => {
        let countRestored = 0;
        const total = undoHistory.size;
        for (const [uriString, originalFirstLine] of undoHistory.entries()) {
            try {
                const uri = vscode.Uri.parse(uriString);
                const doc = await vscode.workspace.openTextDocument(uri);
                const editor = await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true });
                await editor.edit(editBuilder => {
                    const firstLine = doc.lineAt(0);
                    if (originalFirstLine.trim() === '') {
                        editBuilder.delete(firstLine.rangeIncludingLineBreak);
                    }
                    else {
                        editBuilder.replace(firstLine.range, originalFirstLine);
                    }
                });
                await doc.save();
                countRestored++;
                progress.report({
                    increment: (100 / total),
                    message: `Restored ${countRestored}/${total} files...`
                });
            }
            catch (e) {
                logError(`Error undoing changes for ${uriString}`, e);
            }
        }
        undoHistory.clear();
        vscode.window.showInformationMessage(`Undo complete - restored ${countRestored} file(s).`);
    });
}
function activate(context) {
    // Register all commands
    context.subscriptions.push(vscode.commands.registerCommand('auto-relpath-comments.insertCurrentFile', insertRelativePath));
    context.subscriptions.push(vscode.commands.registerCommand('auto-relpath-comments.insertInDirectory', (uri) => insertRelativePathInDirectory(uri)));
    context.subscriptions.push(vscode.commands.registerCommand('auto-relpath-comments.insertSpecificFormatInDirectory', (uri) => insertRelativePathSpecificFormatInDirectory(uri)));
    context.subscriptions.push(vscode.commands.registerCommand('auto-relpath-comments.undoLastAction', undoLastAction));
}
function deactivate() {
    undoHistory.clear();
}
//# sourceMappingURL=extension.js.map