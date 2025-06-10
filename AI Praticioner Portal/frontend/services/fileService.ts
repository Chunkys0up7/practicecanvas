import { FileNode, FileContent } from '../types/file';

// Mock API calls for now
const mockFileStructure: FileNode = {
  name: 'project',
  path: 'project',
  type: 'directory',
  children: [
    {
      name: 'src',
      path: 'project/src',
      type: 'directory',
      children: [
        { name: 'main.py', path: 'project/src/main.py', type: 'file' },
        { name: 'utils.py', path: 'project/src/utils.py', type: 'file' },
        { name: 'index.tsx', path: 'project/src/index.tsx', type: 'file' },
        { name: 'styles.css', path: 'project/src/styles.css', type: 'file' }
      ]
    },
    {
      name: 'tests',
      path: 'project/tests',
      type: 'directory',
      children: [
        { name: 'test_main.py', path: 'project/tests/test_main.py', type: 'file' },
        { name: 'test_utils.py', path: 'project/tests/test_utils.py', type: 'file' }
      ]
    }
  ]
};

const mockFileContents: Record<string, string> = {
  'src/main.py': 'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()',
  'src/utils.py': 'def add(a: int, b: int) -> int:\n    return a + b',
  'src/index.tsx': 'import React from "react";\n\nexport const App = () => {\n  return <div>Hello World</div>;\n};',
  'src/styles.css': 'body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}',
  'tests/test_main.py': 'def test_main():\n    assert True',
  'tests/test_utils.py': 'def test_add():\n    assert add(1, 2) == 3'
};

const getLanguageFromPath = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'py':
      return 'python';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'yaml':
    case 'yml':
      return 'yaml';
    default:
      return 'plaintext';
  }
};

const getDefaultContent = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'py':
      return 'def main():\n    pass\n\nif __name__ == "__main__":\n    main()';
    case 'tsx':
      return 'import React from "react";\n\nexport const Component = () => {\n  return <div>Hello World</div>;\n};';
    case 'ts':
      return 'export const function = () => {\n  // Your code here\n};';
    case 'jsx':
      return 'import React from "react";\n\nexport const Component = () => {\n  return <div>Hello World</div>;\n};';
    case 'js':
      return '// Your code here';
    case 'css':
      return '/* Your styles here */';
    case 'html':
      return '<!DOCTYPE html>\n<html>\n<head>\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>';
    case 'json':
      return '{\n  \n}';
    case 'md':
      return '# Title\n\nContent goes here';
    case 'yaml':
    case 'yml':
      return '# YAML configuration';
    default:
      return '';
  }
};

class FileService {
  async getFileStructure(): Promise<FileNode> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockFileStructure;
  }

  async getFileContent(path: string): Promise<FileContent> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const content = mockFileContents[path] || '';
    const language = getLanguageFromPath(path);
    
    return { content, language };
  }

  async createFile(path: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Add to mock contents with default content
    mockFileContents[path] = getDefaultContent(path);
    
    // Update mock structure
    const parts = path.split('/');
    let current = mockFileStructure;
    
    for (let i = 1; i < parts.length - 1; i++) {
      const dir = current.children?.find(c => c.name === parts[i]);
      if (dir && dir.type === 'directory') {
        current = dir;
      }
    }
    
    if (!current.children) {
      current.children = [];
    }
    
    current.children.push({
      name: parts[parts.length - 1],
      path: path,
      type: 'file'
    });
  }

  async createDirectory(path: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Update mock structure
    const parts = path.split('/');
    let current = mockFileStructure;
    
    for (let i = 1; i < parts.length - 1; i++) {
      const dir = current.children?.find(c => c.name === parts[i]);
      if (dir && dir.type === 'directory') {
        current = dir;
      }
    }
    
    if (!current.children) {
      current.children = [];
    }
    
    current.children.push({
      name: parts[parts.length - 1],
      path: path,
      type: 'directory',
      children: []
    });
  }

  async deleteFile(path: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Remove from mock contents
    delete mockFileContents[path];
    
    // Update mock structure
    const parts = path.split('/');
    let current = mockFileStructure;
    
    for (let i = 1; i < parts.length - 1; i++) {
      const dir = current.children?.find(c => c.name === parts[i]);
      if (dir && dir.type === 'directory') {
        current = dir;
      }
    }
    
    if (current.children) {
      current.children = current.children.filter(c => c.name !== parts[parts.length - 1]);
    }
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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Update mock contents
    mockFileContents[path] = content;
  }
}

export const fileService = new FileService(); 