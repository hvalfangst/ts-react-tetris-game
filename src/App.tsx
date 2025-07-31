import { useEffect, useMemo } from 'react';
import './App.css';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { ScoreBoard } from './components/ScoreBoard';
import { GameControls } from './components/GameControls';
import { MobileControls } from './components/MobileControls';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useMobileDetection } from './hooks/useMobileDetection';
import { useTouchControls } from './hooks/useTouchControls';

function App() {
  const {
    gameState,
    effects,
    actions,
    getGhostPiecePosition,
    setEffects,
  } = useGameState();

  // Mobile detection
  const { isTouchDevice } = useMobileDetection();

  // Initialize the game on first load - only once
  useEffect(() => {
    actions.initGame();
  }, []); // Empty dependency array - only run once

  useGameLoop({
    gameState,
    onDrop: actions.dropPiece,
    onUpdateEffects: setEffects,
  });

  // Memoize keyboard actions to prevent recreating them on every render
  const keyboardActions = useMemo(() => ({
    moveLeft: actions.moveLeft,
    moveRight: actions.moveRight,
    rotate: actions.rotate,
    softDrop: actions.softDrop,
    hardDrop: actions.hardDrop,
    togglePause: actions.togglePause,
  }), [actions.moveLeft, actions.moveRight, actions.rotate, actions.softDrop, actions.hardDrop, actions.togglePause]);

  useKeyboardControls(keyboardActions, !gameState.isGameOver);

  // Touch controls for mobile
  const touchActions = useMemo(() => ({
    moveLeft: actions.moveLeft,
    moveRight: actions.moveRight,
    rotate: actions.rotate,
    softDrop: actions.softDrop,
    hardDrop: actions.hardDrop,
  }), [actions.moveLeft, actions.moveRight, actions.rotate, actions.softDrop, actions.hardDrop]);

  useTouchControls(touchActions, !gameState.isGameOver && !gameState.isPaused);

  const ghostPiece = getGhostPiecePosition();

  return (
    <div className="app">
      <div className="game-area">
        <GameBoard
          board={gameState.board}
          currentPiece={gameState.currentPiece}
          ghostPiece={ghostPiece}
          particles={effects.particles}
          screenShake={effects.screenShake}
        />
      </div>

      <div className="side-panel">
        <NextPiece nextPiece={gameState.nextPiece} />
        <ScoreBoard gameState={gameState} />
        <GameControls
          isGameOver={gameState.isGameOver}
          isPaused={gameState.isPaused}
          onStart={actions.initGame}
          onPause={actions.togglePause}
        />
      </div>

      {gameState.isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>Game Over!</h2>
            <p>Final Score: {gameState.score.toLocaleString()}</p>
            <p>Lines Cleared: {gameState.lines}</p>
            <p>Level Reached: {gameState.level}</p>
            <button
              className="control-button primary"
              onClick={actions.initGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {gameState.isPaused && !gameState.isGameOver && (
        <div className="pause-overlay">
          <div className="pause-content">
            <h2>Paused</h2>
            <p>Press P to resume or click the Resume button</p>
          </div>
        </div>
      )}

      {/* Mobile controls for touch devices */}
      {isTouchDevice && (
        <MobileControls
          onMoveLeft={actions.moveLeft}
          onMoveRight={actions.moveRight}
          onRotate={actions.rotate}
          onSoftDrop={actions.softDrop}
          onHardDrop={actions.hardDrop}
          onPause={actions.togglePause}
          isGameActive={!gameState.isGameOver && !gameState.isPaused}
        />
      )}

      {/* Touch gesture hint for mobile users */}
      {isTouchDevice && !gameState.isGameOver && (
        <div className="touch-hint">
          Swipe: Move • Tap: Rotate • Long Press: Hard Drop
        </div>
      )}
    </div>
  );
}

export default App;
