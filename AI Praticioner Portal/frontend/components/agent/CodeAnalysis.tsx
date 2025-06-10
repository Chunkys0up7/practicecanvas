import React, { useEffect, useState } from 'react';
import { useAgent } from '../../contexts/AgentContext';

interface AnalysisResult {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  line?: number;
  suggestion?: string;
}

interface Props {
  content: string;
}

const CodeAnalysis: React.FC<Props> = ({ content }) => {
  const { currentAgent, isAgentActive } = useAgent();
  const [analysis, setAnalysis] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!isAgentActive || !content) {
      setAnalysis([]);
      return;
    }

    const analyzeCode = async () => {
      setIsAnalyzing(true);
      // TODO: Implement actual code analysis
      // This is a mock analysis for demonstration
      setTimeout(() => {
        const mockAnalysis: AnalysisResult[] = [
          {
            type: 'warning',
            message: 'Consider adding type hints to function parameters',
            line: 5,
            suggestion: 'Add type annotations to improve code clarity'
          },
          {
            type: 'info',
            message: 'Function is well-documented',
            line: 10
          },
          {
            type: 'error',
            message: 'Unused import detected',
            line: 2,
            suggestion: 'Remove unused import to improve code cleanliness'
          }
        ];
        setAnalysis(mockAnalysis);
        setIsAnalyzing(false);
      }, 1000);
    };

    analyzeCode();
  }, [content, isAgentActive]);

  if (!isAgentActive) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a file to analyze
      </div>
    );
  }

  const getIcon = (type: AnalysisResult['type']) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
    }
  };

  const getColor = (type: AnalysisResult['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-medium">Code Analysis</h3>
        <p className="text-sm text-gray-400">
          Analysis for {currentAgent?.language} code
        </p>
      </div>

      {/* Analysis Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        ) : analysis.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No issues found in the code
          </div>
        ) : (
          <div className="space-y-4">
            {analysis.map((result, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-start space-x-2">
                  <span className="text-xl">{getIcon(result.type)}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${getColor(result.type)}`}>
                      {result.message}
                    </p>
                    {result.line && (
                      <p className="text-sm text-gray-400">
                        Line {result.line}
                      </p>
                    )}
                    {result.suggestion && (
                      <p className="text-sm text-gray-300 mt-1">
                        Suggestion: {result.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeAnalysis; 