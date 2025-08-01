# AutoRelPathComments

Easily insert relative path comments in your files. Right-click on folders to process all files in that directory.

## Description

This VS Code extension, `AutoRelPathComments`, simplifies the process of adding relative path comments to the top of your files. It allows you to quickly insert comments that display the file's path relative to the workspace root. This can be particularly useful for larger projects, making it easier to understand file locations and project structure at a glance.

## Features

-   **Insert Relative Path Comment:** Adds a relative path comment to the top of the currently opened file.
-   **Batch Insert in Directory:** Inserts relative path comments to all files within a selected folder.
-   **Specific File Type Insertion:** Adds path comments only to files with specific extensions within a folder.
-   **Undo Last Action:** Reverts the last path comment insertion/removal action performed by the extension.
-   **Customizable:**
    -   Use forward slashes (/) instead of backslashes (\\) in paths.
    -   Configure the maximum file size to process.
    -   Toggle confirmation prompts for large operations.
    -   Control whether files are opened in the editor during batch processing.

## Installation

1.  Open Visual Studio Code.
2.  Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3.  Search for `AutoRelPathComments`.
4.  Click **Install**.

## Usage

### Adding a Relative Path Comment to the Current File

1.  Open the file you want to add the comment to.
2.  Use one of the following methods:
    -   Right-click in the editor and select "Add Relative Path Comment to This File (ARP)".
    -   Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run "Add Relative Path Comment to This File (ARP)".
    -   Use the keyboard shortcut `Ctrl+Alt+P` or `Cmd+Alt+P`.

### Adding Relative Path Comments to All Files in a Folder

1.  Right-click on the desired folder in the Explorer view.
2.  Select "Add Relative Path Comments to All Files in Folder (ARP)".

### Adding Path Comments to Specific File Types in a Folder

1.  Right-click on the desired folder in the Explorer view.
2.  Select "Add Path Comments to Specific File Types (ARP)".
3.  You will be prompted to enter the file extension (e.g., `ts`, `js`, `py`).

### Undoing the Last Action

1.  To undo the last action performed by the extension (either single file or batch operations):
    -   Right-click in the Explorer view and select "Undo Last Path Comment Action (ARP)".
    -   Open the Command Palette and run "Undo Last Path Comment Action (ARP)".
    -   Use the keyboard shortcut `Ctrl+Alt+U` or `Cmd+Alt+U`.

## Configuration

You can configure the extension settings in VS Code's settings:

1.  Go to `File > Preferences > Settings` (or `Code > Settings > Settings` on macOS).
2.  Search for `AutoRelPathComments`.
3.  Available settings:
    -   `relativepathcomment.useForwardSlashes`: Use forward slashes (/) instead of backslashes (\\) in paths (default: `false`).
    -   `relativepathcomment.maxFileSize`: Maximum file size (in bytes) to process (default: `1048576` - 1MB).
    -   `relativepathcomment.confirmLargeOperations`: Ask for confirmation when processing more than 10 files (default: `true`).
    -   `relativepathcomment.openFilesInEditor`: Default behavior for opening files during batch processing (default: `true`).

## Contributing

Contributions are welcome! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, descriptive messages.
4.  Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Change Log

See [CHANGELOG.md](CHANGELOG.md) for the release history.
