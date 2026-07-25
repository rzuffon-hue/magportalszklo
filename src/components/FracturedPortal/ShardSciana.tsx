import React, { useState } from 'react';
import { LayoutList } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassRimHighlight } from './GlassRimHighlight';
import { EtchedGlassIcon } from './EtchedGlassIcon';
import { ShardProps } from './ShardCzaty';

export const ShardSciana: React.FC<ShardProps> = ({
  onHoverShard,
  isAnyHovered,
  isHovered,
  clipPath,
  contentStyle,
  isShattered = true,
  isShattering = false,
  staggerDelayMs = 1640
}) => {
  const { setActiveView, posts, playShardSound } = useApp();
  const [isTouched, setIsTouched] = useState(false);

  const handleClick = () => {
    if (!isShattered && !isShattering) return;
    setIsTouched(true);
    setTimeout(() => setIsTouched(false), 220);
    playShardSound('sciana');
    setActiveView('sciana');
  };

  const activePolygon = clipPath || 'polygon(44% 18%, 72% 42%, 64% 62%, 36% 65%, 28% 38%)';

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => isShattered && onHoverShard('sciana')}
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
          background: 'radial-gradient(circle at 50% 40%, rgba(14, 116, 144, 0.22) 0%, rgba(15, 12, 28, 0.25) 70%, rgba(3, 5, 12, 0.35) 100%)',
          opacity: isShattered ? 1 : isShattering ? 1 : 0,
          transitionDuration: isShattering ? '500ms' : '300ms',
          transitionDelay: isShattering ? '1100ms' : '0ms'
        }}
      />

      {/* 2. Smoked Obsidian Glass Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-sky-950/15 via-slate-950/25 to-black/40 pointer-events-none transition-opacity"
        style={{
          opacity: isShattered ? 1 : isShattering ? 1 : 0,
          transitionDuration: isShattering ? '500ms' : '300ms',
          transitionDelay: isShattering ? '1100ms' : '0ms'
        }}
      />

      {/* 3. Refracted Glass Rim Edge */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity"
        style={{
          opacity: isShattered ? 1 : isShattering ? 1 : 0,
          transitionDuration: isShattering ? '500ms' : '300ms',
          transitionDelay: isShattering ? '900ms' : '0ms'
        }}
      >
        <GlassRimHighlight clipPath={activePolygon} themeColor="rgba(56, 189, 248, 0.4)" />
      </div>

      {/* 4. Instant Touch Material Light Flash Wave (150-250ms) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-150 z-20 bg-gradient-to-tr from-white/35 via-sky-300/30 to-transparent ${
          isTouched ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 5. Micro-crack Internal Refraction Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15 stroke-sky-200/40" viewBox="0 0 400 300">
        <path d="M 120,40 L 160,110 L 140,180 L 190,260" strokeWidth="0.8" fill="none" strokeDasharray="12 4 8 2" />
        <path d="M 280,30 L 250,120 L 290,210" strokeWidth="0.7" fill="none" strokeDasharray="15 3 10 2" />
        <path d="M 160,110 L 220,130 L 250,120" strokeWidth="0.6" fill="none" strokeDasharray="6 2" />
      </svg>

      {/* 6. Safe Inner Content Container */}
      <div
        className="relative z-10 p-2 sm:p-4 flex flex-col items-center justify-center h-full w-full overflow-hidden transition-all ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          ...(contentStyle || { height: '100%', width: '100%' }),
          opacity: isShattered ? 1 : isShattering ? 1 : 0,
          transform: isShattered ? 'scale(1) translateY(0px)' : isShattering ? 'scale(1) translateY(0px)' : 'scale(0.96) translateY(4px)',
          transitionDuration: isShattering ? '450ms' : '200ms',
          transitionDelay: isShattering ? '1300ms' : '0ms'
        }}
      >
        <EtchedGlassIcon
          icon={LayoutList}
          size={58}
          label="ŚCIANA"
          badge={posts.length > 0 ? posts.length : undefined}
          reflectionClass="text-sky-300/80 group-hover:text-sky-100"
          isTouched={isTouched}
        />
      </div>

      {/* 7. Ambient Material Depth Glow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-32 bg-sky-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-400/25 transition-all" />
    </div>
  );
};

