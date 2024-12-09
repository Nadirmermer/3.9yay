import React from 'react';
import { Handle, Position } from 'reactflow';

interface QuestionNodeProps {
  data: {
    id: string;
    text: string;
    diagnosisName?: string;
    yesNext?: string;
    noNext?: string;
    onSelect?: (id: string) => void;
  };
}

export function QuestionNode({ data }: QuestionNodeProps) {
  return (
    <div 
      className="p-4 max-w-[300px] bg-white rounded shadow-lg border border-gray-200"
      onClick={() => data.onSelect?.(data.id)}
    >
      <Handle type="target" position={Position.Left} />
      
      <div className="font-bold text-sm mb-2">{data.id}</div>
      <div className="text-sm mb-2">{data.text}</div>
      
      {data.diagnosisName && (
        <div className="text-xs text-indigo-600 mt-1">
          {data.diagnosisName}
        </div>
      )}
      
      <div className="text-xs mt-2">
        <div className="text-green-600">Evet → {data.yesNext || '(son)'}</div>
        <div className="text-red-600">Hayır → {data.noNext || '(son)'}</div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}