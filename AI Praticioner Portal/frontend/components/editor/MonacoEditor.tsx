import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ value, language, onChange }) => {
  return (
    <div className="h-full" data-testid="monaco-editor-container">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <span className="text-sm text-gray-400" data-testid="editor-language">{language}</span>
      </div>
      <Editor
        height="calc(100% - 40px)"
        defaultLanguage={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          scrollBeyondLastLine: false,
          automaticLayout: true,
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
        data-testid="monaco-editor"
      />
    </div>
  );
};

export default MonacoEditor; 