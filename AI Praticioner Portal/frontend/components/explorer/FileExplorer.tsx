import React, { useState, useEffect } from 'react';
import { fileService } from '../../services/fileService';
import { FileNode } from '../../types/file';

interface FileExplorerProps {
  onFileSelect?: (path: string) => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  node: FileNode;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  console.log('FileExplorer: onFileSelect prop =', onFileSelect);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [fileStructure, setFileStructure] = useState<FileNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  useEffect(() => {
    loadFileStructure();
  }, []);

  const loadFileStructure = async () => {
    try {
      const structure = await fileService.getFileStructure();
      setFileStructure(structure);
      // Expand the root directory by default
      if (structure && structure.path) {
        setExpandedDirs(new Set([structure.path]));
      }
    } catch (error) {
      console.error('Error loading file structure:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDirectory = (path: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node
    });
  };

  const handleCreateFile = async (parentPath: string) => {
    const name = prompt('Enter file name:');
    if (!name) return;

    const path = `${parentPath}/${name}`;
    try {
      await fileService.createFile(path);
      await loadFileStructure();
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const handleCreateDirectory = async (parentPath: string) => {
    const name = prompt('Enter directory name:');
    if (!name) return;

    const path = `${parentPath}/${name}`;
    try {
      await fileService.createDirectory(path);
      await loadFileStructure();
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  };

  const handleDelete = async (path: string, type: 'file' | 'directory') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      if (type === 'file') {
        await fileService.deleteFile(path);
      } else {
        // TODO: Implement directory deletion
      }
      await loadFileStructure();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleRename = async (oldPath: string, type: 'file' | 'directory') => {
    const newName = prompt('Enter new name:');
    if (!newName) return;

    const newPath = oldPath.substring(0, oldPath.lastIndexOf('/') + 1) + newName;
    try {
      await fileService.renameFile(oldPath, newPath);
      await loadFileStructure();
    } catch (error) {
      console.error(`Error renaming ${type}:`, error);
    }
  };

  // Add event listener to close context menu on click elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  const renderFileNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedDirs.has(node.path);
    const paddingLeft = `${level * 1.5}rem`;

    if (node.type === 'directory') {
      return (
        <div key={node.path}>
          <div
            className="flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer"
            style={{ paddingLeft, zIndex: 10 }}
            tabIndex={0}
            role="button"
            onClick={() => toggleDirectory(node.path)}
            onContextMenu={(e) => handleContextMenu(e, node)}
          >
            <span className="mr-2">{isExpanded ? '📂' : '📁'}</span>
            <span>{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map(child => renderFileNode(child, level + 1))}
              <div className="flex space-x-2 px-2" style={{ paddingLeft }}>
                <button
                  className="text-xs text-gray-400 hover:text-white"
                  onClick={() => handleCreateFile(node.path)}
                >
                  + File
                </button>
                <button
                  className="text-xs text-gray-400 hover:text-white"
                  onClick={() => handleCreateDirectory(node.path)}
                >
                  + Directory
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className="flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer"
        style={{ paddingLeft, zIndex: 10 }}
        tabIndex={0}
        role="button"
        onClick={() => {
          console.log('File node clicked:', node.path);
          onFileSelect?.(node.path);
        }}
        onContextMenu={(e) => handleContextMenu(e, node)}
      >
        <span className="mr-2">📄</span>
        <span>{node.name}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 text-gray-400">
        Loading file structure...
      </div>
    );
  }

  if (!fileStructure) {
    return (
      <div className="p-4 text-gray-400">
        No files found
      </div>
    );
  }

  return (
    <div className="p-2">
      {renderFileNode(fileStructure)}
      {contextMenu && (
        <div
          className="fixed bg-gray-800 border border-gray-700 rounded shadow-lg py-2 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {contextMenu.node.type === 'directory' && (
            <>
              <button
                className="block w-full px-4 py-1 text-left hover:bg-gray-700"
                onClick={() => {
                  handleCreateFile(contextMenu.node.path);
                  setContextMenu(null);
                }}
              >
                New File
              </button>
              <button
                className="block w-full px-4 py-1 text-left hover:bg-gray-700"
                onClick={() => {
                  handleCreateDirectory(contextMenu.node.path);
                  setContextMenu(null);
                }}
              >
                New Folder
              </button>
            </>
          )}
          <button
            className="block w-full px-4 py-1 text-left hover:bg-gray-700"
            onClick={() => {
              handleRename(contextMenu.node.path, contextMenu.node.type);
              setContextMenu(null);
            }}
          >
            Rename
          </button>
          <button
            className="block w-full px-4 py-1 text-left hover:bg-gray-700 text-red-400"
            onClick={() => {
              handleDelete(contextMenu.node.path, contextMenu.node.type);
              setContextMenu(null);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default FileExplorer; 