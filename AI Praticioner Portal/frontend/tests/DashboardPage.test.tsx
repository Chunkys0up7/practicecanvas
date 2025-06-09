import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

describe('DashboardPage', () => {
  it('renders the Dashboard heading', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('renders the New Project button', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    expect(await screen.findByRole('button', { name: /new project/i })).toBeInTheDocument();
  });
}); 