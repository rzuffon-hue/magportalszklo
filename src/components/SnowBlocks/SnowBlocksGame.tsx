import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  X,
  HelpCircle,
  Zap,
  Snowflake,
  Layers,
  Flame,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BoardCell,
  ActivePiece,
  PieceType,
  PIECES,
  getRandomPiece,
  rotateMatrix,
  checkCollision,
  getGhostY,
  getLineScore,
  getDropSpeedMs,
  ShatterParticle
} from './gameEngine';
import { SnowBlocksLeaderboard, SnowBlocksScoreRecord } from './SnowBlocksLeaderboard';

interface SnowBlocksGameProps {
  onBackToCatalog: () => void;
}

export const SnowBlocksGame: React.FC<SnowBlocksGameProps> = ({ onBackToCatalog }) => {
  const { profile, usersList } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // HUD States
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [linesCleared, setLinesCleared] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(0);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Special Visual FX Banners
  const [frostBreakBanner, setFrostBreakBanner] = useState<boolean>(false);
  const [comboToast, setComboToast] = useState<string | null>(null);

  // Next pieces queue (3 pieces) & Hold Piece
  const [nextPieces, setNextPieces] = useState<ActivePiece[]>([]);
  const [holdPiece, setHoldPiece] = useState<ActivePiece | null>(null);
  const [canHold, setCanHold] = useState<boolean>(true);

  // Engine Refs (State persistence for RAF animation loop)
  const boardRef = useRef<BoardCell[][]>(
    Array.from({ length: BOARD_HEIGHT }, () =>
      Array.from({ length: BOARD_WIDTH }, () => ({ filled: false, color: '', glowColor: '' }))
    )
  );
  const activePieceRef = useRef<ActivePiece | null>(null);
  const nextQueueRef = useRef<ActivePiece[]>([]);
  const holdPieceRef = useRef<ActivePiece | null>(null);
  const canHoldRef = useRef<boolean>(true);

  const scoreRef = useRef<number>(0);
  const levelRef = useRef<number>(1);
  const linesRef = useRef<number>(0);
  const comboRef = useRef<number>(0);
  const maxComboRef = useRef<number>(0);

  const lastDropTimeRef = useRef<number>(performance.now());
  const particlesRef = useRef<ShatterParticle[]>([]);
  const clearingLinesRef = useRef<{ row: number; alpha: number }[]>([]);

  // Touch Gesture Handling Refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Load Best Score on mount
  useEffect(() => {
    const raw = localStorage.getItem('mag_snow_blocks_leaderboard');
    if (raw) {
      try {
        const list: SnowBlocksScoreRecord[] = JSON.parse(raw);
        const userRec = list.find((r) => r.userId === profile.id);
        if (userRec) {
          setBestScore(userRec.score);
        } else if (list.length > 0) {
          setBestScore(list[0].score);
        }
      } catch {
        setBestScore(0);
      }
    }
  }, [profile.id]);

  // Start / Reset Game
  const startNewGame = () => {
    boardRef.current = Array.from({ length: BOARD_HEIGHT }, () =>
      Array.from({ length: BOARD_WIDTH }, () => ({ filled: false, color: '', glowColor: '' }))
    );

    const isFrosted = levelRef.current >= 3;
    const p1 = getRandomPiece(isFrosted);
    const p2 = getRandomPiece(isFrosted);
    const p3 = getRandomPiece(isFrosted);
    const p4 = getRandomPiece(isFrosted);

    activePieceRef.current = p1;
    nextQueueRef.current = [p2, p3, p4];
    setNextPieces([p2, p3, p4]);

    holdPieceRef.current = null;
    setHoldPiece(null);

    canHoldRef.current = true;
    setCanHold(true);

    scoreRef.current = 0;
    levelRef.current = 1;
    linesRef.current = 0;
    comboRef.current = 0;
    maxComboRef.current = 0;

    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setComboCount(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsNewRecord(false);

    lastDropTimeRef.current = performance.now();
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Spawn Next Piece
  const spawnNextPiece = () => {
    const queue = nextQueueRef.current;
    const nextPiece = queue.shift() || getRandomPiece(levelRef.current >= 3);
    const newQueuePiece = getRandomPiece(levelRef.current >= 3);
    queue.push(newQueuePiece);

    nextQueueRef.current = [...queue];
    setNextPieces([...queue]);

    // Reset position
    nextPiece.x = Math.floor((BOARD_WIDTH - nextPiece.matrix[0].length) / 2);
    nextPiece.y = 0;

    activePieceRef.current = nextPiece;
    canHoldRef.current = true;
    setCanHold(true);

    // Check immediate game over collision
    if (checkCollision(nextPiece, boardRef.current)) {
      handleGameOver();
    }
  };

  // Hold Piece Action
  const handleHoldAction = () => {
    if (!canHoldRef.current || !activePieceRef.current || isGameOver || isPaused) return;

    canHoldRef.current = false;
    setCanHold(false);

    const current = activePieceRef.current;

    if (!holdPieceRef.current) {
      holdPieceRef.current = current;
      setHoldPiece(current);
      spawnNextPiece();
    } else {
      const temp = holdPieceRef.current;
      holdPieceRef.current = current;
      setHoldPiece(current);

      temp.x = Math.floor((BOARD_WIDTH - temp.matrix[0].length) / 2);
      temp.y = 0;
      activePieceRef.current = temp;
    }
  };

  // Lock Piece into Board
  const lockPiece = () => {
    const piece = activePieceRef.current;
    if (!piece) return;

    const board = boardRef.current;
    let placedCellsCount = 0;

    for (let r = 0; r < piece.matrix.length; r++) {
      for (let c = 0; c < piece.matrix[r].length; c++) {
        if (piece.matrix[r][c]) {
          const boardY = piece.y + r;
          const boardX = piece.x + c;

          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            board[boardY][boardX] = {
              filled: true,
              color: piece.color,
              glowColor: piece.glowColor,
              isFrosted: piece.isFrosted
            };
            placedCellsCount++;
          }
        }
      }
    }

    // Check for Cleared Lines
    checkAndClearLines();
    spawnNextPiece();
  };

  // Check & Clear Full Lines with Animation
  const checkAndClearLines = () => {
    const board = boardRef.current;
    const fullRows: number[] = [];

    for (let r = 0; r < BOARD_HEIGHT; r++) {
      let isFull = true;
      for (let c = 0; c < BOARD_WIDTH; c++) {
        if (!board[r][c].filled) {
          isFull = false;
          break;
        }
      }
      if (isFull) {
        fullRows.push(r);
      }
    }

    if (fullRows.length > 0) {
      // Increment combo
      comboRef.current += 1;
      if (comboRef.current > maxComboRef.current) {
        maxComboRef.current = comboRef.current;
      }
      setComboCount(comboRef.current);

      if (comboRef.current >= 2) {
        setComboToast(`COMBO x${comboRef.current}!`);
        setTimeout(() => setComboToast(null), 1500);
      }

      // Check 4-line clear special effect (FROST BREAK)
      if (fullRows.length === 4) {
        setFrostBreakBanner(true);
        setTimeout(() => setFrostBreakBanner(false), 2000);
      }

      // Calculate score & level update
      const linesClearedCount = fullRows.length;
      const points = getLineScore(linesClearedCount, levelRef.current) + (comboRef.current - 1) * 50;
      
      scoreRef.current += points;
      setScore(scoreRef.current);

      linesRef.current += linesClearedCount;
      setLinesCleared(linesRef.current);

      const newLevel = Math.floor(linesRef.current / 10) + 1;
      if (newLevel !== levelRef.current) {
        levelRef.current = newLevel;
        setLevel(newLevel);
      }

      // Spawn Shatter Particles for cleared lines
      fullRows.forEach((r) => {
        for (let c = 0; c < BOARD_WIDTH; c++) {
          const cell = board[r][c];
          for (let p = 0; p < 3; p++) {
            particlesRef.current.push({
              x: c * 28 + 14,
              y: r * 28 + 14,
              vx: (Math.random() - 0.5) * 160,
              vy: (Math.random() - 0.5) * 160 - 40,
              color: cell.color || '#38bdf8',
              size: Math.random() * 5 + 2,
              alpha: 1.0,
              life: 0.35
            });
          }
        }
      });

      // Remove lines from matrix
      fullRows.forEach((r) => {
        board.splice(r, 1);
        board.unshift(
          Array.from({ length: BOARD_WIDTH }, () => ({ filled: false, color: '', glowColor: '' }))
        );
      });
    } else {
      // Reset combo if no line cleared
      comboRef.current = 0;
      setComboCount(0);
    }
  };

  // Movement Helpers
  const moveLeft = () => {
    const piece = activePieceRef.current;
    if (!piece || isGameOver || isPaused) return;
    if (!checkCollision(piece, boardRef.current, -1, 0)) {
      piece.x -= 1;
    }
  };

  const moveRight = () => {
    const piece = activePieceRef.current;
    if (!piece || isGameOver || isPaused) return;
    if (!checkCollision(piece, boardRef.current, 1, 0)) {
      piece.x += 1;
    }
  };

  const rotatePiece = () => {
    const piece = activePieceRef.current;
    if (!piece || isGameOver || isPaused) return;

    const rotated = rotateMatrix(piece.matrix);
    // Wall kick attempts
    if (!checkCollision(piece, boardRef.current, 0, 0, rotated)) {
      piece.matrix = rotated;
    } else if (!checkCollision(piece, boardRef.current, -1, 0, rotated)) {
      piece.x -= 1;
      piece.matrix = rotated;
    } else if (!checkCollision(piece, boardRef.current, 1, 0, rotated)) {
      piece.x += 1;
      piece.matrix = rotated;
    }
  };

  const softDrop = () => {
    const piece = activePieceRef.current;
    if (!piece || isGameOver || isPaused) return;

    if (!checkCollision(piece, boardRef.current, 0, 1)) {
      piece.y += 1;
      scoreRef.current += 1;
      setScore(scoreRef.current);
    } else {
      lockPiece();
    }
  };

  const hardDrop = () => {
    const piece = activePieceRef.current;
    if (!piece || isGameOver || isPaused) return;

    let dropDist = 0;
    while (!checkCollision(piece, boardRef.current, 0, 1)) {
      piece.y += 1;
      dropDist++;
    }
    scoreRef.current += dropDist * 2;
    setScore(scoreRef.current);
    lockPiece();
  };

  // Handle Game Over
  const handleGameOver = () => {
    setIsGameOver(true);

    // Save to leaderboard
    const raw = localStorage.getItem('mag_snow_blocks_leaderboard');
    let list: SnowBlocksScoreRecord[] = [];
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {
        list = [];
      }
    }

    const currentBest = list.find((r) => r.userId === profile.id)?.score || 0;
    if (scoreRef.current > currentBest) {
      setIsNewRecord(true);
      setBestScore(scoreRef.current);
    }

    const newRec: SnowBlocksScoreRecord = {
      id: `sb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: profile.id,
      userName: profile.name,
      userRole: profile.role,
      avatar: profile.avatar,
      score: scoreRef.current,
      maxLevel: levelRef.current,
      linesCleared: linesRef.current,
      bestCombo: maxComboRef.current,
      timestamp: new Date().toLocaleDateString('pl-PL')
    };

    list.push(newRec);
    list.sort((a, b) => b.score - a.score);
    localStorage.setItem('mag_snow_blocks_leaderboard', JSON.stringify(list.slice(0, 50)));
  };

  // MAIN CANVAS RENDER ENGINE LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const renderLoop = (now: number) => {
      const dt = (now - lastDropTimeRef.current);

      // Auto Fall Step
      const speedMs = getDropSpeedMs(levelRef.current);
      if (!isPaused && !isGameOver && dt >= speedMs) {
        lastDropTimeRef.current = now;
        const piece = activePieceRef.current;
        if (piece) {
          if (!checkCollision(piece, boardRef.current, 0, 1)) {
            piece.y += 1;
          } else {
            lockPiece();
          }
        }
      }

      // Render Scene
      const cellW = canvas.width / BOARD_WIDTH;
      const cellH = canvas.height / BOARD_HEIGHT;

      // Dark Navy Background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glass Chamber Borders & Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let r = 0; r <= BOARD_HEIGHT; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellH);
        ctx.lineTo(canvas.width, r * cellH);
        ctx.stroke();
      }
      for (let c = 0; c <= BOARD_WIDTH; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellW, 0);
        ctx.lineTo(c * cellW, canvas.height);
        ctx.stroke();
      }

      // Render Locked Board Blocks
      const board = boardRef.current;
      for (let r = 0; r < BOARD_HEIGHT; r++) {
        for (let c = 0; c < BOARD_WIDTH; c++) {
          const cell = board[r][c];
          if (cell.filled) {
            drawIceBlock(ctx, c * cellW, r * cellH, cellW, cellH, cell.color, cell.glowColor, 1.0, cell.isFrosted);
          }
        }
      }

      // Render Ghost Piece
      const piece = activePieceRef.current;
      if (piece && !isGameOver && !isPaused) {
        const ghostY = getGhostY(piece, board);
        for (let r = 0; r < piece.matrix.length; r++) {
          for (let c = 0; c < piece.matrix[r].length; c++) {
            if (piece.matrix[r][c]) {
              const drawX = (piece.x + c) * cellW;
              const drawY = (ghostY + r) * cellH;
              drawIceBlock(ctx, drawX, drawY, cellW, cellH, piece.color, piece.glowColor, 0.22, false);
            }
          }
        }

        // Render Active Piece
        for (let r = 0; r < piece.matrix.length; r++) {
          for (let c = 0; c < piece.matrix[r].length; c++) {
            if (piece.matrix[r][c]) {
              const drawX = (piece.x + c) * cellW;
              const drawY = (piece.y + r) * cellH;
              drawIceBlock(ctx, drawX, drawY, cellW, cellH, piece.color, piece.glowColor, 1.0, piece.isFrosted);
            }
          }
        }
      }

      // Render Shatter Particles
      const activeParticles = particlesRef.current;
      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const pt = activeParticles[i];
        pt.x += pt.vx * 0.016;
        pt.y += pt.vy * 0.016;
        pt.life -= 0.016;
        pt.alpha = Math.max(0, pt.life / 0.35);

        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();

        if (pt.life <= 0) {
          activeParticles.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, isGameOver]);

  // Draw 3D Ice-Glass Block with Reflection Sheen
  const drawIceBlock = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    glowColor: string,
    alpha: number = 1.0,
    isFrosted: boolean = false
  ) => {
    ctx.save();
    ctx.globalAlpha = alpha;

    // Outer Glow / Border
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, w - 2, h - 2);

    // Inner Ice-Glass Gradient
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, glowColor);
    ctx.fillStyle = grad;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

    // Top-Left Sheen Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 2);
    ctx.lineTo(x + w - 4, y + 2);
    ctx.lineTo(x + 2, y + h - 4);
    ctx.fill();

    // Frosted Snowflake texture overlay if frosted
    if (isFrosted) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❄️', x + w / 2, y + h / 2);
    }

    ctx.restore();
  };

  // Touch Gesture Listeners (Swipe & Tap)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    const minDist = 28;

    if (Math.abs(dx) < 15 && Math.abs(dy) < 15 && dt < 250) {
      // TAP -> Rotate
      rotatePiece();
    } else if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal Swipe
      if (dx > minDist) moveRight();
      else if (dx < -minDist) moveLeft();
    } else {
      // Vertical Swipe
      if (dy > minDist) softDrop();
      else if (dy < -minDist) hardDrop();
    }

    touchStartRef.current = null;
  };

  // Render Mini Preview Grid for Next / Hold
  const renderMiniPreview = (piece: ActivePiece | null) => {
    if (!piece) {
      return (
        <div className="w-16 h-16 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-600 text-xs font-bold">
          PUSTE
        </div>
      );
    }

    return (
      <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 p-1.5 flex items-center justify-center">
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${piece.matrix[0].length}, minmax(0, 1fr))`
          }}
        >
          {piece.matrix.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}_${c}`}
                className="w-3.5 h-3.5 rounded-sm"
                style={{
                  backgroundColor: val ? piece.color : 'transparent',
                  boxShadow: val ? `0 0 6px ${piece.glowColor}` : 'none'
                }}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col overflow-hidden select-none">
      
      {/* 1. TOP MINIMAL HUD BAR */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 z-30 backdrop-blur-md">
        
        {/* Left: Back & Score */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBackToCatalog}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Powrót do Katalogu Gier"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Score */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black font-mono text-amber-300">{score.toLocaleString('pl-PL')}</span>
          </div>

          {/* Lines & Level */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <span>LVL {level}</span>
            <span>•</span>
            <span>{linesCleared} LINII</span>
          </div>
        </div>

        {/* Center: Title */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 px-3 py-1 rounded-2xl border border-cyan-500/30">
          <Snowflake className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
            MaG SNOW BLOCKS
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
            title="Ranking"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowRulesModal(true)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            title="Zasady"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SPECIAL EFFECT BANNERS */}
      {frostBreakBanner && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 text-black px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-500/40 animate-bounce pointer-events-none flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          FROST BREAK! (+800 PKT)
        </div>
      )}

      {comboToast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-amber-400 text-black px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/30 pointer-events-none">
          {comboToast}
        </div>
      )}

      {/* 2. MAIN GAME AREA (Board + Side Panels) */}
      <div className="relative flex-1 w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4 gap-3 sm:gap-6 overflow-hidden">
        
        {/* Left Panel: HOLD Piece */}
        <div className="hidden sm:flex flex-col items-center gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">HOLD</span>
          {renderMiniPreview(holdPiece)}
          <button
            disabled={!canHold}
            onClick={handleHoldAction}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all ${
              canHold
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 cursor-pointer'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            ZAMIEŃ
          </button>
        </div>

        {/* CENTER MAIN BOARD CANVAS */}
        <div className="relative aspect-[10/20] h-full max-h-[580px] bg-slate-950 border-2 border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10">
          <canvas
            ref={canvasRef}
            width={280}
            height={560}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full touch-none"
          />

          {/* Mobile Overlay Stats on Canvas */}
          <div className="sm:hidden absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono font-black text-cyan-300 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 pointer-events-none">
            <span>LVL {level}</span>
            <span>{linesCleared} LINII</span>
            <span>BEST: {bestScore}</span>
          </div>
        </div>

        {/* Right Panel: NEXT Queue (3 Pieces) */}
        <div className="hidden sm:flex flex-col items-center gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">NASTĘPNE</span>
          <div className="space-y-2">
            {nextPieces.map((p, idx) => (
              <div key={idx}>{renderMiniPreview(p)}</div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MOBILE ON-SCREEN TOUCH CONTROLS */}
      <div className="bg-slate-900/90 border-t border-slate-800 p-2 sm:p-3 flex items-center justify-between gap-2 z-30">
        {/* Hold Button */}
        <button
          disabled={!canHold}
          onClick={handleHoldAction}
          className={`px-3 py-2.5 rounded-2xl font-black text-xs uppercase transition-all ${
            canHold
              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 active:scale-95'
              : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
          }`}
        >
          HOLD
        </button>

        {/* Directional Touch Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={moveLeft}
            className="p-3 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 active:bg-slate-700 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={rotatePiece}
            className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 active:scale-95 cursor-pointer"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button
            onClick={moveRight}
            className="p-3 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 active:bg-slate-700 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={softDrop}
            className="p-3 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 active:bg-slate-700 active:scale-95 cursor-pointer"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Hard Drop Button */}
        <button
          onClick={hardDrop}
          className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center gap-1"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>DROP</span>
        </button>
      </div>

      {/* 4. GAME OVER MODAL */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-center text-slate-100">
            
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-xl border border-cyan-400/40 bg-gradient-to-tr from-cyan-600 to-blue-500 text-white">
              <Snowflake className="w-8 h-8 animate-spin-slow" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-wide">
                KONIEC GRY!
              </h2>
              <p className="text-xs text-cyan-300 font-bold uppercase mt-1">
                MaG SNOW BLOCKS
              </p>
              {isNewRecord && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider animate-bounce shadow-lg shadow-amber-400/30">
                  🎉 NOWY REKORD!
                </span>
              )}
            </div>

            {/* Stats Summary Grid */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Wynik:</span>
                <span className="text-base font-black text-amber-300 font-mono">{score.toLocaleString('pl-PL')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Poziom (LEVEL):</span>
                <span className="text-sm font-black text-white font-mono">{level}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Wyczyszczone Linie:</span>
                <span className="text-sm font-black text-cyan-300 font-mono">{linesCleared}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Maksymalne Combo:</span>
                <span className="text-sm font-black text-amber-400 font-mono">x{maxComboRef.current}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={startNewGame}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                ZAGRAJ PONOWNIE
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-black text-xs uppercase transition-all cursor-pointer"
                >
                  RANKING
                </button>
                <button
                  onClick={onBackToCatalog}
                  className="py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-black text-xs uppercase transition-all cursor-pointer"
                >
                  KATALOG GIER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RULES MODAL */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                ZASADY MaG SNOW BLOCKS
              </h3>
              <button onClick={() => setShowRulesModal(false)} className="p-1 rounded-full bg-slate-900 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>• <strong>Cel Gry:</strong> Układaj spadające lodowe bloki tak, aby tworzyć pełne poziome linie.</p>
              <p>• <strong>Frost Break:</strong> Wyczyszczenie 4 linii naraz nagradza specjalnym efektem i bonusową punktacją!</p>
              <p>• <strong>Gest Swipowania:</strong> Przesuwaj w lewo/prawo, w dół do powolnego opadania, w górę do błyskawicznego dropu, tapnij by obrócić.</p>
              <p>• <strong>Zamrożone Segmenty:</strong> Na wyższych poziomach pojawiają się zamrożone klocki wymagające rozbicia.</p>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white"
            >
              ROZUMIEM
            </button>
          </div>
        </div>
      )}

      {/* LEADERBOARD MODAL */}
      {showLeaderboard && (
        <SnowBlocksLeaderboard
          currentUser={profile}
          usersList={usersList}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
};
