import React from 'react';
import type { CellType, Piece } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../types/tetris';
import { Cell } from './Cell';
import { ParticleSystem } from './ParticleSystem';

interface GameBoardProps {
  board: CellType[][];
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
  particles: any[];
  screenShake: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPiece,
  ghostPiece,
  particles,
  screenShake,
}) => {
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);

    // Add ghost piece to display board
    if (ghostPiece) {
      for (let y = 0; y < ghostPiece.shape.length; y++) {
        for (let x = 0; x < ghostPiece.shape[y].length; x++) {
          if (ghostPiece.shape[y][x] !== 0) {
            const boardY = ghostPiece.position.y + y;
            const boardX = ghostPiece.position.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH &&
              displayBoard[boardY][boardX] === 0
            ) {
              // Use negative value to indicate ghost piece
              displayBoard[boardY][boardX] = -ghostPiece.color as CellType;
            }
          }
        }
      }
    }

    // Add current piece to display board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  const displayBoard = renderBoard();
  const shakeTransform = screenShake > 0 
    ? `translate(${(Math.random() - 0.5) * screenShake}px, ${(Math.random() - 0.5) * screenShake}px)`
    : 'none';

  return (
    <div className="game-board-container" style={{ transform: shakeTransform }}>
      <div className="game-board">
        {displayBoard.map((row, y) =>
          row.map((cellType, x) => (
            <Cell
              key={`${x}-${y}`}
              type={cellType}
              x={x}
              y={y}
            />
          ))
        )}
      </div>
      <ParticleSystem particles={particles} />
    </div>
  );
};