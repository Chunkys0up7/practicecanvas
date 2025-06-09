
import { Node as RFNode, Edge as RFEdge } from 'reactflow';
import { ElementType } from 'react'; // Import ElementType

export interface Project {
  id: string;
  name: string;
  lastModified: string;
  description: string;
  components: string[];
  template?: string;
  thumbnailUrl?: string;
}

export enum ComponentType {
  LLM = "LLM",
  Database = "Database",
  Input = "Input",
  Output = "Output",
  Tool = "Tool",
  Agent = "Agent"
}

export interface AIComponent {
  id: string;
  name: string;
  type: ComponentType;
  description: string;
  version: string;
  inputs?: string[];
  outputs?: string[];
  compatibility?: string[];
  documentationUrl?: string;
  icon?: ElementType; // Changed from React.ReactNode to ElementType
  category: string; // e.g., 'Data Sources', 'Language Models', 'Logic'
}

export interface CanvasNodeData {
  label: string;
  type: ComponentType;
  config?: Record<string, any>;
  [key: string]: any; 
}

export type CustomNode = RFNode<CanvasNodeData>;
export type CustomEdge = RFEdge;


export interface DeployedEnvironment {
  name: string;
  status: 'Deployed' | 'Pending' | 'Error' | 'Unknown';
  lastDeployed: string;
  url?: string;
}

export interface DeploymentLog {
  timestamp: string;
  message: string;
  level: 'info' | 'error' | 'warning';
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}
export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // other types of chunks can be added here
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // other metadata fields if needed
}

// For Gemini Service
export interface GenerateCodeParams {
  prompt: string;
  language?: string; // e.g., "Python"
}
export interface GenerateCodeResponse {
  code: string;
  explanation?: string;
}

export enum ChatRole {
  USER = "user",
  MODEL = "model",
}

export interface ChatMessage {
  role: ChatRole;
  text: string;
  timestamp: Date;
}
