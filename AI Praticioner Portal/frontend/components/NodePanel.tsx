
import React, from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CanvasNodeData, ComponentType } from '../types';
import { COMPONENT_TYPE_COLORS } from '../constants';
import { Brain, Database, Terminal, Zap, Box } from 'lucide-react'; // Added Zap and Box

const typeToIcon = (type: ComponentType): React.ElementType => {
  switch (type) {
    case ComponentType.LLM: return Brain;
    case ComponentType.Database: return Database;
    case ComponentType.Input: return Terminal; // Using Terminal for generic input/output
    case ComponentType.Output: return Terminal;
    case ComponentType.Tool: return Zap;
    case ComponentType.Agent: return Box; // Or a more specific agent icon
    default: return Box;
  }
};


const NodePanel: React.FC<NodeProps<CanvasNodeData>> = ({ data, selected }) => {
  const IconComponent = typeToIcon(data.type);
  const bgColor = COMPONENT_TYPE_COLORS[data.type] || 'bg-gray-600';

  return (
    <div className={`p-3 rounded-md shadow-lg border-2 ${selected ? 'border-indigo-500' : 'border-gray-700'} bg-gray-800 w-48`}>
      <Handle type="target" position={Position.Left} className="!bg-indigo-500 !w-3 !h-3" />
      <div className="flex items-center mb-2">
        <span className={`p-1.5 rounded mr-2 ${bgColor}`}>
          <IconComponent size={16} className="text-white" />
        </span>
        <div className="text-sm font-semibold text-white truncate">{data.label}</div>
      </div>
      <p className="text-xs text-gray-400">{data.type}</p>
      {data.config && Object.keys(data.config).length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-500">Configured</p>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-indigo-500 !w-3 !h-3" />
    </div>
  );
};

export default NodePanel;
