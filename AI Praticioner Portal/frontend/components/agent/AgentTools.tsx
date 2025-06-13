import React, { useState } from 'react';
import { useAgent } from '../../contexts/AgentContext';
import { generateCode } from '../../services/geminiService';
import { html as diff2htmlHtml } from 'diff2html';

interface Tool {
  name: string;
  description: string;
  icon: string;
  action: () => void;
}

const AgentTools: React.FC = () => {
  const { currentAgent, isAgentActive } = useAgent();
  const [showTestGenModal, setShowTestGenModal] = useState(false);
  const [testGenPrompt, setTestGenPrompt] = useState('');
  const [testGenLoading, setTestGenLoading] = useState(false);
  const [testGenResult, setTestGenResult] = useState('');
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [diffHtml, setDiffHtml] = useState('');

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
        action: () => setShowTestGenModal(true)
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

      {/* Test Generation Modal */}
      {showTestGenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-lg font-bold mb-2 text-white">Generate Test Suite</h2>
            <p className="text-gray-400 mb-2">Describe the requirements for the test suite:</p>
            <textarea
              className="w-full h-24 p-2 rounded bg-gray-700 text-white mb-2"
              value={testGenPrompt}
              onChange={e => setTestGenPrompt(e.target.value)}
              placeholder="e.g. The function should return the sum of two numbers, handle negative inputs, and throw on non-numeric input."
              disabled={testGenLoading}
            />
            <div className="flex space-x-2 mb-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                onClick={async () => {
                  setTestGenLoading(true);
                  setTestGenResult('');
                  const { code } = await generateCode({
                    prompt: `Write a Python unittest or pytest suite for the following requirements: ${testGenPrompt}`,
                    language: 'Python',
                  });
                  setTestGenResult(code);
                  setTestGenLoading(false);
                }}
                disabled={testGenLoading || !testGenPrompt.trim()}
              >
                {testGenLoading ? 'Generating...' : 'Generate'}
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded"
                onClick={() => setShowTestGenModal(false)}
                disabled={testGenLoading}
              >Cancel</button>
            </div>
            {testGenResult && (
              <div className="bg-gray-900 rounded p-2 mb-2 text-xs text-green-300 whitespace-pre overflow-x-auto max-h-48">
                {testGenResult}
              </div>
            )}
            {testGenResult && (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                onClick={() => {
                  // Show diff modal for approval
                  // For demo, compare with empty string (replace with current test file content if available)
                  const oldCode = '';
                  const newCode = testGenResult;
                  const diffString = `--- old\n+++ new\n@@\n-${oldCode}\n+${newCode}`;
                  const diffHtmlString = diff2htmlHtml(diffString, { drawFileList: false, outputFormat: 'side-by-side' });
                  setDiffHtml(diffHtmlString);
                  setShowDiffModal(true);
                }}
              >Review & Insert</button>
            )}
          </div>
        </div>
      )}

      {showDiffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-3xl p-6">
            <h2 className="text-lg font-bold mb-2 text-white">Review AI-Generated Test Diff</h2>
            <div className="overflow-x-auto mb-4" style={{ maxHeight: '400px' }}>
              <div dangerouslySetInnerHTML={{ __html: diffHtml }} />
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                onClick={() => {
                  // Approve: copy to clipboard and close
                  navigator.clipboard.writeText(testGenResult);
                  setShowDiffModal(false);
                  setShowTestGenModal(false);
                }}
              >Approve & Copy</button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                onClick={() => setShowDiffModal(false)}
              >Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentTools; 