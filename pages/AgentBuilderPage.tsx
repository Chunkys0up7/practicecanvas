
import React, { useState, useCallback, useEffect, useRef, DragEvent } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  ReactFlowProvider,
  ReactFlowInstance,
  XYPosition,
  MarkerType,
} from 'reactflow';
// Removed: import 'reactflow/dist/style.css';
import { useSearchParams } from 'react-router-dom';

import NodePanel from '../components/NodePanel';
import PropertiesEditor from '../components/PropertiesEditor';
import { CustomNode, CanvasNodeData, AIComponent, ComponentType } from '../types';
import { fetchComponents, saveCanvasState as apiSaveCanvasState } from '../services/mockApiService';
import { MOCK_COMPONENTS } from '../constants'; // Using mock components for sidebar
import Button from '../components/common/Button';
import { Save, Plus, Zap, Database, Terminal, Brain, Box } from 'lucide-react';
import ComponentCard from '../components/ComponentCard';


const nodeTypes = {
  custom: NodePanel,
};

const initialNodes: CustomNode[] = [
  { id: '1', type: 'custom', position: { x: 100, y: 100 }, data: { label: 'Input Node', type: ComponentType.Input } },
  { id: '2', type: 'custom', position: { x: 400, y: 100 }, data: { label: 'LLM Processor', type: ComponentType.LLM, config: { temperature: 0.7 } } },
];
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed } }];

const AgentBuilderPage: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'defaultProject';
  const [availableComponents, setAvailableComponents] = useState<AIComponent[]>(MOCK_COMPONENTS);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);


  useEffect(() => {
    // In a real app, load project-specific nodes/edges here
    // For now, projectId is just for demonstration
    console.log("Building agent for project:", projectId);

    // Fetch actual components for the sidebar if needed, or use mocks
    // fetchComponents().then(setAvailableComponents);
  }, [projectId]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<CanvasNodeData>) => {
    setSelectedNode(node as CustomNode);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);
  
  const onNodeConfigChange = (nodeId: string, config: Record<string, any>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, config } };
        }
        return node;
      })
    );
    // Also update selectedNode if it's the one being changed
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => prev ? ({ ...prev, data: {...prev.data, config}}) : null);
    }
  };

  let idCounter = nodes.length + 1;
  const getId = () => `dndnode_${idCounter++}`;

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const componentDataString = event.dataTransfer.getData('application/reactflow-component');
      
      if (!componentDataString) return;
      const component: AIComponent = JSON.parse(componentDataString);

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: CustomNode = {
        id: getId(),
        type: 'custom',
        position,
        data: { label: component.name, type: component.type, config: {} },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  
  const onDragStart = (event: DragEvent, component: AIComponent) => {
    event.dataTransfer.setData('application/reactflow-component', JSON.stringify(component));
    event.dataTransfer.effectAllowed = 'move';
  };

  const saveCanvasState = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    const flow = reactFlowInstance?.toObject();
    if (flow) {
      const result = await apiSaveCanvasState(projectId, flow);
      setSaveMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    } else {
      setSaveMessage({ text: 'Error: Could not get flow instance.', type: 'error' });
    }
    setIsSaving(false);
    setTimeout(() => setSaveMessage(null), 3000);
  };


  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-semibold text-white">Agent Builder: {projectId}</h1>
        <div className="flex items-center">
          {saveMessage && (
            <span className={`text-xs mr-3 ${saveMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {saveMessage.text}
            </span>
          )}
          <Button onClick={saveCanvasState} variant="primary" size="sm" leftIcon={<Save size={16}/>} isLoading={isSaving}>
            Save Canvas
          </Button>
        </div>
      </div>
      <div className="flex-grow flex" ref={reactFlowWrapper}>
        <div className="w-64 bg-gray-800 p-3 border-r border-gray-700 overflow-y-auto space-y-2">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Components</h3>
          {availableComponents.map((component) => (
            <ComponentCard key={component.id} component={component} onDragStart={(e, comp) => onDragStart(e, comp)} isDraggable={true} />
          ))}
        </div>
        <div className="flex-grow h-full" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-850" // A slightly different bg for the canvas itself
            onInit={setReactFlowInstance}
          >
            <Controls className="[&>button]:bg-gray-700 [&>button]:border-gray-600 [&>button:hover]:bg-gray-600 [&>button_path]:fill-white"/>
            <Background color="#4B5563" gap={16} />
          </ReactFlow>
        </div>
        {selectedNode && (
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            <PropertiesEditor selectedNode={selectedNode} onNodeConfigChange={onNodeConfigChange} />
          </div>
        )}
      </div>
    </div>
  );
};

const AgentBuilderPageWrapper: React.FC = () => (
  <ReactFlowProvider>
    <AgentBuilderPage />
  </ReactFlowProvider>
);


export default AgentBuilderPageWrapper;