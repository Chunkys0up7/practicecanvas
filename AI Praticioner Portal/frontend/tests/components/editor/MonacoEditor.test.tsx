import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import MonacoEditor from '../../../components/editor/MonacoEditor';

// Mock the Monaco Editor component
jest.mock('@monaco-editor/react', () => {
  return function MockEditor({ value, language, onChange }: any) {
    return (
      <div data-testid="monaco-editor">
        <div data-testid="editor-language">{language}</div>
        <textarea
          data-testid="editor-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  };
});

describe('MonacoEditor', () => {
  const defaultProps = {
    value: 'test code',
    language: 'typescript',
    onChange: jest.fn(),
  };

  it('renders with correct language', () => {
    render(<MonacoEditor {...defaultProps} />);
    expect(screen.getAllByTestId('editor-language')[0]).toHaveTextContent('typescript');
  });

  it('displays the provided code', () => {
    render(<MonacoEditor {...defaultProps} />);
    expect(screen.getByTestId('editor-input')).toHaveValue('test code');
  });

  it('handles empty value', () => {
    render(<MonacoEditor {...defaultProps} value="" />);
    expect(screen.getByTestId('editor-input')).toHaveValue('');
  });

  it('handles different languages', () => {
    render(<MonacoEditor {...defaultProps} language="python" />);
    expect(screen.getAllByTestId('editor-language')[0]).toHaveTextContent('python');
  });

  it('maintains editor container height', () => {
    render(<MonacoEditor {...defaultProps} />);
    expect(screen.getByTestId('monaco-editor-container')).toHaveClass('h-full');
  });
}); 