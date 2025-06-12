interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

class FileService {
  private mockFileStructure: FileNode[] = [
    {
      name: 'src',
      path: '/src',
      type: 'directory',
      children: [
        {
          name: 'main.py',
          path: '/src/main.py',
          type: 'file'
        },
        {
          name: 'utils.py',
          path: '/src/utils.py',
          type: 'file'
        }
      ]
    },
    {
      name: 'tests',
      path: '/tests',
      type: 'directory',
      children: [
        {
          name: 'test_main.py',
          path: '/tests/test_main.py',
          type: 'file'
        }
      ]
    }
  ];

  private mockFileContents: { [key: string]: string } = {
    '/src/main.py': 'print("Hello, World!")',
    '/src/utils.py': 'def helper():\n    pass',
    '/tests/test_main.py': 'def test_main():\n    assert True'
  };

  async getFileStructure(): Promise<FileNode[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockFileStructure;
  }

  async getFileContent(filePath: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const content = this.mockFileContents[filePath];
    if (!content) {
      throw new Error(`File not found: ${filePath}`);
    }
    return content;
  }

  async saveFile(filePath: string, content: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    this.mockFileContents[filePath] = content;
  }
}

export const fileService = new FileService(); 