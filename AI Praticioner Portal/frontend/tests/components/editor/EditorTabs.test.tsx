import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorTabs } from '../../../src/components/editor/EditorTabs';

describe('EditorTabs', () => {
  const mockTabs = [
    {
      path: '/src/main.py',
      content: 'print("Hello")',
      language: 'python',
      isModified: false,
    },
    {
      path: '/src/utils.py',
      content: 'def helper(): pass',
      language: 'python',
      isModified: true,
    },
  ];

  const mockOnTabSelect = jest.fn();
  const mockOnTabClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tabs with correct names', () => {
    render(
      <EditorTabs
        tabs={mockTabs}
        activeTab="/src/main.py"
        onTabSelect={mockOnTabSelect}
        onTabClose={mockOnTabClose}
      />
    );

    expect(screen.getByText('main.py')).toBeInTheDocument();
    expect(screen.getByText('utils.py')).toBeInTheDocument();
  });

  it('shows modified indicator for modified files', () => {
    render(
      <EditorTabs
        tabs={mockTabs}
        activeTab="/src/main.py"
        onTabSelect={mockOnTabSelect}
        onTabClose={mockOnTabClose}
      />
    );

    const utilsTab = screen.getByText('utils.py').parentElement;
    expect(utilsTab).toHaveTextContent('•');
  });

  it('calls onTabSelect when clicking a tab', () => {
    render(
      <EditorTabs
        tabs={mockTabs}
        activeTab="/src/main.py"
        onTabSelect={mockOnTabSelect}
        onTabClose={mockOnTabClose}
      />
    );

    fireEvent.click(screen.getByText('utils.py'));
    expect(mockOnTabSelect).toHaveBeenCalledWith('/src/utils.py');
  });

  it('calls onTabClose when clicking close button', () => {
    render(
      <EditorTabs
        tabs={mockTabs}
        activeTab="/src/main.py"
        onTabSelect={mockOnTabSelect}
        onTabClose={mockOnTabClose}
      />
    );

    const closeButton = screen.getByTestId('close-tab-utils.py');
    fireEvent.click(closeButton);
    expect(mockOnTabClose).toHaveBeenCalledWith('/src/utils.py');
  });

  it('applies active styles to the active tab', () => {
    render(
      <EditorTabs
        tabs={mockTabs}
        activeTab="/src/main.py"
        onTabSelect={mockOnTabSelect}
        onTabClose={mockOnTabClose}
      />
    );

    const activeTab = screen.getByText('main.py').parentElement;
    const inactiveTab = screen.getByText('utils.py').parentElement;

    expect(activeTab).toHaveClass('bg-white');
    expect(inactiveTab).toHaveClass('bg-gray-800');
  });
}); 