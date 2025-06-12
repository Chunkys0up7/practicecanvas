import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MonacoEditor from '../../src/components/MonacoEditor';

describe('MonacoEditor', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: '',
    language: 'typescript',
    onChange: mockOnChange,
    theme: 'vs-dark',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MonacoEditor {...defaultProps} />);
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
  });

  it('initializes with correct language', () => {
    render(<MonacoEditor {...defaultProps} language="python" />);
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveAttribute('data-language', 'python');
  });

  it('initializes with correct theme', () => {
    render(<MonacoEditor {...defaultProps} theme="vs-light" />);
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveAttribute('data-theme', 'vs-light');
  });

  it('handles value changes', () => {
    render(<MonacoEditor {...defaultProps} value="test code" />);
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveAttribute('data-value', 'test code');
  });

  it('calls onChange when content is modified', () => {
    render(<MonacoEditor {...defaultProps} />);
    const editor = screen.getByTestId('monaco-editor');
    fireEvent.change(editor, { target: { value: 'new code' } });
    expect(mockOnChange).toHaveBeenCalledWith('new code');
  });

  it('supports different languages', () => {
    const languages = ['typescript', 'python', 'javascript'];
    languages.forEach(lang => {
      const { unmount } = render(<MonacoEditor {...defaultProps} language={lang} />);
      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveAttribute('data-language', lang);
      unmount();
    });
  });
}); 