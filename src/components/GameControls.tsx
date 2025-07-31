import React from 'react';

interface GameControlsProps {
  isGameOver: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isGameOver,
  isPaused,
  onStart,
  onPause,
}) => {
  return (
    <div className="game-controls">
      <button
        className="control-button primary"
        onClick={onStart}
      >
        {isGameOver ? 'New Game' : 'Restart'}
      </button>
      
      {!isGameOver && (
        <button
          className="control-button"
          onClick={onPause}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      )}
      
      <div className="controls-help">
        <h4>Controls</h4>
        <div className="control-item">
          <span>← →</span> <span>Move</span>
        </div>
        <div className="control-item">
          <span>↓</span> <span>Soft Drop</span>
        </div>
        <div className="control-item">
          <span>Space</span> <span>Hard Drop</span>
        </div>
        <div className="control-item">
          <span>↑ / X</span> <span>Rotate</span>
        </div>
        <div className="control-item">
          <span>P</span> <span>Pause</span>
        </div>
      </div>
    </div>
  );
};