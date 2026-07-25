// MaG Snow Blocks - Falling Block Puzzle Engine
// Handles tetronimo pieces, board matrix, ghost piece, line clearing animations, combos, and score mechanics.

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface PieceShape {
  type: PieceType;
  color: string;
  glowColor: string;
  matrix: number[][]; // 2D grid representation
}

export const PIECES: Record<PieceType, PieceShape> = {
  I: {
    type: 'I',
    color: '#38bdf8', // sky cyan
    glowColor: '#0284c7',
    matrix: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  O: {
    type: 'O',
    color: '#facc15', // yellow ice
    glowColor: '#ca8a04',
    matrix: [
      [1, 1],
      [1, 1]
    ]
  },
  T: {
    type: 'T',
    color: '#c084fc', // purple frost
    glowColor: '#9333ea',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  S: {
    type: 'S',
    color: '#4ade80', // emerald glacier
    glowColor: '#16a34a',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ]
  },
  Z: {
    type: 'Z',
    color: '#f87171', // red frost
    glowColor: '#dc2626',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]
  },
  J: {
    type: 'J',
    color: '#60a5fa', // deep blue
    glowColor: '#2563eb',
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  L: {
    type: 'L',
    color: '#fb923c', // orange fire-ice
    glowColor: '#ea580c',
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ]
  }
};

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export interface BoardCell {
  filled: boolean;
  color: string;
  glowColor: string;
  isFrosted?: boolean; // Special Frosted Block twist
}

export interface ActivePiece {
  type: PieceType;
  matrix: number[][];
  x: number;
  y: number;
  color: string;
  glowColor: string;
  isFrosted?: boolean;
}

export interface ShatterParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

// Generate random piece sequence
export function getRandomPiece(isFrostedChance: boolean = false): ActivePiece {
  const types: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const type = types[Math.floor(Math.random() * types.length)];
  const shape = PIECES[type];

  // Deep copy matrix
  const matrix = shape.matrix.map((row) => [...row]);

  // Initial spawn offset centered at top
  const x = Math.floor((BOARD_WIDTH - matrix[0].length) / 2);
  const y = 0;

  return {
    type,
    matrix,
    x,
    y,
    color: shape.color,
    glowColor: shape.glowColor,
    isFrosted: isFrostedChance && Math.random() < 0.2
  };
}

// Rotate matrix 90 deg clockwise
export function rotateMatrix(matrix: number[][]): number[][] {
  const N = matrix.length;
  const result: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      result[c][N - 1 - r] = matrix[r][c];
    }
  }
  return result;
}

// Collision check
export function checkCollision(
  piece: ActivePiece,
  board: BoardCell[][],
  offsetX: number = 0,
  offsetY: number = 0,
  customMatrix?: number[][]
): boolean {
  const m = customMatrix || piece.matrix;
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      if (m[r][c]) {
        const newX = piece.x + c + offsetX;
        const newY = piece.y + r + offsetY;

        // Check horizontal bounds
        if (newX < 0 || newX >= BOARD_WIDTH) return true;

        // Check bottom bound
        if (newY >= BOARD_HEIGHT) return true;

        // Check existing filled blocks on board
        if (newY >= 0 && board[newY][newX].filled) return true;
      }
    }
  }
  return false;
}

// Get Ghost Piece Y coordinate
export function getGhostY(piece: ActivePiece, board: BoardCell[][]): number {
  let ghostY = piece.y;
  while (!checkCollision(piece, board, 0, ghostY - piece.y + 1)) {
    ghostY++;
  }
  return ghostY;
}

// Calculate Score for cleared lines
export function getLineScore(linesCount: number, level: number): number {
  switch (linesCount) {
    case 1:
      return 100 * level;
    case 2:
      return 300 * level;
    case 3:
      return 500 * level;
    case 4:
      return 800 * level; // FROST BREAK!
    default:
      return 0;
  }
}

// Calculate drop speed delay (ms) per level
export function getDropSpeedMs(level: number): number {
  return Math.max(80, 800 - (level - 1) * 35);
}
