import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AgentBuilderPage from '../pages/AgentBuilderPage';

describe('AgentBuilderPage', () => {
  it('renders the Agent Builder heading', async () => {
    render(
      <BrowserRouter>
        <AgentBuilderPage />
      </BrowserRouter>
    );
    expect(await screen.findByText(/agent builder/i)).toBeInTheDocument();
  });
}); 