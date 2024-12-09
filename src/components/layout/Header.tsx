import React from 'react';
import { Stethoscope, Settings, RotateCcw, Moon, Sun } from 'lucide-react';
import { Timer } from '../Timer';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onReset: () => void;
  onOpenAdmin: () => void;
}

export function Header({ theme, onThemeToggle, onReset, onOpenAdmin }: HeaderProps) {
  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Stethoscope className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-indigo-600'}`} />
            <h1 className="text-2xl font-bold">SCID 5 CV</h1>
          </div>
          <div className="flex items-center gap-4">
            <Timer />
            <button
              onClick={onThemeToggle}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              title={theme === 'dark' ? 'Açık Mod' : 'Karanlık Mod'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={onReset}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Yeniden Başlat"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenAdmin}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Yönetim Paneli"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}