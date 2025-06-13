import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentChat from '../../../components/agent/AgentChat';

jest.mock('../../../contexts/AgentContext', () => ({
  useAgent: () => ({ currentAgent: { language: 'Python' }, isAgentActive: true })
}));

describe('AgentChat', () => {
  it('disables Send button for empty input', () => {
    render(<AgentChat />);
    const sendBtn = screen.getByRole('button', { name: /send/i });
    expect(sendBtn).toBeDisabled();
  });

  it('disables Send button for whitespace-only input', () => {
    render(<AgentChat />);
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: '   ' } });
    const sendBtn = screen.getByRole('button', { name: /send/i });
    expect(sendBtn).toBeDisabled();
  });

  it('enables Send button for valid input and sends message', () => {
    render(<AgentChat />);
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hello agent!' } });
    const sendBtn = screen.getByRole('button', { name: /send/i });
    expect(sendBtn).not.toBeDisabled();
    fireEvent.click(sendBtn);
    expect(screen.getByText('Hello agent!')).toBeInTheDocument();
  });
}); 