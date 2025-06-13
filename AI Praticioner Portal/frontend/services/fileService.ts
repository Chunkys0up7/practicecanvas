import { FileNode, FileContent } from '../types/file';
import { getFileStructure, getFileContent, createFile, saveFile, deleteFile, createDirectory, deleteDirectory } from './apiService';

// Mock file structure and content for frontend-only development
const mockFileStructure: FileNode = {
  name: 'root',
  path: '/',
  type: 'directory',
  children: [
    {
      name: 'src',
      path: '/src',
      type: 'directory',
      children: [
        { name: 'main.py', path: '/src/main.py', type: 'file', children: [] },
        { name: 'utils.py', path: '/src/utils.py', type: 'file', children: [] }
      ]
    },
    {
      name: 'tests',
      path: '/tests',
      type: 'directory',
      children: [
        { name: 'test_main.py', path: '/tests/test_main.py', type: 'file', children: [] }
      ]
    }
  ]
};

const mockFileContents: Record<string, string> = {
  '/src/main.py': 'print("Hello, World!")',
  '/src/utils.py': 'def helper():\n    pass',
  '/tests/test_main.py': 'def test_main():\n    assert True'
};

class FileService {
  async getFileStructure(): Promise<FileNode> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFileStructure;
  }

  async getFileContent(path: string): Promise<FileContent> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { content: mockFileContents[path] || '', language: 'python' };
  }

  async createFile(path: string, content: string = ''): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    mockFileContents[path] = content;
    // Add to mock structure (simple flat add for demo)
    // In a real mock, update the tree structure
  }

  async createDirectory(path: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Not implemented for brevity
  }

  async deleteFile(path: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    delete mockFileContents[path];
    // Remove from mock structure (not implemented for brevity)
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Update mock contents
    const content = mockFileContents[oldPath];
    if (content) {
      mockFileContents[newPath] = content;
      delete mockFileContents[oldPath];
    }
    
    // Update mock structure
    const oldParts = oldPath.split('/');
    const newParts = newPath.split('/');
    let current = mockFileStructure;
    
    for (let i = 1; i < oldParts.length - 1; i++) {
      const dir = current.children?.find(c => c.name === oldParts[i]);
      if (dir && dir.type === 'directory') {
        current = dir;
      }
    }
    
    if (current.children) {
      const node = current.children.find(c => c.name === oldParts[oldParts.length - 1]);
      if (node) {
        node.name = newParts[newParts.length - 1];
        node.path = newPath;
      }
    }
  }

  async saveFile(path: string, content: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    mockFileContents[path] = content;
  }

  async deleteDirectory(path: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Not implemented for brevity
  }
}

export const fileService = new FileService(); 