// Simple test script to verify plugin logic
// This simulates the editor operations without requiring Obsidian

class MockEditor {
	constructor(initialContent) {
		this.content = initialContent;
	}

	getValue() {
		return this.content;
	}

	setValue(value) {
		this.content = value;
	}

	listSelections() {
		// For simplicity, return a single selection at the beginning
		return [{ head: { line: 0, ch: 0 }, anchor: { line: 0, ch: 0 } }];
	}

	setSelections(selections) {
		// Mock implementation
	}
}

class TestPlugin {
	constructor() {
		this.settings = { maxIndentLevels: 10 };
	}

	getIndentLevel(line) {
		let indent = 0;
		let i = 0;
		while (i < line.length && line[i] === ' ') {
			indent++;
			i++;
		}
		return Math.floor(indent / 2);
	}

	increaseIndent(editor) {
		const selections = editor.listSelections();
		const lines = editor.getValue().split('\n');
		const processedLines = new Set();

		selections.forEach(selection => {
			const startLine = selection.head.line;
			const endLine = selection.anchor.line;
			const minLine = Math.min(startLine, endLine);
			const maxLine = Math.max(startLine, endLine);

			for (let i = minLine; i <= maxLine; i++) {
				if (lines[i] !== undefined && !processedLines.has(i)) {
					const currentIndent = this.getIndentLevel(lines[i]);
					if (currentIndent < this.settings.maxIndentLevels) {
						lines[i] = '  ' + lines[i];
					}
					processedLines.add(i);
				}
			}
		});

		editor.setValue(lines.join('\n'));
	}

	decreaseIndent(editor) {
		const selections = editor.listSelections();
		const lines = editor.getValue().split('\n');
		const processedLines = new Set();

		selections.forEach(selection => {
			const startLine = selection.head.line;
			const endLine = selection.anchor.line;
			const minLine = Math.min(startLine, endLine);
			const maxLine = Math.max(startLine, endLine);

			for (let i = minLine; i <= maxLine; i++) {
				if (lines[i] !== undefined && !processedLines.has(i) && lines[i].startsWith('  ')) {
					lines[i] = lines[i].substring(2);
					processedLines.add(i);
				}
			}
		});

		editor.setValue(lines.join('\n'));
	}
}

// Test cases
console.log('Testing Two Spaces Indent Plugin Logic\n');

const testCases = [
	{
		name: 'Single line increase',
		input: 'Hello world',
		operation: 'increase',
		expected: '  Hello world'
	},
	{
		name: 'Single line decrease (no indent)',
		input: 'Hello world',
		operation: 'decrease',
		expected: 'Hello world'
	},
	{
		name: 'Single line decrease (with indent)',
		input: '  Hello world',
		operation: 'decrease',
		expected: 'Hello world'
	},
	{
		name: 'Empty line increase',
		input: '',
		operation: 'increase',
		expected: '  '
	},
	{
		name: 'Empty line decrease',
		input: '',
		operation: 'decrease',
		expected: ''
	}
];

const plugin = new TestPlugin();

testCases.forEach(testCase => {
	console.log(`Test: ${testCase.name}`);
	const editor = new MockEditor(testCase.input);

	if (testCase.operation === 'increase') {
		plugin.increaseIndent(editor);
	} else if (testCase.operation === 'decrease') {
		plugin.decreaseIndent(editor);
	}

	const result = editor.getValue();
	const passed = result === testCase.expected;
	console.log(`  Input: "${testCase.input.replace(/\n/g, '\\n')}"`);
	console.log(`  Expected: "${testCase.expected.replace(/\n/g, '\\n')}"`);
	console.log(`  Got: "${result.replace(/\n/g, '\\n')}"`);
	console.log(`  Result: ${passed ? 'PASS' : 'FAIL'}\n`);
});

console.log('Testing complete!');