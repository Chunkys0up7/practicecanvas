import React, { useState, useEffect, useCallback } from 'react';
import MonacoEditor from '../components/MonacoEditor';
import EditorLayout from '../components/layout/EditorLayout';
import FileExplorer from '../components/explorer/FileExplorer';
import EditorTabs from '../components/editor/EditorTabs';
import CommandPalette, { Command } from '../components/editor/CommandPalette';
import { fileService } from '../services/fileService';
import * as monaco from 'monaco-editor';
import { NewFileDialog } from '../components/editor/NewFileDialog';

interface EditorTab {
  path: string;
  content: string;
  language: string;
  isModified: boolean;
}

export const IdePage: React.FC = () => {
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTab, setActiveTab] = useState<EditorTab | null>(null);
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);

  const getLanguageFromPath = (filePath: string): string => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py':
        return 'python';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      default:
        return 'plaintext';
    }
  };

  const handleFileSelect = async (filePath: string) => {
    try {
      setError(null);
      
      // Check if file is already open
      const existingTab = tabs.find(tab => tab.path === filePath);
      if (existingTab) {
        setActiveTab(tabs.find(tab => tab.path === filePath) as EditorTab);
        return;
      }

      const content = await fileService.getFileContent(filePath);
      const language = getLanguageFromPath(filePath);
      
      const newTab: EditorTab = {
        path: filePath,
        content,
        language,
        isModified: false,
      };

      setTabs(prevTabs => [...prevTabs, newTab]);
      setActiveTab(newTab);
    } catch (error) {
      console.error('Error loading file:', error);
      setError('Failed to load file');
    }
  };

  const handleTabSelect = (filePath: string) => {
    const tab = tabs.find(tab => tab.path === filePath);
    if (tab) {
      setActiveTab(tab);
    }
  };

  const handleTabClose = (filePath: string) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab.path !== filePath));
    if (activeTab && activeTab.path === filePath) {
      const remainingTabs = tabs.filter(tab => tab.path !== filePath);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : null);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeTab) {
      setTabs(prevTabs =>
        prevTabs.map(tab =>
          tab.path === activeTab.path
            ? { ...tab, content: value, isModified: true }
            : tab
        )
      );
    }
  };

  const saveFile = useCallback(async () => {
    if (!activeTab) return;

    const tabToSave = tabs.find(tab => tab.path === activeTab.path);
    if (!tabToSave) return;

    try {
      setIsSaving(true);
      setError(null);
      await fileService.saveFile(activeTab.path, tabToSave.content);
      
      setTabs(prevTabs =>
        prevTabs.map(tab =>
          tab.path === activeTab.path
            ? { ...tab, isModified: false }
            : tab
        )
      );
    } catch (error) {
      console.error('Error saving file:', error);
      setError('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  }, [activeTab, tabs]);

  const handleCreateNewFile = (fileName: string) => {
    const newTab: EditorTab = {
      path: fileName,
      content: '',
      language: getLanguageFromFileName(fileName),
      isModified: false
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab);
    setIsNewFileDialogOpen(false);
  };

  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py':
        return 'python';
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  const commands: Command[] = [
    {
      id: 'new-file',
      title: 'New File',
      description: 'Create a new file',
      shortcut: 'Ctrl/Cmd + N',
      action: () => setIsNewFileDialogOpen(true)
    },
    {
      id: 'save-file',
      title: 'Save File',
      description: 'Save the current file',
      shortcut: 'Ctrl+S',
      action: saveFile,
    },
    {
      id: 'open-file',
      title: 'Open File',
      description: 'Open an existing file',
      shortcut: 'Ctrl+O',
      action: () => {
        // TODO: Implement file opening
        console.log('Open file command');
      },
    },
    {
      id: 'close-file',
      title: 'Close File',
      description: 'Close the current file',
      shortcut: 'Ctrl+W',
      action: () => {
        if (activeTab) {
          handleTabClose(activeTab.path);
        }
      },
    },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
      }
      // Ctrl/Cmd + P to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveFile]);

  const handleEditorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
    setEditor(editor);
  };

  const activeTabData = tabs.find(tab => tab.path === activeTab?.path);

  return (
    <EditorLayout>
      <div className="flex flex-col h-full">
        {tabs.length > 0 && (
          <EditorTabs
            tabs={tabs}
            activeTab={activeTab?.path}
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
          />
        )}
        <div className="flex-1">
          {activeTabData ? (
            <MonacoEditor
              value={activeTabData.content}
              language={activeTabData.language}
              onChange={handleEditorChange}
              onEditorMounted={handleEditorMounted}
              data-testid="monaco-editor"
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a file to start editing
            </div>
          )}
        </div>
        <div className="h-6 bg-gray-800 border-t border-gray-700 flex items-center px-4 text-xs text-gray-400">
          <div className="flex-1 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Language:</span>
              <span className="text-gray-300">{activeTabData?.language || 'plaintext'}</span>
            </div>
            {error && (
              <div className="text-red-400">
                {error}
              </div>
            )}
            {isSaving && (
              <div className="text-yellow-400">
                Saving...
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Ln</span>
              <span className="text-gray-300">{editor?.getPosition()?.lineNumber || 1}</span>
              <span className="text-gray-500">Col</span>
              <span className="text-gray-300">{editor?.getPosition()?.column || 1}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Encoding:</span>
              <span className="text-gray-300">UTF-8</span>
            </div>
          </div>
        </div>
      </div>
      <CommandPalette
        commands={commands}
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <NewFileDialog
        isOpen={isNewFileDialogOpen}
        onClose={() => setIsNewFileDialogOpen(false)}
        onCreate={handleCreateNewFile}
      />
    </EditorLayout>
  );
};

export default IdePage; 