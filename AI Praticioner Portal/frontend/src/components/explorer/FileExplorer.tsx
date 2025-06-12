import React, { useState, useEffect } from 'react';
import { fileService } from '../../services/fileService';

interface FileExplorerProps {
  onFileSelect: (filePath: string) => void;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeFileStructure = (structure: any): FileNode[] => {
    console.log('Normalizing file structure:', JSON.stringify(structure, null, 2));
    
    // If structure is not an array, wrap it in an array
    const structureArray = Array.isArray(structure) ? structure : [structure];
    
    // Ensure each node has the required properties
    return structureArray.map((node: any) => ({
      name: node.name || '',
      path: node.path || '/',
      type: node.type || 'file',
      children: node.children ? normalizeFileStructure(node.children) : undefined
    }));
  };

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setIsLoading(true);
        const structure = await fileService.getFileStructure();
        console.log('Loaded file structure:', JSON.stringify(structure, null, 2));
        const normalizedStructure = normalizeFileStructure(structure);
        console.log('Normalized file structure:', JSON.stringify(normalizedStructure, null, 2));
        setFileStructure(normalizedStructure);
        setError(null);
      } catch (error) {
        console.error('Error loading file structure:', error);
        setError('Failed to load file structure');
      } finally {
        setIsLoading(false);
      }
    };
    loadFiles();
  }, []);

  const renderFileNode = (node: FileNode, level: number = 0) => {
    console.log('Rendering node:', { 
      name: node.name, 
      type: node.type, 
      level,
      path: node.path,
      hasChildren: !!node.children,
      childrenCount: node.children?.length,
      fullNode: node
    });

    const isDirectory = node.type === 'directory';
    const paddingLeft = `${level * 1.5}rem`;
    const icon = isDirectory ? '📂' : '📄';

    return (
      <div key={node.path}>
        <div
          className="flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer"
          role="button"
          style={{ paddingLeft, zIndex: 10 }}
          tabIndex={0}
          onClick={() => !isDirectory && onFileSelect(node.path)}
          data-testid={!isDirectory ? `file-name-${node.name}` : undefined}
        >
          <span className="mr-2">{icon}</span>
          <span>{node.name}</span>
        </div>
        {isDirectory && node.children && (
          <div>
            {node.children.map((child) => renderFileNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2 relative" data-testid="file-explorer">
      {isLoading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        fileStructure.map((node) => renderFileNode(node))
      )}
    </div>
  );
};

export default FileExplorer; 