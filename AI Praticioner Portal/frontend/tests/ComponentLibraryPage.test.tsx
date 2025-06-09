import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ComponentLibraryPage from '../pages/ComponentLibraryPage';

describe('ComponentLibraryPage', () => {
  it('renders the Component Library heading', async () => {
    render(
      <BrowserRouter>
        <ComponentLibraryPage />
      </BrowserRouter>
    );
    expect(await screen.findByRole('heading', { name: /component library/i })).toBeInTheDocument();
  });
}); 