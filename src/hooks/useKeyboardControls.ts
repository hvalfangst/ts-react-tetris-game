import { useEffect, useRef } from 'react';

interface KeyboardActions {
  moveLeft: () => void;
  moveRight: () => void;
  rotate: () => void;
  softDrop: () => void;
  hardDrop: () => void;
  togglePause: () => void;
}

export const useKeyboardControls = (actions: KeyboardActions, isGameActive: boolean) => {
  const keysPressed = useRef<Set<string>>(new Set());
  const repeatTimeouts = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!isGameActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      // Prevent default for game keys
      if (['arrowleft', 'arrowright', 'arrowdown', 'arrowup', ' ', 'p'].includes(key)) {
        event.preventDefault();
      }

      // Don't process if key is already being held
      if (keysPressed.current.has(key)) return;
      
      keysPressed.current.add(key);

      // Handle single-press actions
      switch (key) {
        case 'arrowup':
        case 'x':
          actions.rotate();
          break;
        case ' ':
          actions.hardDrop();
          break;
        case 'p':
          actions.togglePause();
          break;
      }

      // Handle repeatable actions
      const startRepeat = (action: () => void, initialDelay: number, repeatDelay: number) => {
        action(); // Execute immediately
        
        const timeout = setTimeout(() => {
          const interval = setInterval(() => {
            if (keysPressed.current.has(key)) {
              action();
            } else {
              clearInterval(interval);
            }
          }, repeatDelay);
          
          repeatTimeouts.current.set(key, interval as any);
        }, initialDelay);
        
        repeatTimeouts.current.set(key, timeout);
      };

      switch (key) {
        case 'arrowleft':
        case 'a':
          startRepeat(actions.moveLeft, 150, 50);
          break;
        case 'arrowright':
        case 'd':
          startRepeat(actions.moveRight, 150, 50);
          break;
        case 'arrowdown':
        case 's':
          startRepeat(actions.softDrop, 50, 50);
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      keysPressed.current.delete(key);
      
      // Clear any repeat timeouts for this key
      const timeout = repeatTimeouts.current.get(key);
      if (timeout) {
        clearTimeout(timeout);
        clearInterval(timeout);
        repeatTimeouts.current.delete(key);
      }
    };

    const handleBlur = () => {
      // Clear all keys and timeouts when window loses focus
      keysPressed.current.clear();
      repeatTimeouts.current.forEach(timeout => {
        clearTimeout(timeout);
        clearInterval(timeout);
      });
      repeatTimeouts.current.clear();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      
      // Clean up timeouts
      repeatTimeouts.current.forEach(timeout => {
        clearTimeout(timeout);
        clearInterval(timeout);
      });
      repeatTimeouts.current.clear();
    };
  }, [actions, isGameActive]);
};