import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CodeGeneratorPage from '../pages/CodeGeneratorPage';

jest.mock('../services/geminiService', () => ({
  generateCode: jest.fn(() => Promise.resolve({ code: 'mock code', metadata: {} })),
}));

describe('CodeGeneratorPage', () => {
  it('renders the AI Code Generator heading', () => {
    render(
      <BrowserRouter>
        <CodeGeneratorPage />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /ai code generator/i })).toBeInTheDocument();
  });
}); 