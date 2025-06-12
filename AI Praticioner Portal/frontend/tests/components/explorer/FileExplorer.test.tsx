import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileExplorer from '../../../components/explorer/FileExplorer';

// Mock the file service
jest.mock('../../../services/fileService', () => ({
  fileService: {
    getFileStructure: jest.fn().mockResolvedValue({
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
            { name: 'utils.py', path: 'project/src/utils.py', type: 'file' }
          ]
        }
      ]
    })
  }
}));

describe('FileExplorer', () => {
  it('renders the file structure', async () => {
    render(<FileExplorer onFileSelect={() => {}} />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading file structure...')).not.toBeInTheDocument();
    });
    
    // Check for root directory
    expect(screen.getByText('project')).toBeInTheDocument();
    
    // Check for subdirectories
    expect(screen.getByText('src')).toBeInTheDocument();
  });

  it('expands and collapses directories', async () => {
    render(<FileExplorer onFileSelect={() => {}} />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading file structure...')).not.toBeInTheDocument();
    });
    
    // Initially, files should not be visible
    expect(screen.queryByText('main.py')).not.toBeInTheDocument();
    
    // Click to expand src directory
    fireEvent.click(screen.getByText('src'));
    
    // Files should now be visible
    expect(screen.getByText('main.py')).toBeInTheDocument();
    expect(screen.getByText('utils.py')).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(screen.getByText('src'));
    
    // Files should be hidden again
    expect(screen.queryByText('main.py')).not.toBeInTheDocument();
  });

  it('calls onFileSelect when a file is clicked', async () => {
    const onFileSelect = jest.fn();
    render(<FileExplorer onFileSelect={onFileSelect} />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading file structure...')).not.toBeInTheDocument();
    });
    
    // Expand src directory
    fireEvent.click(screen.getByText('src'));
    
    // Click on a file
    fireEvent.click(screen.getByText('main.py'));
    
    // Check that onFileSelect was called with the correct path
    expect(onFileSelect).toHaveBeenCalledWith('project/src/main.py');
  });
}); 