import React from 'react';

export interface EditorTab {
  path: string;
  content: string;
  language: string;
  isModified: boolean;
}

interface EditorTabsProps {
  tabs: EditorTab[];
  activeTab: string | null;
  onTabSelect: (path: string) => void;
  onTabClose: (path: string) => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({
  tabs,
  activeTab,
  onTabSelect,
  onTabClose
}) => {
  const getFileName = (path: string): string => {
    return path.split('/').pop() || path;
  };

  return (
    <div className="flex border-b border-gray-200 bg-gray-50">
      {tabs.map((tab) => (
        <div
          key={tab.path}
          className={`flex items-center px-4 py-2 border-r border-gray-200 cursor-pointer ${
            activeTab === tab.path ? 'bg-white border-b-0' : 'hover:bg-gray-100'
          }`}
          onClick={() => onTabSelect(tab.path)}
        >
          <span className="mr-2">{getFileName(tab.path)}</span>
          {tab.isModified && <span className="text-blue-500">•</span>}
          <button
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.path);
            }}
            data-testid={`close-tab-${getFileName(tab.path)}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}; 