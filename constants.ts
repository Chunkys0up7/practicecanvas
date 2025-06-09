
import { Home, Blocks, Bot, Code2, Layers, Settings, Zap, Database, Terminal, FileText, Brain, LayoutDashboard, Share2, CloudCog } from 'lucide-react';
import { ComponentType } from './types';

export const NAV_ITEMS = [
  { name: 'Dashboard', href: '#/', icon: LayoutDashboard },
  { name: 'Component Library', href: '#/components', icon: Blocks },
  { name: 'Agent Builder', href: '#/builder', icon: Share2 },
  { name: 'Code Generator', href: '#/codegen', icon: Code2 },
  { name: 'Deployment', href: '#/deploy', icon: CloudCog },
];

export const MOCK_PROJECTS = [
  { id: 'proj_abc123', name: 'Customer Support Bot', lastModified: '2025-06-09T14:30:00Z', description: 'Automated chatbot for handling customer queries using advanced LLMs.', components: ['llm-gpt4', 'db-pgvector'], thumbnailUrl: 'https://picsum.photos/seed/proj1/300/200', template: 'support-agent-v2' },
  { id: 'proj_def456', name: 'Data Analysis Pipeline', lastModified: '2025-06-08T10:15:00Z', description: 'Processes and analyzes large datasets to extract actionable insights.', components: ['data-csv-parser', 'analytics-pandas', 'viz-matplotlib'], thumbnailUrl: 'https://picsum.photos/seed/proj2/300/200' },
  { id: 'proj_ghi789', name: 'Content Generation Engine', lastModified: '2025-06-07T18:45:00Z', description: 'Generates creative content for marketing campaigns and social media.', components: ['llm-claude', 'prompt-enhancer'], thumbnailUrl: 'https://picsum.photos/seed/proj3/300/200', template: 'creative-writer-v1' },
];

export const MOCK_COMPONENTS = [
  { id: 'llm-gpt4', name: 'GPT-4 Turbo', type: ComponentType.LLM, description: 'Advanced Large Language Model from OpenAI.', version: '1.0.0', inputs: ['prompt', 'temperature'], outputs: ['completion'], compatibility: ['>=v2.3.0'], documentationUrl: '#', category: 'Language Models', icon: Brain },
  { id: 'db-pgvector', name: 'PostgreSQL Vector DB', type: ComponentType.Database, description: 'Vector database for similarity search.', version: '0.5.0', inputs: ['vector', 'query'], outputs: ['results'], category: 'Data Sources', icon: Database },
  { id: 'data-csv-parser', name: 'CSV Parser', type: ComponentType.Tool, description: 'Parses CSV files into structured data.', version: '1.2.0', inputs: ['file_path'], outputs: ['data_frame'], category: 'Data Processing', icon: FileText },
  { id: 'prompt-enhancer', name: 'Prompt Enhancer', type: ComponentType.Tool, description: 'Optimizes prompts for better LLM performance.', version: '0.8.0', inputs: ['raw_prompt'], outputs: ['enhanced_prompt'], category: 'Utilities', icon: Zap },
  { id: 'basic-input', name: 'Text Input', type: ComponentType.Input, description: 'Basic text input node.', version: '1.0.0', outputs: ['text'], category: 'Inputs & Outputs', icon: Terminal },
  { id: 'text-output', name: 'Text Output', type: ComponentType.Output, description: 'Displays text output.', version: '1.0.0', inputs: ['text'], category: 'Inputs & Outputs', icon: Terminal },
];

export const COMPONENT_TYPE_COLORS: Record<ComponentType, string> = {
  [ComponentType.LLM]: 'bg-blue-500',
  [ComponentType.Database]: 'bg-green-500',
  [ComponentType.Input]: 'bg-yellow-500',
  [ComponentType.Output]: 'bg-purple-500',
  [ComponentType.Tool]: 'bg-indigo-500',
  [ComponentType.Agent]: 'bg-pink-500',
};

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_MODEL_IMAGE = 'imagen-3.0-generate-002';
