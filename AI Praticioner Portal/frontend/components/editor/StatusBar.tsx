import React from 'react';

interface StatusBarProps {
  currentFile: string | null;
  language: string;
  lineNumber: number;
  column: number;
  encoding?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  currentFile,
  language,
  lineNumber,
  column,
  encoding = 'UTF-8'
}) => {
  return (
    <div className="h-6 bg-gray-800 border-t border-gray-700 flex items-center px-4 text-xs text-gray-400">
      <div className="flex-1 flex items-center space-x-4">
        {currentFile && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">File:</span>
            <span className="text-gray-300">{currentFile}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Language:</span>
          <span className="text-gray-300">{language}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Ln</span>
          <span className="text-gray-300">{lineNumber}</span>
          <span className="text-gray-500">Col</span>
          <span className="text-gray-300">{column}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Encoding:</span>
          <span className="text-gray-300">{encoding}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar; 