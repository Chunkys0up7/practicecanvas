import React from 'react';

interface EditorLayoutProps {
  children: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex">
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Explorer</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* File explorer will be added here */}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="flex border-b border-gray-700">
          <button className="flex-1 px-4 py-2 text-sm font-medium bg-gray-700 text-white">
            Chat
          </button>
          <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
            Analysis
          </button>
          <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
            Tools
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a file to start chatting
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLayout; 