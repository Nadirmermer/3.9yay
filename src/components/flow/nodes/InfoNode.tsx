import React from 'react';
import { Handle, Position } from 'reactflow';

interface InfoNodeProps {
  data: {
    id: string;
    text: string;
    yesNext?: string;
    onSelect?: (id: string) => void;
  };
}

export function InfoNode({ data }: InfoNodeProps) {
  return (
    <div 
      className="p-4 max-w-[300px] bg-blue-50 rounded shadow-lg border border-blue-200"
      onClick={() => data.onSelect?.(data.id)}
    >
      <Handle type="target" position={Position.Left} />
      
      <div className="font-bold text-sm mb-2">{data.id}</div>
      <div className="text-sm">{data.text}</div>
      
      <div className="text-xs text-blue-600 mt-2">
        Sonraki → {data.yesNext || '(son)'}
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}