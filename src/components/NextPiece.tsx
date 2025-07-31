import React from 'react';
import type { Piece, CellType } from '../types/tetris';
import { PREVIEW_SIZE } from '../types/tetris';
import { Cell } from './Cell';

interface NextPieceProps {
  nextPiece: Piece | null;
}

export const NextPiece: React.FC<NextPieceProps> = ({ nextPiece }) => {
  const renderPreview = () => {
    const previewBoard: CellType[][] = Array.from({ length: PREVIEW_SIZE }, () =>
      Array.from({ length: PREVIEW_SIZE }, () => 0 as CellType)
    );

    if (nextPiece) {
      const offsetX = Math.floor((PREVIEW_SIZE - nextPiece.shape[0].length) / 2);
      const offsetY = Math.floor((PREVIEW_SIZE - nextPiece.shape.length) / 2);

      for (let y = 0; y < nextPiece.shape.length; y++) {
        for (let x = 0; x < nextPiece.shape[y].length; x++) {
          if (nextPiece.shape[y][x] !== 0) {
            const previewY = offsetY + y;
            const previewX = offsetX + x;
            if (
              previewY >= 0 &&
              previewY < PREVIEW_SIZE &&
              previewX >= 0 &&
              previewX < PREVIEW_SIZE
            ) {
              previewBoard[previewY][previewX] = nextPiece.color;
            }
          }
        }
      }
    }

    return previewBoard;
  };

  const previewBoard = renderPreview();

  return (
    <div className="next-piece">
      <h3>Next</h3>
      <div className="preview-board">
        {previewBoard.map((row, y) =>
          row.map((cellType, x) => (
            <Cell
              key={`preview-${x}-${y}`}
              type={cellType}
              x={x}
              y={y}
            />
          ))
        )}
      </div>
    </div>
  );
};