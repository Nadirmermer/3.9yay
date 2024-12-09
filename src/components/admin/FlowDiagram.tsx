import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
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
  useReactFlow,
  ReactFlowProvider,
  Position
} from 'reactflow';
import { Search, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { Question, Diagnosis } from '../../types';
import 'reactflow/dist/style.css';

interface FlowDiagramProps {
  questions: Record<string, Question>;
  diagnoses: Record<string, Diagnosis>;
  onQuestionSelect: (id: string) => void;
}

const NODE_TYPES = {
  question: ({ data }: any) => (
    <div 
      className="p-4 max-w-[300px] bg-white rounded shadow-lg border border-gray-200"
      onClick={() => data.onSelect && data.onSelect(data.id)}
    >
      <div className="font-bold text-sm mb-2">{data.id}</div>
      <div className="text-sm mb-2">{data.question.text}</div>
      {data.question.diagnosisName && (
        <div className="text-xs text-indigo-600 mt-1">
          {data.question.diagnosisName}
        </div>
      )}
      <div className="text-xs mt-2">
        <div className="text-green-600">Evet → {data.question.yesNext || '(son)'}</div>
        <div className="text-red-600">Hayır → {data.question.noNext || '(son)'}</div>
      </div>
    </div>
  ),
  info: ({ data }: any) => (
    <div 
      className="p-4 max-w-[300px] bg-blue-50 rounded shadow-lg border border-blue-200"
      onClick={() => data.onSelect && data.onSelect(data.id)}
    >
      <div className="font-bold text-sm mb-2">{data.id}</div>
      <div className="text-sm">{data.question.text}</div>
      <div className="text-xs text-blue-600 mt-2">
        Sonraki → {data.question.yesNext || '(son)'}
      </div>
    </div>
  ),
  result: ({ data }: any) => (
    <div 
      className="p-4 max-w-[300px] bg-green-50 rounded shadow-lg border border-green-200"
      onClick={() => data.onSelect && data.onSelect(data.id)}
    >
      <div className="text-sm">{data.question.text}</div>
    </div>
  ),
  diagnosis: ({ data }: any) => (
    <div className="p-4 bg-pink-50 rounded shadow-lg border border-pink-200">
      <div className="font-bold text-sm">{data.diagnosis.name}</div>
      <div className="text-xs mt-1">{data.diagnosis.description}</div>
    </div>
  )
};

const EDGE_TYPES = {
  yes: {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#22c55e', strokeWidth: 2 },
    labelStyle: { fill: '#22c55e', fontSize: 12, fontWeight: 600 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#22c55e',
    },
  },
  no: {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#ef4444', strokeWidth: 2 },
    labelStyle: { fill: '#ef4444', fontSize: 12, fontWeight: 600 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#ef4444',
    },
  },
  diagnosis: {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#818cf8', strokeWidth: 1, strokeDasharray: '5,5' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
      color: '#818cf8',
    },
  },
};

function calculateLayout(questions: Record<string, Question>, diagnoses: Record<string, Diagnosis>, onSelect: (id: string) => void) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const visited = new Set<string>();
  const levels: { [key: string]: number } = {};
  const columns: { [key: number]: number } = {};

  // Calculate levels using BFS
  const queue = [{ id: 'start', level: 0 }];
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;
    
    visited.add(id);
    levels[id] = level;
    columns[level] = (columns[level] || 0) + 1;

    const question = questions[id];
    if (question) {
      if (question.yesNext && !visited.has(question.yesNext)) {
        queue.push({ id: question.yesNext, level: level + 1 });
      }
      if (question.noNext && !visited.has(question.noNext)) {
        queue.push({ id: question.noNext, level: level + 1 });
      }
    }
  }

  // Place nodes
  const xGap = 350;
  const yGap = 200;
  const levelPositions: { [key: number]: number } = {};

  Object.entries(levels).forEach(([id, level]) => {
    const question = questions[id];
    if (!question) return;

    levelPositions[level] = (levelPositions[level] || 0) + 1;
    const position = {
      x: level * xGap,
      y: (levelPositions[level] - 1) * yGap - (columns[level] - 1) * yGap / 2
    };

    nodes.push({
      id,
      type: question.isInformational ? 'info' : question.isResult ? 'result' : 'question',
      position,
      data: { id, question, onSelect },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    // Add edges
    if (question.yesNext) {
      edges.push({
        id: `${id}-yes-${question.yesNext}`,
        source: id,
        target: question.yesNext,
        label: 'Evet',
        type: 'yes',
      });
    }

    if (question.noNext) {
      edges.push({
        id: `${id}-no-${question.noNext}`,
        source: id,
        target: question.noNext,
        label: 'Hayır',
        type: 'no',
      });
    }
  });

  // Add diagnosis nodes and edges
  Object.entries(diagnoses).forEach(([id, diagnosis], index) => {
    const x = -xGap;
    const y = index * yGap - (Object.keys(diagnoses).length - 1) * yGap / 2;
    
    nodes.push({
      id: `diagnosis-${id}`,
      type: 'diagnosis',
      position: { x, y },
      data: { diagnosis },
      targetPosition: Position.Left,
    });

    // Add edges from questions to diagnoses
    Object.entries(questions).forEach(([qId, question]) => {
      if (question.diagnosis === id) {
        edges.push({
          id: `${qId}-diagnosis-${id}`,
          source: qId,
          target: `diagnosis-${id}`,
          type: 'diagnosis',
        });
      }
    });
  });

  return { nodes, edges };
}

function FlowDiagramContent({ questions, diagnoses, onQuestionSelect }: FlowDiagramProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flowWrapperRef = useRef<HTMLDivElement>(null);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => calculateLayout(questions, diagnoses, onQuestionSelect),
    [questions, diagnoses, onQuestionSelect]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const filteredNodes = useMemo(() => {
    if (!searchTerm) return nodes;
    return nodes.filter(node => {
      const question = questions[node.id];
      return question?.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
             node.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
             question?.diagnosisName?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [nodes, questions, searchTerm]);

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  const toggleFullscreen = () => {
    if (!flowWrapperRef.current) return;

    if (!isFullscreen) {
      if (flowWrapperRef.current.requestFullscreen) {
        flowWrapperRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div ref={flowWrapperRef} className={`w-full ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-12rem)]'} bg-gray-50 rounded-lg border relative`}>
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        fitView
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={node => {
            const question = questions[node.id];
            return question?.isInformational ? '#f0f9ff' : 
                   question?.isResult ? '#f0fdf4' : '#fff';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{ height: 120, width: 160 }}
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
              <button
                onClick={toggleFullscreen}
                className="p-1 hover:bg-gray-100 rounded"
                title={isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekran"}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
        </Panel>
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