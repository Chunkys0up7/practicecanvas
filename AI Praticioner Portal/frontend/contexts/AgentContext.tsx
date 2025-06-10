import React, { createContext, useContext, useState } from 'react';

export interface Capability {
  name: string;
  description: string;
}

export interface Agent {
  language: string;
  description: string;
  icon: string;
  capabilities: Capability[];
}

interface AgentContextType {
  currentAgent: Agent | null;
  isAgentActive: boolean;
  setCurrentAgent: (agent: Agent) => void;
}

const AgentContext = createContext<AgentContextType>({
  currentAgent: null,
  isAgentActive: false,
  setCurrentAgent: () => {}
});

export const useAgent = () => useContext(AgentContext);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);

  return (
    <AgentContext.Provider
      value={{
        currentAgent,
        isAgentActive: currentAgent !== null,
        setCurrentAgent
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}; 