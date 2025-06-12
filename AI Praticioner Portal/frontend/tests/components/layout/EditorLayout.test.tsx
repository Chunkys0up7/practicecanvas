import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import EditorLayout from '../../../components/layout/EditorLayout';

// Mock the FileExplorer component
jest.mock('../../../components/explorer/FileExplorer', () => {
  return function MockFileExplorer() {
    return <div data-testid="file-explorer">File Explorer</div>;
  };
});

describe('EditorLayout', () => {
  it('renders the layout with all sections', () => {
    render(
      <EditorLayout onFileSelect={() => {}}>
        <div>Test Content</div>
      </EditorLayout>
    );

    // Check for sidebar sections
    expect(screen.getByText('Explorer')).toBeInTheDocument();
    expect(screen.getByTestId('file-explorer')).toBeInTheDocument();

    // Check for right sidebar sections
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();

    // Check that children are rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
}); 