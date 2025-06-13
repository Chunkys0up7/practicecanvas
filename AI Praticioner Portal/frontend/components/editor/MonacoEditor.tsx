import React from 'react';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  theme?: string;
  onEditorMounted?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ value, language, onChange, theme = 'vs-dark', onEditorMounted }) => {
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
    // Configure editor options
    editor.updateOptions({
      formatOnType: true,
      formatOnPaste: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: {
        enabled: true,
      },
      minimap: {
        enabled: true,
        showSlider: 'mouseover',
      },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      folding: true,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 3,
      glyphMargin: true,
      contextmenu: true,
      mouseWheelZoom: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
    });

    // Enable diagnostics for TypeScript/JavaScript
    if (language === 'typescript' || language === 'javascript') {
      monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
        noSuggestionDiagnostics: false,
      });
    }

    if (onEditorMounted) {
      onEditorMounted(editor);
    }
  };

  return (
    <div className="h-full" data-testid="monaco-editor-container">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <span className="text-sm text-gray-400" data-testid="editor-language">{language}</span>
      </div>
      <Editor
        height="calc(100% - 40px)"
        defaultLanguage={language}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          formatOnType: true,
          formatOnPaste: true,
        }}
        data-testid="monaco-editor"
      />
    </div>
  );
};

export default MonacoEditor; 