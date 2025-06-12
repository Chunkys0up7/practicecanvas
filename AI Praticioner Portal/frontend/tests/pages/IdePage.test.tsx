// Mock MonacoEditor at the very top
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange, language, options }: any) => (
    <textarea
      data-testid="editor-textarea"
      data-language={language}
      data-options={JSON.stringify(options)}
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
    />
  )
}));

// Mock the fileService before any imports
const mockFileService = {
  getFileStructure: jest.fn().mockResolvedValue({
    name: 'root',
    path: '/',
    type: 'directory',
    children: [
      {
        name: 'src',
        path: '/src',
        type: 'directory',
        children: [
          { name: 'main.py', path: '/src/main.py', type: 'file' },
          { name: 'utils.py', path: '/src/utils.py', type: 'file' }
        ]
      }
    ]
  }),
  getFileContent: jest.fn().mockResolvedValue({ content: 'print("Hello, World!")' }),
  saveFile: jest.fn().mockResolvedValue({ success: true }),
  createFile: jest.fn().mockResolvedValue({ success: true })
};

jest.mock('../../src/services/fileService', () => ({
  fileService: mockFileService
}));

// Mock the CommandPalette component with proper state management
jest.mock('../../src/components/editor/CommandPalette', () => ({
  __esModule: true,
  default: ({ commands, onClose, isOpen }: { commands: any[], onClose: () => void, isOpen: boolean }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="command-palette">
        <input data-testid="command-palette-input" />
        <div data-testid="command-list">
          {commands.map((cmd) => (
            <div key={cmd.id} data-testid={`command-${cmd.id}`}>
              {cmd.title}
            </div>
          ))}
        </div>
      </div>
    );
  },
}));

// Mock the NewFileDialog component with proper state management
const MockNewFileDialog = ({ isOpen, onClose, onCreateFile }: any) => {
  const [fileName, setFileName] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      const input = document.querySelector('[data-testid="new-file-input"]') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
    if (e.target.value.includes('/')) {
      setError('Invalid file name');
    } else {
      setError('');
    }
  };

  const handleCreate = () => {
    if (!error && fileName) {
      onCreateFile(fileName);
      onClose();
    }
  };

  return (
    <div data-testid="new-file-dialog" role="dialog">
      <input
        data-testid="new-file-input"
        value={fileName}
        onChange={handleInputChange}
      />
      {error && <div data-testid="new-file-error">{error}</div>}
      <button data-testid="create-button" onClick={handleCreate} disabled={!!error || !fileName}>
        Create
      </button>
      <button data-testid="cancel-button" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
};

jest.mock('../../src/components/editor/NewFileDialog', () => ({
  NewFileDialog: MockNewFileDialog
}));

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IdePage from '../../pages/IdePage';
import { act } from 'react-dom/test-utils';

