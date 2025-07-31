import React from 'react';
import type { CellType } from '../types/tetris';

interface CellProps {
  type: CellType;
  x: number;
  y: number;
}

const getCellColor = (type: CellType): string => {
  if (type < 0) {
    // Ghost piece - semi-transparent version of the color
    const actualType = Math.abs(type) as CellType;
    return getCellColor(actualType).replace('1)', '0.3)');
  }

  switch (type) {
    case 0: return 'rgba(20, 20, 30, 0.8)'; // Empty
    case 1: return 'rgba(0, 255, 255, 1)'; // I - Cyan
    case 2: return 'rgba(255, 255, 0, 1)'; // O - Yellow
    case 3: return 'rgba(128, 0, 128, 1)'; // T - Purple
    case 4: return 'rgba(0, 255, 0, 1)'; // S - Green
    case 5: return 'rgba(255, 0, 0, 1)'; // Z - Red
    case 6: return 'rgba(0, 0, 255, 1)'; // J - Blue
    case 7: return 'rgba(255, 165, 0, 1)'; // L - Orange
    default: return 'rgba(20, 20, 30, 0.8)';
  }
};

const getCellBorder = (type: CellType): string => {
  if (type === 0) return '1px solid rgba(60, 60, 80, 0.3)';
  if (type < 0) return '1px solid rgba(255, 255, 255, 0.2)';
  return '2px solid rgba(255, 255, 255, 0.3)';
};

export const Cell: React.FC<CellProps> = ({ type, x, y }) => {
  const isEmpty = type === 0;
  const isGhost = type < 0;
  
  return (
    <div
      className={`cell ${isEmpty ? 'empty' : ''} ${isGhost ? 'ghost' : ''}`}
      style={{
        backgroundColor: getCellColor(type),
        border: getCellBorder(type),
        boxShadow: !isEmpty && !isGhost ? 'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3)' : 'none',
      }}
      data-x={x}
      data-y={y}
    />
  );
};