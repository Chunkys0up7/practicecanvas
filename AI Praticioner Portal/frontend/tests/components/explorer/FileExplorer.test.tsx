import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileExplorer from '../../../components/explorer/FileExplorer';

describe('FileExplorer', () => {
  it('renders the file structure', () => {
    render(<FileExplorer />);
    
    // Check for root directory
    expect(screen.getByText('project')).toBeInTheDocument();
    
    // Check for subdirectories
    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('tests')).toBeInTheDocument();
  });

  it('expands and collapses directories', () => {
    render(<FileExplorer />);
    
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

  it('calls onFileSelect when a file is clicked', () => {
    const onFileSelect = jest.fn();
    render(<FileExplorer onFileSelect={onFileSelect} />);
    
    // Expand src directory
    fireEvent.click(screen.getByText('src'));
    
    // Click on a file
    fireEvent.click(screen.getByText('main.py'));
    
    // Check that onFileSelect was called with the correct path
    expect(onFileSelect).toHaveBeenCalledWith('project/src/main.py');
  });
}); 