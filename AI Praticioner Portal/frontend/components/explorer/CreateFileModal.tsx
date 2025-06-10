import React, { useState } from 'react';

export interface FileTemplate {
  name: string;
  extension: string;
  description: string;
  content: string;
}

const fileTemplates: FileTemplate[] = [
  {
    name: 'Python',
    extension: 'py',
    description: 'Standard Python file with main function',
    content: 'def main():\n    pass\n\nif __name__ == "__main__":\n    main()'
  },
  {
    name: 'Streamlit',
    extension: 'py',
    description: 'Streamlit app with basic structure',
    content: 'import streamlit as st\n\ndef main():\n    st.title("My Streamlit App")\n    st.write("Hello, World!")\n\nif __name__ == "__main__":\n    main()'
  },
  {
    name: 'React Component',
    extension: 'tsx',
    description: 'React component with TypeScript',
    content: 'import React from "react";\n\ninterface Props {\n  // Add your props here\n}\n\nexport const Component: React.FC<Props> = () => {\n  return (\n    <div>\n      Hello World\n    </div>\n  );\n};'
  },
  {
    name: 'HTML',
    extension: 'html',
    description: 'Basic HTML template',
    content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    \n</body>\n</html>'
  },
  {
    name: 'CSS',
    extension: 'css',
    description: 'CSS stylesheet',
    content: '/* Your styles here */\n\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: sans-serif;\n}'
  },
  {
    name: 'JavaScript',
    extension: 'js',
    description: 'JavaScript module',
    content: '// Your JavaScript code here\n\nexport const function = () => {\n    // Implementation\n};'
  },
  {
    name: 'TypeScript',
    extension: 'ts',
    description: 'TypeScript module',
    content: '// Your TypeScript code here\n\nexport const function = (): void => {\n    // Implementation\n};'
  },
  {
    name: 'JSON',
    extension: 'json',
    description: 'JSON configuration file',
    content: '{\n    \n}'
  },
  {
    name: 'Markdown',
    extension: 'md',
    description: 'Markdown document',
    content: '# Title\n\n## Subtitle\n\nContent goes here.'
  },
  {
    name: 'YAML',
    extension: 'yml',
    description: 'YAML configuration file',
    content: '# YAML configuration\n\nkey: value\nlist:\n  - item1\n  - item2'
  }
];

interface CreateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, content: string) => void;
  parentPath: string;
}

const CreateFileModal: React.FC<CreateFileModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  parentPath
}) => {
  const [fileName, setFileName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<FileTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredTemplates = fileTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!fileName || !selectedTemplate) return;
    
    const fullName = fileName.endsWith(`.${selectedTemplate.extension}`)
      ? fileName
      : `${fileName}.${selectedTemplate.extension}`;
    
    onCreate(fullName, selectedTemplate.content);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[600px] max-h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4">Create New File</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Enter file name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Search Templates</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Search file templates..."
          />
        </div>

        <div className="flex-1 overflow-y-auto mb-4">
          <div className="grid grid-cols-1 gap-2">
            {filteredTemplates.map((template) => (
              <button
                key={template.name}
                onClick={() => setSelectedTemplate(template)}
                className={`p-3 text-left rounded border ${
                  selectedTemplate?.name === template.name
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-gray-400">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!fileName || !selectedTemplate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFileModal; 