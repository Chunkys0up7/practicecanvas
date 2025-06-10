import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ value, language, onChange }) => {
  return (
    <div className="h-full">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <span className="text-sm text-gray-400">{language}</span>
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
        }}
      />
    </div>
  );
};

export default MonacoEditor; 