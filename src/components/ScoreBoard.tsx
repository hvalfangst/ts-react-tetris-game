import React from 'react';
import type { GameState } from '../types/tetris';

interface ScoreBoardProps {
  gameState: GameState;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  return (
    <div className="scoreboard">
      <div className="score-item">
        <span className="label">Score</span>
        <span className="value">{gameState.score.toLocaleString()}</span>
      </div>
      
      <div className="score-item">
        <span className="label">Level</span>
        <span className="value">{gameState.level}</span>
      </div>
      
      <div className="score-item">
        <span className="label">Lines</span>
        <span className="value">{gameState.lines}</span>
      </div>
      
      <div className="score-item">
        <span className="label">Speed</span>
        <span className="value">{Math.max(1, 10 - gameState.level)}/10</span>
      </div>
    </div>
  );
};