# Two Spaces Indent Plugin

A plugin for Obsidian that provides functionality for increasing and decreasing text indentation using 2 spaces per level.

## Features

- Increase Indent: Adds 2 spaces at the beginning of selected line(s) or current line
- Decrease Indent: Removes 2 spaces from the beginning of selected line(s) or current line (if present)
- Multi-line Support: Works with multiple line selections
- Cursor Position Maintenance: Preserves cursor position after indentation changes
- Configurable Max Levels: Set maximum indentation levels to prevent excessive nesting
- Visual Feedback: Shows notices when reaching limits or attempting invalid operations
- Undo/Redo Support: Full integration with Obsidian's undo system

## Installation

1. Download the latest release from the [releases page](https://github.com/hoishing/obsidian-two-spaces-indent/releases)
2. Extract the files to your Obsidian vault's `.obsidian/plugins/` directory
3. Reload Obsidian (or restart the app)
4. Enable the plugin in Settings > Community plugins

### Manual Installation

1. Clone or download this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the plugin
4. Copy `main.js`, `manifest.json`, and `styles.css` to your vault's `.obsidian/plugins/two-spaces-indent/` directory
5. Enable the plugin in Obsidian

## Usage

### Commands

The plugin adds two commands that can be accessed via:

- Command Palette: `Ctrl/Cmd + P` then search for "Increase Indent" or "Decrease Indent"
- Hotkeys: Configure custom hotkeys in Settings > Hotkeys

### Default Hotkeys

- Increase Indent: `Cmd + ]` (Mac) / `Ctrl + ]` (Windows/Linux)
- Decrease Indent: `Cmd + [` (Mac) / `Ctrl + [` (Windows/Linux)

*Note: Default hotkeys need to be set manually in Obsidian's hotkey settings*

### How It Works

- Single Line: Place cursor on a line and use the command
- Multiple Lines: Select multiple lines and use the command
- Mixed Content: Works with plain text, markdown, code blocks, and lists
- Edge Cases: Handles empty lines, already indented lines, and maximum indent limits

## Settings

Access plugin settings via Settings > Plugin options > Two Spaces Indent

- Maximum Indent Levels: Set the maximum number of indent levels allowed (default: 10)
- Hotkey Customization: Configure hotkeys in Obsidian's main hotkey settings

## Examples

### Before and After

```markdown
# Before
Some text
  Already indented
- List item

# After Increase Indent
  Some text
    Already indented
- List item

# After Decrease Indent (on indented lines)
Some text
  Already indented
- List item
```

### Multi-line Selection

Select multiple lines and indent/decrease indent applies to all selected lines.

## Compatibility

- Obsidian Version: 0.15.0+
- Platforms: Windows, Mac, Linux
- Content Types: Plain text, Markdown, code blocks, lists

## Development

### Building

```bash
npm install
npm run build
```

### Testing

The plugin has been tested with:

- Single-line operations
- Multi-line selections
- Edge cases (empty lines, max indent reached)
- Different markdown elements (lists, code blocks, headers)
- Various cursor positions

## License

MIT License - see LICENSE file for details.

## Questions

- [Github issue]
- [LinkedIn]

[Github issue]: https://github.com/hoishing/two-spaces-indent/issues
[LinkedIn]: https://www.linkedin.com/in/kng2
