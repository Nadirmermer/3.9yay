import React from 'react';
import { Handle, Position } from 'reactflow';

interface ResultNodeProps {
  data: {
    id: string;
    text: string;
    onSelect?: (id: string) => void;
  };
}

export function ResultNode({ data }: ResultNodeProps) {
  return (
    <div 
      className="p-4 max-w-[300px] bg-green-50 rounded shadow-lg border border-green-200"
      onClick={() => data.onSelect?.(data.id)}
    >
      <Handle type="target" position={Position.Left} />
      <div className="text-sm">{data.text}</div>
    </div>
  );
}