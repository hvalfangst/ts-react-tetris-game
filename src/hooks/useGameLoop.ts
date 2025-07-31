import { useEffect, useRef, useCallback } from 'react';
import type { GameState } from '../types/tetris';

interface UseGameLoopProps {
  gameState: GameState;
  onDrop: () => void;
  onUpdateEffects: (updateFn: (prev: any) => any) => void;
}

export const useGameLoop = ({ gameState, onDrop, onUpdateEffects }: UseGameLoopProps) => {
  const gameLoopRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastDropTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  
  // Store the latest functions in refs to avoid recreating the game loop
  const onDropRef = useRef(onDrop);
  const onUpdateEffectsRef = useRef(onUpdateEffects);
  const gameStateRef = useRef(gameState);
  
  // Update refs when props change
  onDropRef.current = onDrop;
  onUpdateEffectsRef.current = onUpdateEffects;
  gameStateRef.current = gameState;

  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = 0;
    }
    isRunningRef.current = false;
  }, []);

  const startGameLoop = useCallback(() => {
    if (isRunningRef.current) {
      return; // Already running
    }
    
    isRunningRef.current = true;
    lastDropTimeRef.current = performance.now();

    const gameLoop = (currentTime: number) => {
      // Check if we should still be running
      if (!isRunningRef.current || gameStateRef.current.isGameOver || gameStateRef.current.isPaused) {
        stopGameLoop();
        return;
      }

      lastTimeRef.current = currentTime;

      // Handle automatic piece dropping with more stable timing
      if (currentTime - lastDropTimeRef.current >= gameStateRef.current.dropTime) {
        onDropRef.current();
        lastDropTimeRef.current = currentTime;
      }

      // Update particle effects only if there are effects to update
      onUpdateEffectsRef.current((prev: any) => {
        if (prev.particles.length === 0 && prev.lineClears.length === 0 && prev.screenShake <= 0) {
          return prev; // No changes needed
        }

        const updatedParticles = prev.particles
          .map((particle: any) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx * 0.98,
            vy: particle.vy * 0.98,
            life: particle.life - 1,
          }))
          .filter((particle: any) => particle.life > 0);

        const updatedLineClears = prev.lineClears.filter(
          (effect: any) => currentTime - effect.timestamp < 500
        );

        const newScreenShake = Math.max(0, prev.screenShake - 0.8); // Faster shake decay

        return {
          particles: updatedParticles,
          lineClears: updatedLineClears,
          screenShake: newScreenShake,
        };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [stopGameLoop]);

  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) {
      stopGameLoop();
    } else {
      startGameLoop();
    }

    return stopGameLoop;
  }, [gameState.isGameOver, gameState.isPaused, startGameLoop, stopGameLoop]);
};