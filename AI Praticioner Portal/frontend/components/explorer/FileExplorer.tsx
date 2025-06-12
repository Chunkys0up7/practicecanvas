import React, { useState, useEffect } from 'react';
import { fileService } from '../../services/fileService';
import { FileNode } from '../../types/file';
import CreateFileModal from './CreateFileModal';

interface FileExplorerProps {
  onFileSelect?: (path: string) => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  node: FileNode;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  console.log('FileExplorer: onFileSelect prop =', onFileSelect);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [fileStructure, setFileStructure] = useState<FileNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);
  const [isCreateFileModalOpen, setIsCreateFileModalOpen] = useState(false);
  const [createFileParentPath, setCreateFileParentPath] = useState('');

  useEffect(() => {
    loadFileStructure();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

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
      showToast('Failed to load file structure', 'error');
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
    setCreateFileParentPath(parentPath);
    setIsCreateFileModalOpen(true);
  };

  const handleCreateFileSubmit = async (name: string, content: string) => {
    if (isOperationInProgress) return;
    
    const path = `${createFileParentPath}/${name}`;
    setIsOperationInProgress(true);
    try {
      await fileService.createFile(path, content);
      await loadFileStructure();
      showToast('File created successfully', 'success');
    } catch (error) {
      console.error('Error creating file:', error);
      showToast(error instanceof Error ? error.message : 'Failed to create file', 'error');
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const handleCreateDirectory = async (parentPath: string) => {
    if (isOperationInProgress) return;
    
    const name = prompt('Enter directory name:');
    if (!name) return;

    const path = `${parentPath}/${name}`;
    setIsOperationInProgress(true);
    try {
      await fileService.createDirectory(path);
      await loadFileStructure();
      showToast('Directory created successfully', 'success');
    } catch (error) {
      console.error('Error creating directory:', error);
      showToast(error instanceof Error ? error.message : 'Failed to create directory', 'error');
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const handleDelete = async (path: string, type: 'file' | 'directory') => {
    if (isOperationInProgress) return;
    
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    setIsOperationInProgress(true);
    try {
      if (type === 'file') {
        await fileService.deleteFile(path);
      } else {
        await fileService.deleteDirectory(path);
      }
      await loadFileStructure();
      showToast(`${type === 'file' ? 'File' : 'Directory'} deleted successfully`, 'success');
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showToast(error instanceof Error ? error.message : `Failed to delete ${type}`, 'error');
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const handleRename = async (oldPath: string, type: 'file' | 'directory') => {
    if (isOperationInProgress) return;
    
    const newName = prompt('Enter new name:');
    if (!newName) return;

    const newPath = oldPath.substring(0, oldPath.lastIndexOf('/') + 1) + newName;
    setIsOperationInProgress(true);
    try {
      await fileService.renameFile(oldPath, newPath);
      await loadFileStructure();
      showToast(`${type === 'file' ? 'File' : 'Directory'} renamed successfully`, 'success');
    } catch (error) {
      console.error(`Error renaming ${type}:`, error);
      showToast(error instanceof Error ? error.message : `Failed to rename ${type}`, 'error');
    } finally {
      setIsOperationInProgress(false);
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
    <div className="p-2 relative" data-testid="file-explorer">
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
      {toast.visible && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {toast.message}
        </div>
      )}
      {isOperationInProgress && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="text-white">Processing...</div>
        </div>
      )}
      <CreateFileModal
        isOpen={isCreateFileModalOpen}
        onClose={() => setIsCreateFileModalOpen(false)}
        onCreate={handleCreateFileSubmit}
        parentPath={createFileParentPath}
      />
    </div>
  );
};

export default FileExplorer; 