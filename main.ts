import { App, Plugin, PluginSettingTab, Setting, TFile, Editor, MarkdownView, Notice } from 'obsidian';

interface TwoSpacesIndentSettings {
	maxIndentLevels: number;
}

const DEFAULT_SETTINGS: TwoSpacesIndentSettings = {
	maxIndentLevels: 10
}

export default class TwoSpacesIndentPlugin extends Plugin {
	settings: TwoSpacesIndentSettings;

	async onload() {
		await this.loadSettings();

		// Add commands
		this.addCommand({
			id: 'increase-indent',
			name: 'Increase Indent',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.increaseIndent(editor);
			}
		});

		this.addCommand({
			id: 'decrease-indent',
			name: 'Decrease Indent',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.decreaseIndent(editor);
			}
		});

		// Add settings tab
		this.addSettingTab(new TwoSpacesIndentSettingTab(this.app, this));
	}

	onunload() {
		// Cleanup if needed
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	getIndentLevel(line: string): number {
		let indent = 0;
		let i = 0;
		while (i < line.length && line[i] === ' ') {
			indent++;
			i++;
		}
		return Math.floor(indent / 2);
	}

	increaseIndent(editor: Editor) {
		const selections = editor.listSelections();
		if (selections.length === 0) return;

		const lines = editor.getValue().split('\n');
		const processedLines = new Set<number>();
		let maxLevelReached = false;

		selections.forEach(selection => {
			const startLine = selection.head.line;
			const endLine = selection.anchor.line;
			const minLine = Math.min(startLine, endLine);
			const maxLine = Math.max(startLine, endLine);

			for (let i = minLine; i <= maxLine; i++) {
				if (lines[i] !== undefined && !processedLines.has(i)) {
					// Check if adding indent would exceed max levels
					const currentIndent = this.getIndentLevel(lines[i]);
					if (currentIndent < this.settings.maxIndentLevels) {
						lines[i] = '  ' + lines[i];
					} else {
						maxLevelReached = true;
					}
					processedLines.add(i);
				}
			}
		});

		editor.setValue(lines.join('\n'));

		// Restore selections with adjusted positions
		const newSelections = selections.map(selection => {
			const headLine = selection.head.line;
			const anchorLine = selection.anchor.line;
			const headCh = selection.head.ch;
			const anchorCh = selection.anchor.ch;

			// Adjust cursor position by +2 for each processed line
			const newHeadCh = headCh + 2;
			const newAnchorCh = anchorCh + 2;

			return {
				head: { line: headLine, ch: newHeadCh },
				anchor: { line: anchorLine, ch: newAnchorCh }
			};
		});
		editor.setSelections(newSelections);

		if (maxLevelReached) {
			new Notice(`Maximum indent level (${this.settings.maxIndentLevels}) reached`);
		}
	}

	decreaseIndent(editor: Editor) {
		const selections = editor.listSelections();
		if (selections.length === 0) return;

		const lines = editor.getValue().split('\n');
		const processedLines = new Set<number>();
		let noIndentFound = true;

		selections.forEach(selection => {
			const startLine = selection.head.line;
			const endLine = selection.anchor.line;
			const minLine = Math.min(startLine, endLine);
			const maxLine = Math.max(startLine, endLine);

			for (let i = minLine; i <= maxLine; i++) {
				if (lines[i] !== undefined && !processedLines.has(i) && lines[i].startsWith('  ')) {
					lines[i] = lines[i].substring(2);
					processedLines.add(i);
					noIndentFound = false;
				}
			}
		});

		editor.setValue(lines.join('\n'));

		// Restore selections with adjusted positions
		const newSelections = selections.map(selection => {
			const headLine = selection.head.line;
			const anchorLine = selection.anchor.line;
			const headCh = selection.head.ch;
			const anchorCh = selection.anchor.ch;

			// Adjust cursor position by -2, but don't go below 0
			const newHeadCh = Math.max(0, headCh - 2);
			const newAnchorCh = Math.max(0, anchorCh - 2);

			return {
				head: { line: headLine, ch: newHeadCh },
				anchor: { line: anchorLine, ch: newAnchorCh }
			};
		});
		editor.setSelections(newSelections);

		if (noIndentFound) {
			new Notice('No indentation to decrease');
		}
	}
}

class TwoSpacesIndentSettingTab extends PluginSettingTab {
	plugin: TwoSpacesIndentPlugin;

	constructor(app: App, plugin: TwoSpacesIndentPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Two Spaces Indent Settings' });

		containerEl.createEl('p', {
			text: 'Hotkeys can be customized in Obsidian\'s Hotkeys settings. Search for "Increase Indent" and "Decrease Indent" commands.'
		});

		new Setting(containerEl)
			.setName('Maximum Indent Levels')
			.setDesc('Maximum number of indent levels allowed (default: 10)')
			.addSlider(slider => slider
				.setLimits(1, 20, 1)
				.setValue(this.plugin.settings.maxIndentLevels)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.maxIndentLevels = value;
					await this.plugin.saveSettings();
				}));
	}
}