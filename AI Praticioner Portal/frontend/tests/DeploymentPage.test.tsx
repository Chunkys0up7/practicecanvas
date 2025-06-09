import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DeploymentPage from '../pages/DeploymentPage';

describe('DeploymentPage', () => {
  it('renders the Deployment Environments heading', async () => {
    render(
      <BrowserRouter>
        <DeploymentPage />
      </BrowserRouter>
    );
    expect(await screen.findByRole('heading', { name: /deployment environments/i })).toBeInTheDocument();
  });
}); 