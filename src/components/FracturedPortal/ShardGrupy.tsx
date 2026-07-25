import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassRimHighlight } from './GlassRimHighlight';
import { EtchedGlassIcon } from './EtchedGlassIcon';
import { ComicIllustration } from '../Comic/ComicComponents';
import { ShardProps } from './ShardCzaty';

export const ShardGrupy: React.FC<ShardProps> = ({
  onHoverShard,
  isAnyHovered,
  isHovered,
  clipPath,
  contentStyle,
  isShattered = true,
  isShattering = false,
  staggerDelayMs = 1710
}) => {
  const { setActiveView, groups, playShardSound, portalTheme } = useApp();
  const joinedCount = groups.filter(g => g.isJoined).length;
  const [isTouched, setIsTouched] = useState(false);
  const isMirror = portalTheme === 'lustrzany';
  const isComic = portalTheme === 'komiksowy';

  const handleClick = () => {
    if (!isShattered && !isShattering) return;
    setIsTouched(true);
    setTimeout(() => setIsTouched(false), 220);
    playShardSound('grupy');
    setActiveView('grupy');
  };

  const activePolygon = clipPath || 'polygon(0% 48%, 28% 38%, 36% 65%, 22% 82%, 0% 78%)';

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => isShattered && onHoverShard('grupy')}
      onMouseLeave={() => isShattered && onHoverShard(null)}
      className={`group relative transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] h-full w-full overflow-hidden select-none
        ${isShattered ? 'cursor-pointer' : 'pointer-events-none'}
        ${isHovered ? 'z-30 brightness-115' : isAnyHovered ? 'opacity-90' : 'z-20'}
      `}
      style={{
        clipPath: activePolygon,
      }}
    >
      {/* 1. Shard Background / Comic Art */}
      {isComic ? (
        <div className="absolute inset-0 z-0">
          <ComicIllustration type="grupy" className="opacity-90 transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
        </div>
      ) : (
        <div
          className="absolute inset-0 transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            background: isMirror
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(226, 232, 240, 0.95) 50%, rgba(203, 213, 225, 0.95) 100%)'
              : 'radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.22) 0%, rgba(15, 12, 28, 0.25) 70%, rgba(3, 5, 12, 0.35) 100%)',
            opacity: isShattered ? 1 : isShattering ? 1 : 0,
            transitionDuration: isShattering ? '500ms' : '300ms',
            transitionDelay: isShattering ? '1100ms' : '0ms'
          }}
        />
      )}

      {/* 2. Glass Vignette */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity ${
          isMirror
            ? 'bg-gradient-to-t from-white/70 via-slate-200/30 to-slate-400/40'
            : 'bg-gradient-to-t from-emerald-950/15 via-slate-950/25 to-black/40'
        }`}
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
        <GlassRimHighlight clipPath={activePolygon} themeColor={isMirror ? 'rgba(0, 0, 0, 0.8)' : 'rgba(16, 185, 129, 0.4)'} />
      </div>

      {/* 4. Instant Touch Wave */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-150 z-20 ${
          isMirror
            ? 'bg-gradient-to-tr from-black/20 via-white/50 to-transparent'
            : 'bg-gradient-to-tr from-white/35 via-emerald-300/30 to-transparent'
        } ${isTouched ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 5. Micro-crack Internal Refraction Lines */}
      <svg className={`absolute inset-0 w-full h-full pointer-events-none ${
        isMirror ? 'opacity-40 stroke-slate-950' : 'opacity-15 stroke-emerald-200/40'
      }`} viewBox="0 0 300 300">
        <path d="M 30,10 L 80,70 L 40,150 L 100,220" strokeWidth="0.8" fill="none" strokeDasharray="10 3 6 2" />
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
          icon={Users}
          size={52}
          label="GRUPY"
          badge={joinedCount > 0 ? joinedCount : undefined}
          reflectionClass={isMirror ? 'text-black' : 'text-emerald-300/80 group-hover:text-emerald-100'}
          isTouched={isTouched}
        />
      </div>

      {/* 7. Ambient Material Depth Glow */}
      <div className={`absolute -bottom-10 -left-10 w-36 h-36 rounded-full pointer-events-none transition-all ${
        isMirror ? 'bg-white/80 blur-2xl' : 'bg-emerald-600/15 blur-3xl group-hover:bg-emerald-500/25'
      }`} />
    </div>
  );
};

