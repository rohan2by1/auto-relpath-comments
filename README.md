# AutoRelPathComments

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/rohan2by1.auto-relpath-comments?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=rohan2by1.auto-relpath-comments)

Easily insert relative path comments in your files. Right-click on folders to process all files in that directory.

---

## 📘 Description

**AutoRelPathComments** simplifies the process of adding relative path comments to the top of your files. It shows each file’s path relative to the workspace root — great for large codebases where understanding file location is key.

---

## ✨ Features

- **Insert Relative Path Comment** to the top of the current file.
- **Batch Insert in Directory**: Add comments to all files in a folder.
- **Specific File Type Support**: Only add comments to certain extensions.
- **Undo Last Action** for both single and batch operations.
- **Highly Configurable**:
  - Use forward slashes `/` instead of backslashes `\\`.
  - Set max file size limit.
  - Enable/disable confirmation prompts.
  - Decide whether files open during batch runs.

---

## 🛠️ Installation

1. Open **Visual Studio Code**.
2. Go to the **Extensions view** (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Search for `AutoRelPathComments`.
4. Click **Install**.

Or install it directly via the Marketplace:  
👉 [**AutoRelPathComments on Visual Studio Marketplace**](https://marketplace.visualstudio.com/items?itemName=rohan2by1.auto-relpath-comments)

---

## 🚀 Usage

### ➕ Add a Relative Path Comment to Current File

1. Open any file.
2. Use one of the following:
   - Right-click in the editor → _"Add Relative Path Comment to This File (ARP)"_.
   - Open Command Palette → _"Add Relative Path Comment to This File (ARP)"_.
   - Use shortcut: `Ctrl+Alt+P` / `Cmd+Alt+P`.

### 📂 Add Comments to All Files in Folder

1. Right-click a folder in the Explorer.
2. Select _"Add Relative Path Comments to All Files in Folder (ARP)"_.

### 📝 Add to Specific File Types in Folder

1. Right-click a folder.
2. Select _"Add Path Comments to Specific File Types (ARP)"_.
3. Enter the desired extension (e.g., `ts`, `py`, `js`).

### ⬅️ Undo Last Action

- Right-click in the Explorer → _"Undo Last Path Comment Action (ARP)"_.
- Or open Command Palette → _"Undo Last Path Comment Action (ARP)"_.
- Or use shortcut: `Ctrl+Alt+U` / `Cmd+Alt+U`.

---

## ⚙️ Configuration

Go to: `File > Preferences > Settings` (or `Code > Settings > Settings` on macOS), then search for `AutoRelPathComments`.

| Setting                                 | Description                                                        | Default     |
|-----------------------------------------|--------------------------------------------------------------------|-------------|
| `relativepathcomment.useForwardSlashes` | Use `/` instead of `\\` in comments                                | `false`     |
| `relativepathcomment.maxFileSize`       | Max file size (bytes) to process                                   | `1048576`   |
| `relativepathcomment.confirmLargeOperations` | Ask for confirmation if more than 10 files will be updated     | `true`      |
| `relativepathcomment.openFilesInEditor` | Open files in the editor during batch operations                   | `true`      |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository.
2. Create a new branch for your changes.
3. Commit your code with clear messages.
4. Submit a pull request 🙌

---

## 📄 License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.

---

## 📜 Change Log

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## 🔗 Links

- 🔌 [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=rohan2by1.auto-relpath-comments)

---

