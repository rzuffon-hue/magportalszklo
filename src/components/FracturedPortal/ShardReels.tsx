import React, { useState } from 'react';
import { Clapperboard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassRimHighlight } from './GlassRimHighlight';
import { EtchedGlassIcon } from './EtchedGlassIcon';
import { ShardProps } from './ShardCzaty';

export const ShardReels: React.FC<ShardProps> = ({
  onHoverShard,
  isAnyHovered,
  isHovered,
  clipPath,
  contentStyle,
  isShattered = true,
  isShattering = false,
  staggerDelayMs = 1570
}) => {
  const { setActiveView, reels, playShardSound } = useApp();
  const [isTouched, setIsTouched] = useState(false);

  const handleClick = () => {
    if (!isShattered && !isShattering) return;
    setIsTouched(true);
    setTimeout(() => setIsTouched(false), 220);
    playShardSound('reels');
    setActiveView('reels');
  };

  const activePolygon = clipPath || 'polygon(44% 0%, 100% 0%, 100% 52%, 72% 42%, 44% 18%)';

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => isShattered && onHoverShard('reels')}
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
          background: 'radial-gradient(circle at 70% 30%, rgba(225, 29, 72, 0.22) 0%, rgba(15, 12, 28, 0.25) 70%, rgba(3, 5, 12, 0.35) 100%)',
          opacity: isShattered ? 1 : isShattering ? 1 : 0,
          transitionDuration: isShattering ? '600ms' : '300ms',
          transitionDelay: isShattering ? '1200ms' : '0ms'
        }}
      />

      {/* 2. Smoked Obsidian Glass Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-rose-950/15 via-slate-950/25 to-black/40 pointer-events-none transition-opacity"
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
        <GlassRimHighlight clipPath={activePolygon} themeColor="rgba(244, 63, 94, 0.5)" />
      </div>

      {/* 4. Instant Touch Material Light Flash Wave (150-250ms) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-150 z-20 bg-gradient-to-tr from-white/35 via-rose-300/30 to-transparent ${
          isTouched ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 5. Micro-crack Internal Refraction Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15 stroke-rose-200/40" viewBox="0 0 300 400">
        <path d="M 60,30 L 100,120 L 70,210 L 120,330" strokeWidth="0.8" fill="none" strokeDasharray="10 3 6 2" />
        <path d="M 210,40 L 180,150 L 230,290" strokeWidth="0.7" fill="none" strokeDasharray="12 4 8 2" />
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
          icon={Clapperboard}
          size={52}
          label="REELS"
          badge={reels.length > 0 ? reels.length : undefined}
          reflectionClass="text-rose-300/80 group-hover:text-rose-100"
          isTouched={isTouched}
        />
      </div>

      {/* 7. Ambient Material Depth Glow */}
      <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-rose-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/25 transition-all" />
    </div>
  );
};

