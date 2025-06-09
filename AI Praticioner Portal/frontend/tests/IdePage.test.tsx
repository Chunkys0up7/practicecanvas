import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IdePage from '../pages/IdePage';

describe('IdePage', () => {
  it('renders the IDE heading', () => {
    render(
      <BrowserRouter>
        <IdePage />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /ide/i })).toBeInTheDocument();
  });
}); 