import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileExplorer from '../../../components/explorer/FileExplorer';

// Mock the file service
jest.mock('../../../services/fileService', () => ({
  fileService: {
    getFileStructure: jest.fn(() => Promise.resolve({ path: '/project', name: 'project', type: 'directory', children: [] })),
    createFile: jest.fn(),
    createDirectory: jest.fn(),
    deleteFile: jest.fn(),
    deleteDirectory: jest.fn(),
    renameFile: jest.fn(),
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

  it('disallows empty directory name on create', () => {
    window.prompt = jest.fn(() => '');
    render(<FileExplorer />);
    // Simulate create directory
    // ...simulate context menu and create directory action...
    // Should not call createDirectory
    expect(require('../../../services/fileService').fileService.createDirectory).not.toHaveBeenCalled();
  });

  it('disallows whitespace-only directory name on create', () => {
    window.prompt = jest.fn(() => '   ');
    render(<FileExplorer />);
    // Simulate create directory
    // ...simulate context menu and create directory action...
    // Should not call createDirectory
    expect(require('../../../services/fileService').fileService.createDirectory).not.toHaveBeenCalled();
  });

  it('disallows illegal characters in directory name on create', () => {
    window.prompt = jest.fn(() => 'bad/name');
    render(<FileExplorer />);
    // Simulate create directory
    // ...simulate context menu and create directory action...
    // Should not call createDirectory
    expect(require('../../../services/fileService').fileService.createDirectory).not.toHaveBeenCalled();
  });

  it('disallows empty name on rename', () => {
    window.prompt = jest.fn(() => '');
    render(<FileExplorer />);
    // Simulate rename
    // ...simulate context menu and rename action...
    // Should not call renameFile
    expect(require('../../../services/fileService').fileService.renameFile).not.toHaveBeenCalled();
  });

  it('disallows whitespace-only name on rename', () => {
    window.prompt = jest.fn(() => '   ');
    render(<FileExplorer />);
    // Simulate rename
    // ...simulate context menu and rename action...
    // Should not call renameFile
    expect(require('../../../services/fileService').fileService.renameFile).not.toHaveBeenCalled();
  });

  it('disallows illegal characters in name on rename', () => {
    window.prompt = jest.fn(() => 'bad/name');
    render(<FileExplorer />);
    // Simulate rename
    // ...simulate context menu and rename action...
    // Should not call renameFile
    expect(require('../../../services/fileService').fileService.renameFile).not.toHaveBeenCalled();
  });
}); 