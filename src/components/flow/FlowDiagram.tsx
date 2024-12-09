import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Panel,
  ReactFlowProvider,
  Position,
  useReactFlow
} from 'reactflow';
import { Search, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Question } from '../../types';
import { QuestionNode } from './nodes/QuestionNode';
import { InfoNode } from './nodes/InfoNode';
import { ResultNode } from './nodes/ResultNode';
import { useFlowLayout } from '../../hooks/useFlowLayout';
import 'reactflow/dist/style.css';

const nodeTypes = {
  question: QuestionNode,
  info: InfoNode,
  result: ResultNode,
};

const edgeTypes = {
  yes: {
    type: 'smoothstep',
    animated: true,
    style: { 
      stroke: '#22c55e', 
      strokeWidth: 3,
      strokeDasharray: '10,5',
      animation: 'flowAnimation 30s infinite linear',
    },
    labelBgStyle: { 
      fill: '#ffffff', 
      fillOpacity: 0.9,
      stroke: '#22c55e',
      strokeWidth: 2,
      rx: 4,
      ry: 4,
      padding: 8
    },
    labelStyle: { 
      fill: '#16a34a', 
      fontSize: 14, 
      fontWeight: 600,
      paintOrder: 'stroke',
      strokeWidth: 3,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 24,
      height: 24,
      color: '#22c55e',
    },
  },
  no: {
    type: 'smoothstep',
    animated: true,
    style: { 
      stroke: '#ef4444', 
      strokeWidth: 3,
      strokeDasharray: '10,5',
      animation: 'flowAnimation 30s infinite linear',
    },
    labelBgStyle: { 
      fill: '#ffffff', 
      fillOpacity: 0.9,
      stroke: '#ef4444',
      strokeWidth: 2,
      rx: 4,
      ry: 4,
      padding: 8
    },
    labelStyle: { 
      fill: '#dc2626', 
      fontSize: 14, 
      fontWeight: 600,
      paintOrder: 'stroke',
      strokeWidth: 3,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 24,
      height: 24,
      color: '#ef4444',
    },
  },
};

interface FlowDiagramProps {
  questions: Record<string, Question>;
  onQuestionSelect?: (id: string) => void;
}

function FlowDiagramContent({ questions, onQuestionSelect }: FlowDiagramProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { nodes: initialNodes, edges: initialEdges } = useFlowLayout(questions);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  const filteredNodes = nodes.filter(node => {
    if (!searchTerm) return true;
    const question = questions[node.id];
    return question?.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
           node.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full h-[calc(100vh-12rem)] bg-gray-50 rounded-lg border relative">
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background color="#aaaaaa" gap={16} />
        <Controls />
        <MiniMap 
          nodeColor={node => {
            switch (node.type) {
              case 'info': return '#f0f9ff';
              case 'result': return '#f0fdf4';
              default: return '#fff';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{ height: 120 }}
        />
        
        <Panel position="top-left" className="bg-white p-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Soru ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-1 border rounded text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => zoomIn()}
                className="p-1 hover:bg-gray-100 rounded"
                title="Yakınlaştır"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => zoomOut()}
                className="p-1 hover:bg-gray-100 rounded"
                title="Uzaklaştır"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={() => fitView()}
                className="p-1 hover:bg-gray-100 rounded"
                title="Görünümü Sıfırla"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </Panel>

        <style>
          {`
            @keyframes flowAnimation {
              from {
                stroke-dashoffset: 24;
              }
              to {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
      </ReactFlow>
    </div>
  );
}

export function FlowDiagram(props: FlowDiagramProps) {
  return (
    <ReactFlowProvider>
      <FlowDiagramContent {...props} />
    </ReactFlowProvider>
  );
}