import React, { useState } from 'react';
import FileExplorer from '../explorer/FileExplorer';
import AgentChat from '../agent/AgentChat';
import CodeAnalysis from '../agent/CodeAnalysis';
import AgentTools from '../agent/AgentTools';

interface EditorLayoutProps {
  onFileSelect?: (path: string) => void;
  children: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ onFileSelect, children }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'analysis' | 'tools'>('chat');

  // Logging for debugging
  console.log('EditorLayout render: children =', children);
  console.log('Rendering main editor area', children);
  console.log('Rendering right sidebar, activeTab =', activeTab);

  return (
    <div className="h-screen flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Explorer</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <FileExplorer onFileSelect={onFileSelect} />
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          {children}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'chat'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'analysis'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            Analysis
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'tools'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('tools')}
          >
            Tools
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <AgentChat />}
          {activeTab === 'analysis' && <CodeAnalysis content="" />}
          {activeTab === 'tools' && <AgentTools />}
        </div>
      </div>
    </div>
  );
};

export default EditorLayout; 