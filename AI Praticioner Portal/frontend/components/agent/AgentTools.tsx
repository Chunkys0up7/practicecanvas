import React from 'react';
import { useAgent } from '../../contexts/AgentContext';

interface Tool {
  name: string;
  description: string;
  icon: string;
  action: () => void;
}

const AgentTools: React.FC = () => {
  const { currentAgent, isAgentActive } = useAgent();

  const getTools = (): Tool[] => {
    if (!currentAgent) return [];

    const commonTools: Tool[] = [
      {
        name: 'Format Code',
        description: 'Format the current file according to language standards',
        icon: '✨',
        action: () => console.log('Format code')
      },
      {
        name: 'Generate Tests',
        description: 'Generate unit tests for the current file',
        icon: '🧪',
        action: () => console.log('Generate tests')
      },
      {
        name: 'Documentation',
        description: 'Generate documentation for the current file',
        icon: '📝',
        action: () => console.log('Generate documentation')
      }
    ];

    const languageSpecificTools: Record<string, Tool[]> = {
      python: [
        {
          name: 'Type Hints',
          description: 'Add type hints to Python functions',
          icon: '🔍',
          action: () => console.log('Add type hints')
        },
        {
          name: 'Import Organizer',
          description: 'Organize and sort Python imports',
          icon: '📦',
          action: () => console.log('Organize imports')
        }
      ],
      typescript: [
        {
          name: 'Interface Generator',
          description: 'Generate TypeScript interfaces from code',
          icon: '📋',
          action: () => console.log('Generate interfaces')
        },
        {
          name: 'React Component',
          description: 'Create a new React component',
          icon: '⚛️',
          action: () => console.log('Create component')
        }
      ],
      javascript: [
        {
          name: 'ESLint Fix',
          description: 'Fix ESLint issues automatically',
          icon: '🔧',
          action: () => console.log('Fix ESLint issues')
        },
        {
          name: 'React Component',
          description: 'Create a new React component',
          icon: '⚛️',
          action: () => console.log('Create component')
        }
      ],
      html: [
        {
          name: 'Accessibility Check',
          description: 'Check HTML for accessibility issues',
          icon: '♿',
          action: () => console.log('Check accessibility')
        },
        {
          name: 'SEO Optimizer',
          description: 'Optimize HTML for search engines',
          icon: '🔍',
          action: () => console.log('Optimize SEO')
        }
      ],
      css: [
        {
          name: 'CSS Linter',
          description: 'Check CSS for best practices',
          icon: '🎨',
          action: () => console.log('Lint CSS')
        },
        {
          name: 'Responsive Helper',
          description: 'Add responsive design utilities',
          icon: '📱',
          action: () => console.log('Add responsive utilities')
        }
      ]
    };

    return [
      ...commonTools,
      ...(languageSpecificTools[currentAgent.language] || [])
    ];
  };

  if (!isAgentActive) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a file to access tools
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-medium">Agent Tools</h3>
        <p className="text-sm text-gray-400">
          Tools specific to {currentAgent?.language} development
        </p>
      </div>

      {/* Tools Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {getTools().map((tool, index) => (
            <button
              key={index}
              onClick={tool.action}
              className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">{tool.icon}</span>
                <h4 className="font-medium">{tool.name}</h4>
              </div>
              <p className="text-sm text-gray-400">{tool.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentTools; 