describe('IdePage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // Reset any DOM state
    document.body.innerHTML = '';
  });

  afterEach(() => {
    cleanup();
  });

  // Helper function to expand directory and wait for files to be visible
  const expandDirectory = async () => {
    await waitFor(() => {
      expect(screen.queryByText('Loading file structure...')).not.toBeInTheDocument();
    });

    const srcDir = screen.getByText('src');
    fireEvent.click(srcDir);
    
    await waitFor(() => {
      expect(screen.getByText('main.py')).toBeInTheDocument();
    });
  };

  // Helper function to open command palette
  const openCommandPalette = async () => {
    // Simulate Ctrl+P to open command palette
    fireEvent.keyDown(document, { key: 'p', ctrlKey: true });
    
    // Wait for the state update to be processed
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Wait for the command palette to appear
    const commandPalette = await screen.findByTestId('command-palette');
    expect(commandPalette).toBeInTheDocument();
    return commandPalette;
  };

  // Helper function to create a new file
  const createNewFile = async (fileName: string) => {
    // Open command palette and click "New File" command
    await openCommandPalette();
    const newFileCommand = screen.getByTestId('command-new-file');
    fireEvent.click(newFileCommand);

    // Fill in the new file dialog
    const input = screen.getByTestId('new-file-input');
    fireEvent.change(input, { target: { value: fileName } });
    fireEvent.click(screen.getByTestId('new-file-submit'));
  };

  it('renders the IDE interface', () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    // Verify basic IDE elements are present
    expect(screen.getByTestId('file-explorer')).toBeInTheDocument();
    expect(screen.getByTestId('command-palette')).toBeInTheDocument();
  });

  it('loads and displays file content when a file is selected', async () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await expandDirectory();
    fireEvent.click(screen.getByText('main.py'));

    await waitFor(() => {
      expect(screen.getByTestId('editor-textarea')).toHaveValue('print("Hello, World!")');
    });
  });

  it('handles file save correctly', async () => {
    const mockContent = 'print("Hello, World!")';
    mockFileService.getFileContent.mockResolvedValueOnce({ content: mockContent });
    
    render(<IdePage />);
    await expandDirectory();
    
    fireEvent.click(screen.getByText('main.py'));
    
    const editor = screen.getByTestId('editor-textarea');
    fireEvent.change(editor, { target: { value: mockContent } });
    
    fireEvent.keyDown(document, { key: 's', ctrlKey: true });
    
    await waitFor(() => {
      expect(mockFileService.saveFile).toHaveBeenCalledWith('/src/main.py', mockContent);
    });
  });

  it('shows loading state while file is being loaded', async () => {
    render(<IdePage />);
    await expandDirectory();
    
    fireEvent.click(screen.getByText('main.py'));
    
    expect(screen.getByText('Loading file...')).toBeInTheDocument();
  });

  it('handles file loading errors gracefully', async () => {
    mockFileService.getFileContent.mockRejectedValueOnce(new Error('Failed to load file'));
    
    render(<IdePage />);
    await expandDirectory();
    
    fireEvent.click(screen.getByText('main.py'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load file')).toBeInTheDocument();
    });
  });

  it('allows switching between multiple files', async () => {
    mockFileService.getFileContent
      .mockResolvedValueOnce({ content: 'print("Hello from main.py")' })
      .mockResolvedValueOnce({ content: 'print("Hello from utils.py")' });
    
    render(<IdePage />);
    await expandDirectory();
    
    fireEvent.click(screen.getByText('main.py'));
    await waitFor(() => {
      expect(screen.getByTestId('editor-textarea')).toHaveValue('print("Hello from main.py")');
    });
    
    fireEvent.click(screen.getByText('utils.py'));
    await waitFor(() => {
      expect(screen.getByTestId('editor-textarea')).toHaveValue('print("Hello from utils.py")');
    });
  });

  it('handles editor content changes', async () => {
    const initialContent = 'print("Hello, World!")';
    const newContent = 'print("New content")';
    
    mockFileService.getFileContent.mockResolvedValueOnce({ content: initialContent });
    
    render(<IdePage />);
    await expandDirectory();
    
    fireEvent.click(screen.getByText('main.py'));
    
    const editor = screen.getByTestId('editor-textarea');
    fireEvent.change(editor, { target: { value: newContent } });
    
    fireEvent.keyDown(document, { key: 's', ctrlKey: true });
    
    await waitFor(() => {
      expect(mockFileService.saveFile).toHaveBeenCalledWith('/src/main.py', newContent);
    });
  });

  it('shows keyboard shortcuts dialog when pressing Ctrl/Cmd + K', async () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('file-explorer')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('applies correct syntax highlighting based on file type', async () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await expandDirectory();
    
    // Test Python file
    fireEvent.click(screen.getByText('main.py'));
    await waitFor(() => {
      const editor = screen.getByTestId('editor-textarea');
      expect(editor).toHaveAttribute('data-language', 'python');
    });

    // Test TypeScript file
    fireEvent.click(screen.getByText('utils.py'));
    await waitFor(() => {
      const editor = screen.getByTestId('editor-textarea');
      expect(editor).toHaveAttribute('data-language', 'typescript');
    });
  });

  it('configures editor with linting and formatting options', async () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await expandDirectory();
    fireEvent.click(screen.getByText('main.py'));

    await waitFor(() => {
      const editor = screen.getByTestId('editor-textarea');
      const options = JSON.parse(editor.getAttribute('data-options') || '{}');
      expect(options.formatOnType).toBe(true);
      expect(options.formatOnPaste).toBe(true);
      expect(options.minimap).toBeDefined();
      expect(options.lightbulb).toBeDefined();
    });
  });

  it('displays linting errors in the editor', async () => {
    const codeWithError = 'print("Hello World"  # Missing closing parenthesis';
    mockFileService.getFileContent.mockResolvedValueOnce({ content: codeWithError });
    
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await expandDirectory();
    fireEvent.click(screen.getByText('main.py'));

    await waitFor(() => {
      expect(screen.getByTestId('editor-textarea')).toHaveValue(codeWithError);
      // Note: Actual error display would be handled by Monaco Editor internally
      // We're just verifying the editor is configured to show errors
      const editor = screen.getByTestId('editor-textarea');
      const options = JSON.parse(editor.getAttribute('data-options') || '{}');
      expect(options.lightbulb).toBeDefined();
    });
  });

  it('supports multiple open files in tabs', async () => {
    mockFileService.getFileContent
      .mockResolvedValueOnce({ content: 'print("Hello from main.py")' })
      .mockResolvedValueOnce({ content: 'print("Hello from utils.py")' });
    
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await expandDirectory();
    
    // Open first file
    fireEvent.click(screen.getByText('main.py'));
    await waitFor(() => {
      expect(screen.getByTestId('editor-textarea')).toHaveValue('print("Hello from main.py")');
    });
    
    // Open second file
    fireEvent.click(screen.getByText('utils.py'));
    await waitFor(() => {
      expect(screen.getByTestId('editor-textarea')).toHaveValue('print("Hello from utils.py")');
    });

    // Verify both tabs are visible
    expect(screen.getByText('main.py')).toBeInTheDocument();
    expect(screen.getByText('utils.py')).toBeInTheDocument();
  });

  it('allows switching between open files using tabs', async () => {
    mockFileService.getFileContent
      .mockResolvedValueOnce({ content: 'print("Hello from main.py")' })
      .mockResolvedValueOnce({ content: 'print("Hello from utils.py")' });
    
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await expandDirectory();
    
    // Open both files
    fireEvent.click(screen.getByText('main.py'));
    fireEvent.click(screen.getByText('utils.py'));
    
    // Switch back to main.py using tab
    fireEvent.click(screen.getByText('main.py'));
    await waitFor(() => {
      expect(screen.getByTestId('editor-textarea')).toHaveValue('print("Hello from main.py")');
    });
  });

  it('allows closing tabs', async () => {
    mockFileService.getFileContent
      .mockResolvedValueOnce({ content: 'print("Hello from main.py")' })
      .mockResolvedValueOnce({ content: 'print("Hello from utils.py")' });
    
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await expandDirectory();
    
    // Open both files
    fireEvent.click(screen.getByText('main.py'));
    fireEvent.click(screen.getByText('utils.py'));
    
    // Close utils.py tab
    const closeButton = screen.getByTestId('close-tab-utils.py');
    fireEvent.click(closeButton);
    
    // Verify utils.py tab is removed
    expect(screen.queryByText('utils.py')).not.toBeInTheDocument();
    // Verify main.py tab is still present
    expect(screen.getByText('main.py')).toBeInTheDocument();
  });

  it('maintains file content when switching between tabs', async () => {
    const mainContent = 'print("Hello from main.py")';
    const utilsContent = 'print("Hello from utils.py")';
    const modifiedMainContent = 'print("Modified main.py")';
    
    mockFileService.getFileContent
      .mockResolvedValueOnce({ content: mainContent })
      .mockResolvedValueOnce({ content: utilsContent });
    
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await expandDirectory();
    
    // Open both files
    fireEvent.click(screen.getByText('main.py'));
    fireEvent.click(screen.getByText('utils.py'));
    
    // Modify main.py content
    fireEvent.click(screen.getByText('main.py'));
    const editor = screen.getByTestId('editor-textarea');
    fireEvent.change(editor, { target: { value: modifiedMainContent } });
    
    // Switch to utils.py and back to main.py
    fireEvent.click(screen.getByText('utils.py'));
    fireEvent.click(screen.getByText('main.py'));
    
    // Verify main.py content is preserved
    await waitFor(() => {
      expect(screen.getByTestId('editor-textarea')).toHaveValue(modifiedMainContent);
    });
  });

  it('creates a new file through command palette', async () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await createNewFile('test.py');

    await waitFor(() => {
      expect(mockFileService.createFile).toHaveBeenCalledWith('/src/test.py');
      expect(screen.getByText('test.py')).toBeInTheDocument();
    });
  });

  it('validates new file name', async () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await openCommandPalette();
    const input = screen.getByTestId('command-palette-input');
    fireEvent.change(input, { target: { value: 'new file' } });

    await waitFor(() => {
      expect(screen.getByTestId('new-file-dialog')).toBeInTheDocument();
    });

    const fileInput = screen.getByTestId('new-file-input');
    fireEvent.change(fileInput, { target: { value: 'invalid/name.py' } });

    expect(screen.getByTestId('new-file-error')).toHaveTextContent('Invalid file name');
    expect(screen.getByTestId('create-button')).toBeDisabled();
  });

  it('cancels new file creation', async () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    // Open command palette and click "New File" command
    await openCommandPalette();
    const newFileCommand = screen.getByTestId('command-new-file');
    fireEvent.click(newFileCommand);

    // Click cancel button
    fireEvent.click(screen.getByTestId('new-file-cancel'));
    expect(screen.queryByTestId('new-file-dialog')).not.toBeInTheDocument();
  });

  it('creates new file with correct language based on extension', async () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    await createNewFile('test.py');
    expect(screen.getByText('Python')).toBeInTheDocument();
  });
}); 