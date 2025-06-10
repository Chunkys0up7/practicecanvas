import React, { useState, useEffect, useCallback } from 'react';
import EditorLayout from '../components/layout/EditorLayout';
import Editor from '@monaco-editor/react';
import { fileService } from '../services/fileService';
import KeyboardShortcuts from '../components/editor/KeyboardShortcuts';
import StatusBar from '../components/editor/StatusBar';

const IdePage: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });

  const handleFileSelect = async (path: string) => {
    console.log('File selected:', path);
    setCurrentFile(path);
    setIsLoading(true);
    try {
      const { content } = await fileService.getFileContent(path);
      console.log('File content loaded:', content);
      setFileContent(content);
    } catch (error) {
      console.error('Error loading file content:', error);
      setFileContent('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && currentFile) {
      setFileContent(value);
      fileService.saveFile(currentFile, value).catch((error) => {
        console.error('Error saving file:', error);
      });
    }
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
      if (currentFile && editorInstance) {
        const content = editorInstance.getValue();
        fileService.saveFile(currentFile, content).catch((error) => {
          console.error('Error saving file:', error);
        });
      }
    }
    // Esc to close shortcuts
    if (event.key === 'Escape' && showShortcuts) {
      setShowShortcuts(false);
    }
  }, [currentFile, editorInstance, showShortcuts]);

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

  return (
    <EditorLayout onFileSelect={handleFileSelect}>
      <div className="flex flex-col h-full">
        {currentFile ? (
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                <div className="text-white">Loading file...</div>
              </div>
            ) : (
              <Editor
                height="100%"
                defaultLanguage="typescript"
                language={getLanguage(currentFile)}
                value={fileContent}
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
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a file to start editing
          </div>
        )}
        <StatusBar
          currentFile={currentFile}
          language={getLanguage(currentFile)}
          lineNumber={cursorPosition.lineNumber}
          column={cursorPosition.column}
        />
      </div>
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </EditorLayout>
  );
};

export default IdePage; 