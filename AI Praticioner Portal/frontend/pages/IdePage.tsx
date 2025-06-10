import React, { useState, useEffect } from 'react';
import EditorLayout from '../components/layout/EditorLayout';
import Editor from '@monaco-editor/react';
import { fileService } from '../services/fileService';

const IdePage: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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
      {currentFile ? (
        <div className="h-full relative">
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
                insertSpaces: true
              }}
            />
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select a file to start editing
        </div>
      )}
    </EditorLayout>
  );
};

export default IdePage; 