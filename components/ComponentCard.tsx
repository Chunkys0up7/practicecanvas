
import React from 'react';
import { AIComponent, ComponentType } from '../types';
import { COMPONENT_TYPE_COLORS } from '../constants';
import { Box, BookOpen, GitMerge, Settings, Tag, Zap } from 'lucide-react';

interface ComponentCardProps {
  component: AIComponent;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>, component: AIComponent) => void;
  isDraggable?: boolean;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component, onDragStart, isDraggable = false }) => {
  const IconComponent = component.icon || Box;

  return (
    <div
      className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-indigo-500/20 transition-shadow duration-200 border border-gray-700 flex flex-col"
      draggable={isDraggable}
      onDragStart={isDraggable && onDragStart ? (e) => onDragStart(e, component) : undefined}
      style={isDraggable ? { cursor: 'grab' } : {}}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
           <span className={`p-1.5 rounded-md mr-3 ${COMPONENT_TYPE_COLORS[component.type] || 'bg-gray-600'}`}>
            <IconComponent size={20} className="text-white" />
          </span>
          <h3 className="text-md font-semibold text-white truncate">{component.name}</h3>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full text-white ${COMPONENT_TYPE_COLORS[component.type] || 'bg-gray-500'}`}>
          {component.type}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3 flex-grow min-h-[30px]">{component.description}</p>
      
      <div className="text-xs text-gray-400 space-y-1 mb-3">
        <div className="flex items-center"><Tag size={12} className="mr-1.5 text-indigo-400" /> Version: {component.version}</div>
        {component.category && <div className="flex items-center"><Box size={12} className="mr-1.5 text-indigo-400" /> Category: {component.category}</div>}
      </div>

      {(component.inputs || component.outputs) && (
        <div className="mb-3 text-xs">
          {component.inputs && component.inputs.length > 0 && (
             <div className="text-gray-400 mb-0.5">
              <span className="font-medium text-gray-300">Inputs:</span> {component.inputs.join(', ')}
            </div>
          )}
          {component.outputs && component.outputs.length > 0 && (
            <div className="text-gray-400">
              <span className="font-medium text-gray-300">Outputs:</span> {component.outputs.join(', ')}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-auto pt-2 border-t border-gray-700 flex justify-end items-center">
        {component.documentationUrl && (
          <a
            href={component.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
            onClick={(e) => e.stopPropagation()} // Prevents card click if it has one
          >
            <BookOpen size={14} className="mr-1" /> Docs
          </a>
        )}
      </div>
    </div>
  );
};

export default ComponentCard;
