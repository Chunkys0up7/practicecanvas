
import React, { useState, useEffect } from 'react';
import { CustomNode, CanvasNodeData } from '../types';
import Input from './common/Input';
import Button from './common/Button';

interface PropertiesEditorProps {
  selectedNode: CustomNode | null;
  onNodeConfigChange: (nodeId: string, config: Record<string, any>) => void;
}

const PropertiesEditor: React.FC<PropertiesEditorProps> = ({ selectedNode, onNodeConfigChange }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (selectedNode?.data?.config) {
      setFormData(selectedNode.data.config);
    } else {
      setFormData({});
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="p-4 bg-gray-800 border-l border-gray-700 h-full text-gray-400">
        <h3 className="text-lg font-semibold text-white mb-4">Properties</h3>
        <p>Select a node to view or edit its properties.</p>
      </div>
    );
  }

  const { data } = selectedNode;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const val = type === 'checkbox' ? e.target.checked : type === 'number' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNodeConfigChange(selectedNode.id, formData);
  };
  
  // Example editable fields based on node type or a generic approach
  const renderEditableFields = () => {
    // For simplicity, let's allow editing a 'temperature' field if it's an LLM
    // And a generic 'param1', 'param2'
    const fields: { name: string, label: string, type: string }[] = [];
    if (data.type === 'LLM') {
      fields.push({ name: 'temperature', label: 'Temperature', type: 'number' });
      fields.push({ name: 'maxTokens', label: 'Max Tokens', type: 'number' });
    } else {
        fields.push({ name: 'customParam', label: 'Custom Parameter', type: 'text' });
    }
    // Add any existing config keys that are not predefined
    Object.keys(data.config || {}).forEach(key => {
        if (!fields.find(f => f.name === key)) {
            fields.push({ name: key, label: key.charAt(0).toUpperCase() + key.slice(1), type: typeof data.config?.[key] === 'number' ? 'number' : 'text' });
        }
    });
     if (fields.length === 0 && Object.keys(formData).length === 0) { // if no predefined or existing config
        fields.push({ name: 'newNodeParam', label: 'New Parameter', type: 'text' });
    }


    return fields.map(field => (
      <Input
        key={field.name}
        id={field.name}
        name={field.name}
        label={field.label}
        type={field.type}
        value={formData[field.name] || (field.type === 'number' ? 0 : '')}
        onChange={handleChange}
        className="mb-3"
        step={field.type === 'number' ? '0.1' : undefined}
      />
    ));
  };


  return (
    <div className="p-4 bg-gray-800 border-l border-gray-700 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-2">Properties: {data.label}</h3>
      <p className="text-sm text-gray-400 mb-4">Type: {data.type}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-3 mb-4">
            {Object.entries(data).map(([key, value]) => {
                if (key === 'label' || key === 'type' || key === 'config' || typeof value === 'object') return null;
                return (
                    <div key={key} className="text-sm">
                        <span className="font-medium text-gray-300">{key.charAt(0).toUpperCase() + key.slice(1)}: </span>
                        <span className="text-gray-400">{String(value)}</span>
                    </div>
                );
            })}
        </div>

        <h4 className="text-md font-semibold text-white mb-2 mt-4 pt-2 border-t border-gray-700">Configuration</h4>
        {renderEditableFields()}
        {Object.keys(formData).length === 0 && !renderEditableFields().length && (
             <p className="text-sm text-gray-400 mb-3">No configurable parameters for this node type, or add a new one.</p>
        )}
        
        <Button type="submit" variant="primary" size="sm" className="w-full">
          Save Configuration
        </Button>
      </form>
    </div>
  );
};

export default PropertiesEditor;
