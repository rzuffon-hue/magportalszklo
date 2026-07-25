import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassRimHighlight } from './GlassRimHighlight';
import { EtchedGlassIcon } from './EtchedGlassIcon';
import { ShardProps } from './ShardCzaty';

export const ShardGry: React.FC<ShardProps> = ({
  onHoverShard,
  isAnyHovered,
  isHovered,
  clipPath,
  contentStyle,
  isShattered = true,
  isShattering = false,
  staggerDelayMs = 1780
}) => {
  const { setActiveView, games, playShardSound } = useApp();
  const [isTouched, setIsTouched] = useState(false);

  const handleClick = () => {
    if (!isShattered && !isShattering) return;
    setIsTouched(true);
    setTimeout(() => setIsTouched(false), 220);
    playShardSound('gry');
    setActiveView('gry');
  };

  const activePolygon = clipPath || 'polygon(64% 62%, 100% 52%, 100% 100%, 76% 100%, 68% 85%)';

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => isShattered && onHoverShard('gry')}
      onMouseLeave={() => isShattered && onHoverShard(null)}
      className={`group relative transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] h-full w-full overflow-hidden select-none
        ${isShattered ? 'cursor-pointer' : 'pointer-events-none'}
        ${isHovered ? 'z-30 brightness-115' : isAnyHovered ? 'opacity-90' : 'z-20'}
      `}
      style={{
        clipPath: activePolygon,
      }}
    >
      {/* 1. Shard Subsurface Radial Depth Glow */}
      <div
        className="absolute inset-0 transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          background: 'radial-gradient(circle at 75% 70%, rgba(6, 182, 212, 0.22) 0%, rgba(15, 12, 28, 0.25) 70%, rgba(3, 5, 12, 0.35) 100%)',
          opacity: isShattered ? 1 : isShattering ? 1 : 0,
          transitionDuration: isShattering ? '600ms' : '300ms',
          transitionDelay: isShattering ? '1200ms' : '0ms'
        }}
      />

      {/* 2. Smoked Obsidian Glass Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-cyan-950/15 via-slate-950/25 to-black/40 pointer-events-none transition-opacity"
        style={{
          opacity: isShattered ? 1 : isShattering ? 1 : 0,
          transitionDuration: isShattering ? '600ms' : '300ms',
          transitionDelay: isShattering ? '1200ms' : '0ms'
        }}
      />

      {/* 3. Refracted Glass Rim Edge */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity"
        style={{
          opacity: isShattered ? 1 : isShattering ? 1 : 0,
          transitionDuration: isShattering ? '500ms' : '300ms',
          transitionDelay: isShattering ? '1200ms' : '0ms'
        }}
      >
        <GlassRimHighlight clipPath={activePolygon} themeColor="rgba(6, 182, 212, 0.5)" />
      </div>

      {/* 4. Instant Touch Material Light Flash Wave (150-250ms) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-150 z-20 bg-gradient-to-tr from-white/35 via-cyan-300/30 to-transparent ${
          isTouched ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 5. Micro-crack Internal Refraction Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15 stroke-cyan-200/40" viewBox="0 0 300 300">
        <path d="M 120,20 L 160,80 L 140,160 L 190,240" strokeWidth="0.8" fill="none" strokeDasharray="10 3 6 2" />
      </svg>

      {/* 6. Safe Inner Content Container */}
      <div
        className="relative z-10 p-2 sm:p-4 flex flex-col items-center justify-center h-full w-full overflow-hidden transition-all ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          ...(contentStyle || { height: '100%', width: '100%' }),
          opacity: isShattered ? 1 : isShattering ? 1 : 0,
          transform: isShattered ? 'translateY(0px)' : isShattering ? 'translateY(0px)' : 'translateY(6px)',
          transitionDuration: isShattering ? '350ms' : '200ms',
          transitionDelay: isShattering ? `${staggerDelayMs}ms` : '0ms'
        }}
      >
        <EtchedGlassIcon
          icon={Gamepad2}
          size={52}
          label="GRY"
          badge={games.length > 0 ? games.length : undefined}
          reflectionClass="text-cyan-300/80 group-hover:text-cyan-100"
          isTouched={isTouched}
        />
      </div>

      {/* 7. Ambient Material Depth Glow */}
      <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all" />
    </div>
  );
};

