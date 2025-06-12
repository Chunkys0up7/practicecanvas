import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditorToolbar } from '../../../components/editor/EditorToolbar';

describe('EditorToolbar', () => {
  const mockOnSave = jest.fn();
  const mockOnFormat = jest.fn();
  const mockOnSettings = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all toolbar buttons', () => {
    render(
      <EditorToolbar
        onSave={mockOnSave}
        onFormat={mockOnFormat}
        onSettings={mockOnSettings}
        isDirty={false}
      />
    );

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Format')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', () => {
    render(
      <EditorToolbar
        onSave={mockOnSave}
        onFormat={mockOnFormat}
        onSettings={mockOnSettings}
        isDirty={true}
      />
    );

    fireEvent.click(screen.getByText('Save'));
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('calls onFormat when format button is clicked', () => {
    render(
      <EditorToolbar
        onSave={mockOnSave}
        onFormat={mockOnFormat}
        onSettings={mockOnSettings}
        isDirty={false}
      />
    );

    fireEvent.click(screen.getByText('Format'));
    expect(mockOnFormat).toHaveBeenCalledTimes(1);
  });

  it('calls onSettings when settings button is clicked', () => {
    render(
      <EditorToolbar
        onSave={mockOnSave}
        onFormat={mockOnFormat}
        onSettings={mockOnSettings}
        isDirty={false}
      />
    );

    fireEvent.click(screen.getByText('Settings'));
    expect(mockOnSettings).toHaveBeenCalledTimes(1);
  });

  it('shows save indicator when isDirty is true', () => {
    render(
      <EditorToolbar
        onSave={mockOnSave}
        onFormat={mockOnFormat}
        onSettings={mockOnSettings}
        isDirty={true}
      />
    );

    const saveButton = screen.getByText('Save');
    expect(saveButton).not.toBeDisabled();
  });

  it('does not show save indicator when isDirty is false', () => {
    render(
      <EditorToolbar
        onSave={mockOnSave}
        onFormat={mockOnFormat}
        onSettings={mockOnSettings}
        isDirty={false}
      />
    );

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });
}); 