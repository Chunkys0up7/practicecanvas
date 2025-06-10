import React, { useState } from 'react';
import EditorLayout from '../components/layout/EditorLayout';
import Editor from '@monaco-editor/react';
import { fileService } from '../services/fileService';

const IdePage: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileSelect = async (path: string) => {
    setCurrentFile(path);
    try {
      const { content } = await fileService.getFileContent(path);
      setFileContent(content);
    } catch (error) {
      setFileContent('');
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && currentFile) {
      setFileContent(value);
      fileService.saveFile(currentFile, value).catch(() => {});
    }
  };

  return (
    <EditorLayout onFileSelect={handleFileSelect}>
      {currentFile ? (
        <Editor
          height="100%"
          defaultLanguage="typescript"
          language={currentFile.split('.').pop()?.toLowerCase()}
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
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select a file to start editing
        </div>
      )}
    </EditorLayout>
  );
};

export default IdePage; 