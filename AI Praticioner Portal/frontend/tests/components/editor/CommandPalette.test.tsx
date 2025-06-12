import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommandPalette from '../../../src/components/editor/CommandPalette';

describe('CommandPalette', () => {
  const mockCommands = [
    {
      id: 'new-file',
      title: 'New File',
      description: 'Create a new file',
      shortcut: 'Ctrl+N',
      action: jest.fn(),
    },
    {
      id: 'save-file',
      title: 'Save File',
      description: 'Save the current file',
      shortcut: 'Ctrl+S',
      action: jest.fn(),
    },
    {
      id: 'open-file',
      title: 'Open File',
      description: 'Open an existing file',
      shortcut: 'Ctrl+O',
      action: jest.fn(),
    },
  ];

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders command palette with all commands', () => {
    render(
      <CommandPalette
        commands={mockCommands}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('New File')).toBeInTheDocument();
    expect(screen.getByText('Save File')).toBeInTheDocument();
    expect(screen.getByText('Open File')).toBeInTheDocument();
  });

  it('filters commands based on search input', async () => {
    render(
      <CommandPalette
        commands={mockCommands}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const searchInput = screen.getByPlaceholderText('Type a command or search...');
    fireEvent.change(searchInput, { target: { value: 'save' } });

    await waitFor(() => {
      expect(screen.getByText('Save File')).toBeInTheDocument();
      expect(screen.queryByText('New File')).not.toBeInTheDocument();
      expect(screen.queryByText('Open File')).not.toBeInTheDocument();
    });
  });

  it('executes command action when clicked', () => {
    render(
      <CommandPalette
        commands={mockCommands}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText('Save File'));
    expect(mockCommands[1].action).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes when clicking outside', () => {
    render(<CommandPalette commands={mockCommands} onClose={mockOnClose} isOpen={true} />);
    
    // Create and dispatch a click event on the document body
    const clickEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    document.body.dispatchEvent(clickEvent);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('navigates through commands using keyboard', () => {
    render(<CommandPalette commands={mockCommands} onClose={mockOnClose} isOpen={true} />);
    
    // Press down arrow to select first command
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(screen.getByText('New File').parentElement).toHaveClass('bg-white');

    // Press down arrow again to select second command
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(screen.getByText('Save File').parentElement).toHaveClass('bg-white');
  });

  it('displays keyboard shortcuts', () => {
    render(
      <CommandPalette
        commands={mockCommands}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Ctrl+N')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+S')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+O')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <CommandPalette
        commands={mockCommands}
        isOpen={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('New File')).not.toBeInTheDocument();
  });
}); 