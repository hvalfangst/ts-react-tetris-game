import type {
  CellType,
  Position,
  Piece,
} from '../types/tetris';
import {
  TETROMINOS,
  TetrominoType,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '../types/tetris';

export const createEmptyBoard = (): CellType[][] => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0 as CellType)
  );
};

export const getRandomTetromino = (): Piece => {
  const tetrominoTypes = Object.keys(TETROMINOS).map(Number) as TetrominoType[];
  const randomType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
  const tetromino = TETROMINOS[randomType];
  
  return {
    shape: tetromino.shape.map(row => [...row]),
    color: tetromino.color,
    position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2), y: 0 },
  };
};

export const rotatePiece = (piece: Piece): Piece => {
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  
  return {
    ...piece,
    shape: rotated,
  };
};

export const isValidPosition = (board: CellType[][], piece: Piece, position: Position): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const newX = position.x + x;
        const newY = position.y + y;
        
        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX] !== 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const placePiece = (board: CellType[][], piece: Piece): CellType[][] => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }
  
  return newBoard;
};

export const findCompletedLines = (board: CellType[][]): number[] => {
  const completedLines: number[] = [];
  
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every(cell => cell !== 0)) {
      completedLines.push(y);
    }
  }
  
  return completedLines;
};

export const clearLines = (board: CellType[][], lines: number[]): CellType[][] => {
  let newBoard = board.map(row => [...row]);
  
  // Remove completed lines
  lines.sort((a, b) => b - a); // Sort in descending order
  lines.forEach(lineIndex => {
    newBoard.splice(lineIndex, 1);
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => 0 as CellType));
  });
  
  return newBoard;
};

export const calculateScore = (lines: number, level: number): number => {
  const baseScores = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200,
  };
  
  return (baseScores[lines as keyof typeof baseScores] || 0) * (level + 1);
};

export const calculateLevel = (totalLines: number): number => {
  return Math.floor(totalLines / 10);
};

export const calculateDropTime = (level: number): number => {
  return Math.max(50, 800 - level * 50);
};

export const canMovePiece = (
  board: CellType[][],
  piece: Piece,
  direction: 'left' | 'right' | 'down'
): boolean => {
  const offset = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
  };
  
  const newPosition = {
    x: piece.position.x + offset[direction].x,
    y: piece.position.y + offset[direction].y,
  };
  
  return isValidPosition(board, piece, newPosition);
};

export const movePiece = (
  piece: Piece,
  direction: 'left' | 'right' | 'down'
): Piece => {
  const offset = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
  };
  
  return {
    ...piece,
    position: {
      x: piece.position.x + offset[direction].x,
      y: piece.position.y + offset[direction].y,
    },
  };
};

export const getGhostPiece = (board: CellType[][], piece: Piece): Piece => {
  let ghostPiece = { ...piece };
  
  while (canMovePiece(board, ghostPiece, 'down')) {
    ghostPiece = movePiece(ghostPiece, 'down');
  }
  
  return ghostPiece;
};

export const isGameOver = (board: CellType[][], piece: Piece): boolean => {
  return !isValidPosition(board, piece, piece.position);
};