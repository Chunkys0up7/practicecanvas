import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateFileModal from '../../../components/explorer/CreateFileModal';

describe('CreateFileModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onCreate: jest.fn(),
    parentPath: '/project',
  };

  it('disables Create button for empty file name', () => {
    render(<CreateFileModal {...defaultProps} />);
    const createBtn = screen.getByRole('button', { name: /create/i });
    expect(createBtn).toBeDisabled();
  });

  it('shows error for whitespace-only file name', () => {
    render(<CreateFileModal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/enter file name/i);
    fireEvent.change(input, { target: { value: '   ' } });
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    expect(screen.getByText(/file name is required/i)).toBeInTheDocument();
  });

  it('shows error for file name with / or \\', () => {
    render(<CreateFileModal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/enter file name/i);
    fireEvent.change(input, { target: { value: 'bad/name' } });
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    expect(screen.getByText(/invalid file name/i)).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'bad\\name' } });
    fireEvent.click(createBtn);
    expect(screen.getByText(/invalid file name/i)).toBeInTheDocument();
  });
}); 