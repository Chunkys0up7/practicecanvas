export interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
}

export interface AgentConfiguration {
  language: string;
  capabilities: AgentCapability[];
  description: string;
  icon: string;
}

export const AGENT_CONFIGURATIONS: Record<string, AgentConfiguration> = {
  python: {
    language: 'python',
    description: 'Python Development Assistant',
    icon: '🐍',
    capabilities: [
      {
        name: 'Code Analysis',
        description: 'Analyze Python code for best practices and potential issues',
        enabled: true
      },
      {
        name: 'Test Generation',
        description: 'Generate unit tests for Python code',
        enabled: true
      },
      {
        name: 'Documentation',
        description: 'Generate docstrings and documentation',
        enabled: true
      }
    ]
  },
  typescript: {
    language: 'typescript',
    description: 'TypeScript Development Assistant',
    icon: '📘',
    capabilities: [
      {
        name: 'Type Checking',
        description: 'Help with TypeScript type definitions and checking',
        enabled: true
      },
      {
        name: 'React Components',
        description: 'Assist with React component development',
        enabled: true
      },
      {
        name: 'Testing',
        description: 'Help with Jest and React Testing Library',
        enabled: true
      }
    ]
  },
  javascript: {
    language: 'javascript',
    description: 'JavaScript Development Assistant',
    icon: '📜',
    capabilities: [
      {
        name: 'Code Analysis',
        description: 'Analyze JavaScript code for best practices',
        enabled: true
      },
      {
        name: 'React Components',
        description: 'Assist with React component development',
        enabled: true
      },
      {
        name: 'Testing',
        description: 'Help with Jest and React Testing Library',
        enabled: true
      }
    ]
  },
  html: {
    language: 'html',
    description: 'HTML Development Assistant',
    icon: '🌐',
    capabilities: [
      {
        name: 'Structure Analysis',
        description: 'Analyze HTML structure and semantics',
        enabled: true
      },
      {
        name: 'Accessibility',
        description: 'Check and improve accessibility',
        enabled: true
      },
      {
        name: 'SEO',
        description: 'Optimize for search engines',
        enabled: true
      }
    ]
  },
  css: {
    language: 'css',
    description: 'CSS Development Assistant',
    icon: '🎨',
    capabilities: [
      {
        name: 'Style Analysis',
        description: 'Analyze CSS for best practices',
        enabled: true
      },
      {
        name: 'Responsive Design',
        description: 'Help with responsive layouts',
        enabled: true
      },
      {
        name: 'Animations',
        description: 'Assist with CSS animations',
        enabled: true
      }
    ]
  }
}; 