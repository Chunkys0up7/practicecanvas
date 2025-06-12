import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewFileDialog } from '../../../src/components/editor/NewFileDialog';

describe('NewFileDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog when isOpen is true', () => {
    render(
      <NewFileDialog
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    );

    expect(screen.getByText('Create New File')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter file name...')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <NewFileDialog
        isOpen={false}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    );

    expect(screen.queryByText('Create New File')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <NewFileDialog
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows error when trying to create file without name', () => {
    render(
      <NewFileDialog
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    );

    fireEvent.click(screen.getByText('Create'));
    expect(screen.getByText('File name is required')).toBeInTheDocument();
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('shows error when file name contains invalid characters', () => {
    render(
      <NewFileDialog
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    );

    const input = screen.getByPlaceholderText('Enter file name...');
    fireEvent.change(input, { target: { value: 'invalid/file/name.py' } });
    fireEvent.click(screen.getByText('Create'));

    expect(screen.getByText('Invalid file name')).toBeInTheDocument();
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('calls onCreate with valid file name', () => {
    render(
      <NewFileDialog
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    );

    const input = screen.getByPlaceholderText('Enter file name...');
    fireEvent.change(input, { target: { value: 'valid_file.py' } });
    fireEvent.click(screen.getByText('Create'));

    expect(mockOnCreate).toHaveBeenCalledWith('valid_file.py');
  });

  it('clears error when input changes', () => {
    render(
      <NewFileDialog
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    );

    // First, create an error
    fireEvent.click(screen.getByText('Create'));
    expect(screen.getByText('File name is required')).toBeInTheDocument();

    // Then, change the input
    const input = screen.getByPlaceholderText('Enter file name...');
    fireEvent.change(input, { target: { value: 'test.py' } });

    // Error should be cleared
    expect(screen.queryByText('File name is required')).not.toBeInTheDocument();
  });

  it('focuses input when dialog opens', () => {
    render(
      <NewFileDialog
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    );

    const input = screen.getByPlaceholderText('Enter file name...');
    expect(input).toHaveFocus();
  });
}); 