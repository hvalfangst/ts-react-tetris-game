import { useEffect, useRef } from 'react';

interface TouchActions {
  moveLeft: () => void;
  moveRight: () => void;
  rotate: () => void;
  softDrop: () => void;
  hardDrop: () => void;
}

export const useTouchControls = (actions: TouchActions, isGameActive: boolean) => {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isGameActive) return;

    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (touchEvent.touches.length !== 1) return;
      
      const touch = touchEvent.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      // Start long press timer for hard drop
      longPressTimerRef.current = window.setTimeout(() => {
        if (touchStartRef.current) {
          actions.hardDrop();
          touchStartRef.current = null; // Prevent swipe detection
        }
      }, 500);
    };

    const handleTouchMove = (e: Event) => {
      // Prevent scrolling during game
      e.preventDefault();
    };

    const handleTouchEnd = (e: Event) => {
      const touchEvent = e as TouchEvent;
      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = undefined;
      }

      if (!touchStartRef.current) return;

      const touch = touchEvent.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Only process quick gestures (not long presses)
      if (deltaTime > 500) {
        touchStartRef.current = null;
        return;
      }

      const minSwipeDistance = 30;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Determine gesture type
      if (absX > minSwipeDistance || absY > minSwipeDistance) {
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0) {
            actions.moveRight();
          } else {
            actions.moveLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            actions.softDrop();
          } else {
            actions.rotate();
          }
        }
      } else {
        // Tap - rotate piece
        if (deltaTime < 200) {
          actions.rotate();
        }
      }

      touchStartRef.current = null;
    };

    // Add event listeners to the game board area
    const gameBoard = document.querySelector('.game-board-container');
    if (gameBoard) {
      gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
      gameBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
      gameBoard.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (gameBoard) {
        gameBoard.removeEventListener('touchstart', handleTouchStart);
        gameBoard.removeEventListener('touchmove', handleTouchMove);
        gameBoard.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [actions, isGameActive]);
};