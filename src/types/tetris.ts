export type CellType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  shape: number[][];
  color: CellType;
  position: Position;
}

export interface GameState {
  board: CellType[][];
  currentPiece: Piece | null;
  nextPiece: Piece | null;
  score: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
  dropTime: number;
}

export interface LinesClearedEffect {
  lines: number[];
  timestamp: number;
}

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export const TetrominoType = {
  I: 1,
  O: 2,
  T: 3,
  S: 4,
  Z: 5,
  J: 6,
  L: 7,
} as const;

export type TetrominoType = typeof TetrominoType[keyof typeof TetrominoType];

export const TETROMINOS = {
  [TetrominoType.I]: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: TetrominoType.I,
  },
  [TetrominoType.O]: {
    shape: [
      [2, 2],
      [2, 2],
    ],
    color: TetrominoType.O,
  },
  [TetrominoType.T]: {
    shape: [
      [0, 3, 0],
      [3, 3, 3],
      [0, 0, 0],
    ],
    color: TetrominoType.T,
  },
  [TetrominoType.S]: {
    shape: [
      [0, 4, 4],
      [4, 4, 0],
      [0, 0, 0],
    ],
    color: TetrominoType.S,
  },
  [TetrominoType.Z]: {
    shape: [
      [5, 5, 0],
      [0, 5, 5],
      [0, 0, 0],
    ],
    color: TetrominoType.Z,
  },
  [TetrominoType.J]: {
    shape: [
      [6, 0, 0],
      [6, 6, 6],
      [0, 0, 0],
    ],
    color: TetrominoType.J,
  },
  [TetrominoType.L]: {
    shape: [
      [0, 0, 7],
      [7, 7, 7],
      [0, 0, 0],
    ],
    color: TetrominoType.L,
  },
};

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const PREVIEW_SIZE = 4;