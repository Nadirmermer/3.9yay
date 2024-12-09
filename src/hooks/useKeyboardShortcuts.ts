import { useEffect } from 'react';

type ShortcutHandlers = {
  [key: string]: () => void;
};

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const handler = handlers[event.key];
      if (handler && !event.ctrlKey && !event.altKey && !event.metaKey) {
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlers]);
}