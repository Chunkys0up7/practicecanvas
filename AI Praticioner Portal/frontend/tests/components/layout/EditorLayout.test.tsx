import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import EditorLayout from '../../../components/layout/EditorLayout';

describe('EditorLayout', () => {
  it('renders the layout with all sections', () => {
    render(
      <EditorLayout>
        <div>Test Content</div>
      </EditorLayout>
    );

    // Check for sidebar sections
    expect(screen.getByText('Explorer')).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('Agent Tools')).toBeInTheDocument();

    // Check for right sidebar sections
    expect(screen.getByText('Test Results')).toBeInTheDocument();
    expect(screen.getByText('Agent Chat')).toBeInTheDocument();

    // Check that children are rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
}); 