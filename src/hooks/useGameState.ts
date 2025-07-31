import { useState, useCallback } from 'react';
import type {
  GameState,
  Piece,
  LinesClearedEffect,
  ParticleEffect,
} from '../types/tetris';
import {
  BOARD_WIDTH,
} from '../types/tetris';
import {
  createEmptyBoard,
  getRandomTetromino,
  isValidPosition,
  placePiece,
  findCompletedLines,
  clearLines,
  calculateScore,
  calculateLevel,
  calculateDropTime,
  canMovePiece,
  movePiece,
  rotatePiece,
  getGhostPiece,
  isGameOver,
} from '../utils/tetrisLogic';
import { useSoundEffects } from './useSoundEffects';

export const useGameState = () => {
  const {
    playMoveSound,
    playRotateSound,
    playDropSound,
    playLineClearSound,
    playGameOverSound,
    playLevelUpSound,
  } = useSoundEffects();

  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    level: 0,
    lines: 0,
    isGameOver: false,
    isPaused: false,
    dropTime: 800,
  }));

  const [effects, setEffects] = useState<{
    lineClears: LinesClearedEffect[];
    particles: ParticleEffect[];
    screenShake: number;
  }>({
    lineClears: [],
    particles: [],
    screenShake: 0,
  });


  const spawnNewPiece = useCallback((state: GameState): GameState => {
    const newPiece = state.nextPiece || getRandomTetromino();
    const nextPiece = getRandomTetromino();

    if (isGameOver(state.board, newPiece)) {
      playGameOverSound();
      return {
        ...state,
        currentPiece: newPiece,
        nextPiece,
        isGameOver: true,
      };
    }

    return {
      ...state,
      currentPiece: newPiece,
      nextPiece,
    };
  }, [playGameOverSound]);

  const createParticles = useCallback((x: number, y: number, count: number = 10) => {
    const newParticles: ParticleEffect[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `${Date.now()}-${i}`,
        x: x * 30 + 15,
        y: y * 30 + 15,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        maxLife: 60,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      });
    }
    return newParticles;
  }, []);

  const initGame = useCallback(() => {
    const newPiece = getRandomTetromino();
    const nextPiece = getRandomTetromino();
    
    setGameState({
      board: createEmptyBoard(),
      currentPiece: newPiece,
      nextPiece,
      score: 0,
      level: 0,
      lines: 0,
      isGameOver: false,
      isPaused: false,
      dropTime: 800,
    });

    setEffects({
      lineClears: [],
      particles: [],
      screenShake: 0,
    });
  }, []);

  const moveLeft = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      if (canMovePiece(prevState.board, prevState.currentPiece, 'left')) {
        playMoveSound();
        return {
          ...prevState,
          currentPiece: movePiece(prevState.currentPiece, 'left'),
        };
      }

      return prevState;
    });
  }, [playMoveSound]);

  const moveRight = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      if (canMovePiece(prevState.board, prevState.currentPiece, 'right')) {
        playMoveSound();
        return {
          ...prevState,
          currentPiece: movePiece(prevState.currentPiece, 'right'),
        };
      }

      return prevState;
    });
  }, [playMoveSound]);

  const rotate = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      const rotatedPiece = rotatePiece(prevState.currentPiece);
      
      if (isValidPosition(prevState.board, rotatedPiece, rotatedPiece.position)) {
        playRotateSound();
        return {
          ...prevState,
          currentPiece: rotatedPiece,
        };
      }

      return prevState;
    });
  }, [playRotateSound]);

  const softDrop = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      if (canMovePiece(prevState.board, prevState.currentPiece, 'down')) {
        return {
          ...prevState,
          currentPiece: movePiece(prevState.currentPiece, 'down'),
          score: prevState.score + 1,
        };
      }

      return prevState;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      const ghostPiece = getGhostPiece(prevState.board, prevState.currentPiece);
      const dropDistance = ghostPiece.position.y - prevState.currentPiece.position.y;
      
      playDropSound();
      let newBoard = placePiece(prevState.board, ghostPiece);
      const completedLines = findCompletedLines(newBoard);
      
      let newScore = prevState.score + dropDistance * 2;
      let newLines = prevState.lines;
      let newParticles: ParticleEffect[] = [];
      let shakeIntensity = 0;

      if (completedLines.length > 0) {
        newBoard = clearLines(newBoard, completedLines);
        newScore += calculateScore(completedLines.length, prevState.level);
        newLines += completedLines.length;
        shakeIntensity = completedLines.length * 2;

        playLineClearSound(completedLines.length);

        // Create particles for cleared lines
        completedLines.forEach(lineY => {
          for (let x = 0; x < BOARD_WIDTH; x++) {
            newParticles.push(...createParticles(x, lineY, 3));
          }
        });

        setEffects(prev => ({
          ...prev,
          lineClears: [
            ...prev.lineClears,
            { lines: completedLines, timestamp: Date.now() }
          ],
          particles: [...prev.particles, ...newParticles],
          screenShake: shakeIntensity,
        }));
      }

      const newLevel = calculateLevel(newLines);
      const newDropTime = calculateDropTime(newLevel);

      if (newLevel > prevState.level) {
        playLevelUpSound();
      }

      return spawnNewPiece({
        ...prevState,
        board: newBoard,
        score: newScore,
        lines: newLines,
        level: newLevel,
        dropTime: newDropTime,
      });
    });
  }, [spawnNewPiece, createParticles, playLineClearSound, playLevelUpSound, playDropSound]);

  const dropPiece = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      if (canMovePiece(prevState.board, prevState.currentPiece, 'down')) {
        return {
          ...prevState,
          currentPiece: movePiece(prevState.currentPiece, 'down'),
        };
      }

      // Piece can't move down, place it
      playDropSound();
      let newBoard = placePiece(prevState.board, prevState.currentPiece);
      const completedLines = findCompletedLines(newBoard);
      
      let newScore = prevState.score;
      let newLines = prevState.lines;
      let newParticles: ParticleEffect[] = [];
      let shakeIntensity = 0;

      if (completedLines.length > 0) {
        newBoard = clearLines(newBoard, completedLines);
        newScore += calculateScore(completedLines.length, prevState.level);
        newLines += completedLines.length;
        shakeIntensity = completedLines.length * 2;

        playLineClearSound(completedLines.length);

        // Create particles for cleared lines
        completedLines.forEach(lineY => {
          for (let x = 0; x < BOARD_WIDTH; x++) {
            newParticles.push(...createParticles(x, lineY, 3));
          }
        });

        setEffects(prev => ({
          ...prev,
          lineClears: [
            ...prev.lineClears,
            { lines: completedLines, timestamp: Date.now() }
          ],
          particles: [...prev.particles, ...newParticles],
          screenShake: shakeIntensity,
        }));
      }

      const newLevel = calculateLevel(newLines);
      const newDropTime = calculateDropTime(newLevel);

      if (newLevel > prevState.level) {
        playLevelUpSound();
      }

      return spawnNewPiece({
        ...prevState,
        board: newBoard,
        score: newScore,
        lines: newLines,
        level: newLevel,
        dropTime: newDropTime,
      });
    });
  }, [spawnNewPiece, createParticles, playLineClearSound, playLevelUpSound, playDropSound]);

  const togglePause = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isPaused: !prevState.isPaused,
    }));
  }, []);

  const getGhostPiecePosition = useCallback((): Piece | null => {
    if (!gameState.currentPiece) return null;
    return getGhostPiece(gameState.board, gameState.currentPiece);
  }, [gameState.board, gameState.currentPiece]);

  return {
    gameState,
    effects,
    actions: {
      initGame,
      moveLeft,
      moveRight,
      rotate,
      softDrop,
      hardDrop,
      dropPiece,
      togglePause,
    },
    getGhostPiecePosition,
    setEffects,
  };
};