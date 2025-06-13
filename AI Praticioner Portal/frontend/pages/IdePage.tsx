import React, { useState, useEffect, useCallback } from 'react';
import EditorLayout from '../components/layout/EditorLayout';
import Editor from '@monaco-editor/react';
import { fileService } from '../services/fileService';
import KeyboardShortcuts from '../components/editor/KeyboardShortcuts';
import StatusBar from '../components/editor/StatusBar';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { EditorTabs, EditorTab } from '../src/components/editor/EditorTabs';
import CommandPalette, { Command } from '../src/components/editor/CommandPalette';

const IdePage: React.FC = () => {
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [testTab, setTestTab] = useState<EditorTab | null>(null);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'running' | 'pass' | 'fail', output: string }>({ status: 'idle', output: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (activeTab) {
      const tab = tabs.find(t => t.path === activeTab);
      if (tab && editorInstance) {
        try {
          const content = editorInstance.getValue();
          await fileService.saveFile(tab.path, content);
          setTabs(prevTabs => prevTabs.map(t =>
            t.path === tab.path ? { ...t, isModified: false } : t
          ));
        } catch (error) {
          console.error('Error saving file:', error);
          setError('Error saving file. Please try again later.');
        }
      }
    }
  };

  const commands: Command[] = [
    {
      id: 'new-file',
      title: 'New File',
      description: 'Create a new file',
      shortcut: 'Ctrl+N',
      action: () => {/* TODO: Implement new file dialog */},
    },
    {
      id: 'save-file',
      title: 'Save File',
      description: 'Save the current file',
      shortcut: 'Ctrl+S',
      action: handleSave,
    },
    {
      id: 'close-file',
      title: 'Close File',
      description: 'Close the current file',
      shortcut: 'Ctrl+W',
      action: () => { if (activeTab) handleTabClose(activeTab); },
    },
  ];

  const handleFileSelect = async (filePath: string) => {
    let existingTab = tabs.find(tab => tab.path === filePath);
    if (existingTab) {
      setActiveTab(filePath);
      // Try to find and load the test file
      await loadTestTab(filePath);
      return;
    }
    setIsLoading(true);
    try {
      const { content } = await fileService.getFileContent(filePath);
      const language = getLanguage(filePath);
      const newTab: EditorTab = {
        path: filePath,
        content,
        language,
        isModified: false,
      };
      setTabs(prevTabs => [...prevTabs, newTab]);
      setActiveTab(filePath);
      // Try to find and load the test file
      await loadTestTab(filePath);
    } catch (error) {
      console.error('Error loading file content:', error);
      setError('Error loading file content. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabSelect = (filePath: string) => {
    setActiveTab(filePath);
  };

  const handleTabClose = (filePath: string) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab.path !== filePath));
    if (activeTab === filePath) {
      const remainingTabs = tabs.filter(tab => tab.path !== filePath);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].path : null);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeTab && value !== undefined) {
      setTabs(prevTabs => prevTabs.map(tab =>
        tab.path === activeTab ? { ...tab, content: value, isModified: true } : tab
      ));
    }
  };

  const handleFormat = () => {
    if (editorInstance) {
      editorInstance.getAction('editor.action.formatDocument').run();
    }
  };

  const handleSettings = () => {
    // TODO: Implement settings dialog
    console.log('Settings clicked');
  };

  const handleEditorDidMount = (editor: any) => {
    setEditorInstance(editor);
    
    // Add cursor position change listener
    editor.onDidChangeCursorPosition((e: any) => {
      const position = e.position;
      setCursorPosition({
        lineNumber: position.lineNumber,
        column: position.column
      });
    });
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl/Cmd + K to show shortcuts
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      setShowShortcuts(true);
    }
    // Ctrl/Cmd + S to save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      handleSave();
    }
    // Ctrl/Cmd + P to open command palette
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault();
      setIsCommandPaletteOpen(true);
    }
    // Esc to close shortcuts or command palette
    if (event.key === 'Escape') {
      if (showShortcuts) setShowShortcuts(false);
      if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
    }
  }, [showShortcuts, isCommandPaletteOpen, activeTab]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Get language from file extension
  const getLanguage = (path: string | null): string => {
    if (!path) return 'plaintext';
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py':
        return 'python';
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'yaml':
      case 'yml':
        return 'yaml';
      default:
        return 'plaintext';
    }
  };

  const loadTestTab = async (filePath: string) => {
    // Only for Python for now: test file is test_<name>.py in the same directory
    if (!filePath.endsWith('.py')) {
      setTestTab(null);
      return;
    }
    const parts = filePath.split('/');
    const fileName = parts.pop();
    if (!fileName) return;
    const testFileName = fileName.startsWith('test_') ? fileName.replace('test_', '') : `test_${fileName}`;
    const testFilePath = [...parts, testFileName].join('/');
    try {
      const { content } = await fileService.getFileContent(testFilePath);
      setTestTab({
        path: testFilePath,
        content,
        language: 'python',
        isModified: false,
      });
    } catch {
      setTestTab(null); // No test file found
    }
  };

  const handleTestEditorChange = (value: string | undefined) => {
    if (testTab && value !== undefined) {
      setTestTab({ ...testTab, content: value, isModified: true });
    }
  };

  const handleRunTests = async () => {
    if (!testTab) return;
    setTestResult({ status: 'running', output: '' });
    // Simulate running tests (replace with real backend call in future)
    setTimeout(() => {
      // Simple mock: pass if 'fail' not in content, fail otherwise
      if (testTab.content.includes('fail')) {
        setTestResult({ status: 'fail', output: 'Test failed: AssertionError' });
      } else {
        setTestResult({ status: 'pass', output: 'All tests passed!' });
      }
    }, 1200);
  };

  return (
    <EditorLayout onFileSelect={handleFileSelect}>
      <div className="flex flex-col h-full">
        {error && (
          <div className="bg-red-600 text-white px-4 py-2 mb-2 rounded shadow text-center">
            {error}
          </div>
        )}
        <EditorTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabSelect={handleTabSelect}
          onTabClose={handleTabClose}
        />
        {activeTab ? (
          <div className={`flex-1 relative ${testTab ? 'flex flex-col md:flex-row' : ''}`}> 
            <div className={testTab ? 'w-full md:w-1/2 h-1/2 md:h-full' : 'h-full'}>
              <EditorToolbar
                onSave={handleSave}
                onFormat={handleFormat}
                onSettings={handleSettings}
                isDirty={tabs.find(tab => tab.path === activeTab)?.isModified || false}
              />
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                  <div className="text-white">Loading file...</div>
                </div>
              ) : (
                <Editor
                  height="calc(100% - 40px)"
                  defaultLanguage={tabs.find(tab => tab.path === activeTab)?.language || 'typescript'}
                  language={tabs.find(tab => tab.path === activeTab)?.language || 'typescript'}
                  value={tabs.find(tab => tab.path === activeTab)?.content || ''}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    renderWhitespace: 'selection',
                    tabSize: 2,
                    insertSpaces: true,
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: 'on',
                    snippetSuggestions: 'inline',
                    wordBasedSuggestions: 'currentDocument',
                    parameterHints: {
                      enabled: true
                    },
                    formatOnPaste: true,
                    formatOnType: true,
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    autoSurround: 'brackets',
                    bracketPairColorization: {
                      enabled: true
                    }
                  }}
                />
              )}
            </div>
            {testTab && (
              <div className="w-full md:w-1/2 h-1/2 md:h-full border-t md:border-t-0 md:border-l border-gray-700 flex flex-col">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Test: {testTab.path.split('/').pop()}</span>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                    onClick={handleRunTests}
                    disabled={testResult.status === 'running'}
                  >
                    {testResult.status === 'running' ? 'Running...' : 'Run Tests'}
                  </button>
                </div>
                <Editor
                  height="calc(100% - 40px)"
                  defaultLanguage="python"
                  language="python"
                  value={testTab.content}
                  onChange={handleTestEditorChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    renderWhitespace: 'selection',
                    tabSize: 2,
                    insertSpaces: true,
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: 'on',
                    snippetSuggestions: 'inline',
                    wordBasedSuggestions: 'currentDocument',
                    parameterHints: {
                      enabled: true
                    },
                    formatOnPaste: true,
                    formatOnType: true,
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    autoSurround: 'brackets',
                    bracketPairColorization: {
                      enabled: true
                    }
                  }}
                />
                {/* Test runner output */}
                <div className="p-2 border-t border-gray-700 bg-gray-900 text-xs flex items-center space-x-2">
                  {testResult.status === 'pass' && <span className="text-green-400 font-bold">✔ Passed</span>}
                  {testResult.status === 'fail' && <span className="text-red-400 font-bold">✖ Failed</span>}
                  {testResult.status === 'running' && <span className="text-yellow-400 font-bold">⏳ Running...</span>}
                  <span className="text-gray-300">{testResult.output}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a file to start editing
          </div>
        )}
        <StatusBar
          currentFile={activeTab}
          language={tabs.find(tab => tab.path === activeTab)?.language || 'plaintext'}
          lineNumber={cursorPosition.lineNumber}
          column={cursorPosition.column}
        />
      </div>
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      <CommandPalette
        commands={commands}
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </EditorLayout>
  );
};

export default IdePage; 