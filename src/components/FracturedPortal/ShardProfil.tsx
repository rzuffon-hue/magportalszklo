import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassRimHighlight } from './GlassRimHighlight';
import { EtchedGlassIcon } from './EtchedGlassIcon';
import { ComicIllustration } from '../Comic/ComicComponents';
import { ShardProps } from './ShardCzaty';

export const ShardProfil: React.FC<ShardProps> = ({
  onHoverShard,
  isAnyHovered,
  isHovered,
  clipPath,
  contentStyle,
  isShattered = true,
  isShattering = false,
  staggerDelayMs = 1920
}) => {
  const { setActiveView, profile, playShardSound, portalTheme } = useApp();
  const [isTouched, setIsTouched] = useState(false);
  const isMirror = portalTheme === 'lustrzany';
  const isComic = portalTheme === 'komiksowy';

  const handleClick = () => {
    if (!isShattered && !isShattering) return;
    setIsTouched(true);
    setTimeout(() => setIsTouched(false), 220);
    playShardSound('profil');
    setActiveView('profil');
  };

  const activePolygon = clipPath || 'polygon(38% 100%, 68% 85%, 76% 100%, 100% 100%)';

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => isShattered && onHoverShard('profil')}
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
          <ComicIllustration type="profil" className="opacity-90 transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
        </div>
      ) : (
        <div
          className="absolute inset-0 transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            background: isMirror
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(226, 232, 240, 0.95) 50%, rgba(203, 213, 225, 0.95) 100%)'
              : 'radial-gradient(circle at 70% 80%, rgba(202, 138, 4, 0.22) 0%, rgba(15, 12, 28, 0.25) 70%, rgba(3, 5, 12, 0.35) 100%)',
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
            : 'bg-gradient-to-t from-amber-950/15 via-slate-950/25 to-black/40'
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
        <GlassRimHighlight clipPath={activePolygon} themeColor={isMirror ? 'rgba(0, 0, 0, 0.8)' : 'rgba(234, 179, 8, 0.4)'} />
      </div>

      {/* 4. Instant Touch Wave */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-150 z-20 ${
          isMirror
            ? 'bg-gradient-to-tr from-black/20 via-white/50 to-transparent'
            : 'bg-gradient-to-tr from-white/35 via-amber-300/30 to-transparent'
        } ${isTouched ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 5. Micro-crack Internal Refraction Lines */}
      <svg className={`absolute inset-0 w-full h-full pointer-events-none ${
        isMirror ? 'opacity-40 stroke-slate-950' : 'opacity-15 stroke-amber-200/40'
      }`} viewBox="0 0 300 300">
        <path d="M 80,20 L 120,80 L 100,160 L 150,240" strokeWidth="0.8" fill="none" strokeDasharray="10 3 6 2" />
      </svg>

      {/* 6. Safe Inner Content Container */}
      <div
        className="relative z-10 p-1 sm:p-2 flex flex-col items-center justify-center h-full w-full overflow-hidden transition-all ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          ...(contentStyle || { height: '100%', width: '100%' }),
          opacity: isShattered ? 1 : isShattering ? 1 : 0,
          transform: isShattered ? 'scale(1) translateY(0px)' : isShattering ? 'scale(1) translateY(0px)' : 'scale(0.96) translateY(4px)',
          transitionDuration: isShattering ? '450ms' : '200ms',
          transitionDelay: isShattering ? '1300ms' : '0ms'
        }}
      >
        <EtchedGlassIcon
          icon={Shield}
          size={42}
          label="PROFIL"
          reflectionClass={isMirror ? 'text-black' : 'text-amber-300/80 group-hover:text-amber-100'}
          isTouched={isTouched}
        />

        {/* Integrated User Status Chip */}
        <div className={`mt-0.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full border shadow-md ${
          isMirror
            ? 'bg-black text-white border-black font-black'
            : 'bg-slate-950/70 border-slate-700/40 backdrop-blur-md'
        }`}>
          <img
            src={profile.avatar}
            alt={profile.username}
            referrerPolicy="no-referrer"
            className="w-3 h-3 rounded-full object-cover ring-1 ring-white shrink-0"
          />
          <span className={`text-[8px] font-mono font-bold tracking-wider whitespace-nowrap ${
            isMirror ? 'text-white' : 'text-amber-300/90'
          }`}>
            LVL {profile.level}
          </span>
        </div>
      </div>

      {/* 7. Ambient Material Depth Glow */}
      <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-amber-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all" />
    </div>
  );
};

