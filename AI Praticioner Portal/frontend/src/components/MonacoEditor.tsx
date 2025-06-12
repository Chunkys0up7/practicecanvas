import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  theme?: string;
  onEditorMounted?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language,
  onChange,
  theme = 'vs-dark',
  onEditorMounted,
}) => {
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
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

    // Configure language-specific settings
    if (language === 'typescript' || language === 'javascript') {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
        noSuggestionDiagnostics: false,
      });
    }

    // Call the onEditorMounted callback if provided
    if (onEditorMounted) {
      onEditorMounted(editor);
    }
  };

  return (
    <div data-testid="monaco-editor" data-language={language} data-theme={theme} data-value={value}>
      <Editor
        height="100%"
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
      />
    </div>
  );
};

export default MonacoEditor; 