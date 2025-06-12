import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IdePage from '../pages/IdePage';

// Mock the Monaco Editor component
jest.mock('@monaco-editor/react', () => {
  return function MockEditor() {
    return <div data-testid="monaco-editor">Mock Editor</div>;
  };
});

// Mock the file service
jest.mock('../services/fileService', () => ({
  fileService: {
    getFileContent: jest.fn(),
    saveFile: jest.fn(),
  },
}));

describe('IdePage', () => {
  it('renders the IDE interface', () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );

    // Check for main components
    expect(screen.getByText('Explorer')).toBeInTheDocument();
    expect(screen.getByText('Select a file to start editing')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });
}); 