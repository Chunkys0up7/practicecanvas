export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export interface FileContent {
  content: string;
  language: string;
}

export interface FileOperation {
  type: 'create' | 'delete' | 'rename';
  path: string;
  newPath?: string;
  content?: string;
} 