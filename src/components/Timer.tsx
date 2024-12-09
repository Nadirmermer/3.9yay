import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';

export function Timer() {
  const { formattedTime, isRunning, startTimer, pauseTimer, resetTimer } = useTimer();

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg shadow">
      <span className="font-mono text-lg">{formattedTime}</span>
      <div className="flex gap-1">
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title={isRunning ? "Duraklat" : "Başlat"}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="Sıfırla"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}