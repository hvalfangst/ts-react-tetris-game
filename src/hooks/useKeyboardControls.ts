import { useEffect, useRef, useCallback } from 'react';

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
  const lastActionTime = useRef<Map<string, number>>(new Map());
  
  // Store actions in refs to prevent recreating event listeners
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const cleanupTimeouts = useCallback(() => {
    repeatTimeouts.current.forEach(timeout => {
      clearTimeout(timeout);
      clearInterval(timeout);
    });
    repeatTimeouts.current.clear();
  }, []);

  useEffect(() => {
    if (!isGameActive) {
      cleanupTimeouts();
      keysPressed.current.clear();
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const now = performance.now();
      
      // Prevent default for game keys
      if (['arrowleft', 'arrowright', 'arrowdown', 'arrowup', ' ', 'p', 'a', 'd', 's', 'w', 'x'].includes(key)) {
        event.preventDefault();
      }

      // Don't process if key is already being held
      if (keysPressed.current.has(key)) return;
      
      keysPressed.current.add(key);

      // Rate limiting for single-press actions
      const lastTime = lastActionTime.current.get(key) || 0;
      if (now - lastTime < 100) { // Minimum 100ms between actions
        return;
      }
      lastActionTime.current.set(key, now);

      // Handle single-press actions with rate limiting
      switch (key) {
        case 'arrowup':
        case 'w':
        case 'x':
          actionsRef.current.rotate();
          break;
        case ' ':
          actionsRef.current.hardDrop();
          break;
        case 'p':
          actionsRef.current.togglePause();
          break;
      }

      // Handle repeatable actions with more conservative timing
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
          startRepeat(actionsRef.current.moveLeft, 200, 80); // Slower repeat
          break;
        case 'arrowright':
        case 'd':
          startRepeat(actionsRef.current.moveRight, 200, 80); // Slower repeat
          break;
        case 'arrowdown':
        case 's':
          startRepeat(actionsRef.current.softDrop, 100, 60); // Slightly slower
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
      cleanupTimeouts();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('visibilitychange', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('visibilitychange', handleBlur);
      
      // Clean up timeouts
      cleanupTimeouts();
      keysPressed.current.clear();
    };
  }, [isGameActive, cleanupTimeouts]); // Remove actions from dependencies
};