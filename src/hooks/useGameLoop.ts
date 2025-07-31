import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const gameLoop = (currentTime: number) => {
      lastTimeRef.current = currentTime;

      // Handle automatic piece dropping
      if (currentTime - lastDropTimeRef.current >= gameState.dropTime) {
        onDrop();
        lastDropTimeRef.current = currentTime;
      }

      // Update particle effects
      onUpdateEffects((prev: any) => {
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

        const newScreenShake = Math.max(0, prev.screenShake - 0.5);

        return {
          particles: updatedParticles,
          lineClears: updatedLineClears,
          screenShake: newScreenShake,
        };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.isPaused, gameState.dropTime, onDrop, onUpdateEffects]);
};