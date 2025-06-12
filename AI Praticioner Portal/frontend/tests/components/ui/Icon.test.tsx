import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from '../../../components/ui/Icon';

describe('Icon', () => {
  it('renders the correct icon', () => {
    render(<Icon name="save" className="w-5 h-5" />);
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Icon name="save" className="custom-class" />);
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toHaveClass('custom-class');
  });

  it('handles missing icon gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    render(<Icon name="nonexistent" />);
    expect(consoleSpy).toHaveBeenCalledWith('Icon "nonexistent" not found');
    consoleSpy.mockRestore();
  });

  it('renders different icons correctly', () => {
    const { rerender } = render(<Icon name="save" />);
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();

    rerender(<Icon name="settings" />);
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();

    rerender(<Icon name="format" />);
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });
}); 