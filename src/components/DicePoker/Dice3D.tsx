import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';

interface Dice3DProps {
  value: number; // 1 to 6
  isLocked: boolean;
  isRolling: boolean;
  rollIndex: number; // Incrementing counter to trigger animation
  staggerMs?: number; // Delay or duration variation
  onToggleLock?: () => void;
  disabled?: boolean;
}

export const Dice3D: React.FC<Dice3DProps> = ({
  value,
  isLocked,
  isRolling,
  rollIndex,
  staggerMs = 0,
  onToggleLock,
  disabled = false,
}) => {
  const [animating, setAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);

  useEffect(() => {
    if (isRolling && !isLocked) {
      setAnimating(true);
      
      // Generate random tumble rotations
      const targetRotX = (Math.floor(Math.random() * 4) + 3) * 360 + (Math.random() > 0.5 ? 0 : 180);
      const targetRotY = (Math.floor(Math.random() * 4) + 3) * 360 + (Math.random() > 0.5 ? 90 : 270);
      const targetRotZ = Math.floor(Math.random() * 180) - 90;

      setRotX(targetRotX);
      setRotY(targetRotY);
      setRotZ(targetRotZ);

      // Rapidly flicker display values during tumble
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 70);

      // Stop rolling after duration with stagger
      const duration = 1000 + staggerMs;
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setDisplayValue(value);
        setAnimating(false);
        setRotX(0);
        setRotY(0);
        setRotZ(0);
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setDisplayValue(value);
      setAnimating(false);
    }
  }, [isRolling, rollIndex, isLocked, value, staggerMs]);

  // Pip positions mapping for 1..6
  const renderPips = (val: number) => {
    const pips: Record<number, string[]> = {
      1: ['center'],
      2: ['top-right', 'bottom-left'],
      3: ['top-right', 'center', 'bottom-left'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'center-left', 'center-right', 'bottom-left', 'bottom-right'],
    };

    const currentPips = pips[val] || pips[1];

    return (
      <div className="w-full h-full relative p-2 grid grid-cols-3 grid-rows-3 items-center justify-items-center">
        {currentPips.includes('top-left') && <div className="col-start-1 row-start-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#06b6d4]" />}
        {currentPips.includes('top-right') && <div className="col-start-3 row-start-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#06b6d4]" />}
        {currentPips.includes('center-left') && <div className="col-start-1 row-start-2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#06b6d4]" />}
        {currentPips.includes('center') && <div className="col-start-2 row-start-2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />}
        {currentPips.includes('center-right') && <div className="col-start-3 row-start-2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#06b6d4]" />}
        {currentPips.includes('bottom-left') && <div className="col-start-1 row-start-3 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#06b6d4]" />}
        {currentPips.includes('bottom-right') && <div className="col-start-3 row-start-3 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#06b6d4]" />}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center select-none group touch-manipulation">
      {/* Lock Status Badge Above Die */}
      <div className="h-5 flex items-center justify-center mb-1">
        {isLocked && (
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/90 border border-amber-500/80 px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-in fade-in duration-200">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            ZACHOWANA
          </span>
        )}
      </div>

      {/* Main Die 3D Container */}
      <div
        onClick={() => {
          if (!disabled && onToggleLock) onToggleLock();
        }}
        className={`relative w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 cursor-pointer transition-all duration-300 ease-out transform-gpu ${
          isLocked
            ? '-translate-y-2 scale-105'
            : 'hover:-translate-y-1 hover:scale-102'
        }`}
      >
        {/* Soft Dynamic Cast Shadow */}
        <div
          className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 ${
            animating
              ? 'w-10 h-2 bg-black/30 blur-md scale-125 animate-pulse'
              : isLocked
              ? 'w-12 h-3 bg-amber-500/20 blur-sm'
              : 'w-10 h-2.5 bg-black/60 blur-xs'
          }`}
        />

        {/* Die Body Cube Surface */}
        <div
          style={{
            transform: animating
              ? `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(0.92)`
              : 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)',
            transition: animating ? `transform ${1000 + staggerMs}ms cubic-bezier(0.15, 0.85, 0.35, 1.2)` : 'transform 200ms ease-out',
            filter: animating ? 'blur(0.8px)' : 'none',
          }}
          className={`w-full h-full rounded-2xl p-1 sm:p-1.5 transition-colors duration-200 flex items-center justify-center relative overflow-hidden border backdrop-blur-xl ${
            isLocked
              ? 'bg-gradient-to-br from-amber-900/90 via-slate-900/95 to-amber-950/90 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6),inset_0_0_15px_rgba(245,158,11,0.3)] ring-2 ring-amber-500/50'
              : animating
              ? 'bg-gradient-to-br from-cyan-900/90 via-slate-900/95 to-slate-950/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)]'
              : 'bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-black/90 border-slate-700/80 hover:border-cyan-400/80 shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]'
          }`}
        >
          {/* Glass Specular Glare Effect */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-gradient-to-br from-white/20 via-transparent to-transparent rotate-45 pointer-events-none" />

          {/* Render Pips */}
          {renderPips(displayValue)}
        </div>
      </div>
    </div>
  );
};
