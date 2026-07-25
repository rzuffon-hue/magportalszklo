import React, { useState } from 'react';
import { FissureShaderCanvas } from './FissureShaderCanvas';
import { CarvedMaGLogo } from './CarvedMaGLogo';
import { ShardCzaty } from './ShardCzaty';
import { ShardSciana } from './ShardSciana';
import { ShardReels } from './ShardReels';
import { ShardGrupy } from './ShardGrupy';
import { ShardGry } from './ShardGry';
import { ShardWydarzenia } from './ShardWydarzenia';
import { ShardProfil } from './ShardProfil';
import { ShatterAnimationOverlay } from './ShatterAnimationOverlay';
import { DESKTOP_SHARDS, MOBILE_SHARDS } from './portalGeometry';
import { useApp } from '../../context/AppContext';

const NOISE_GRAIN_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`;

export const FracturedPortalHome: React.FC = () => {
  const { animationState, login, portalTheme } = useApp();
  const [hoveredShard, setHoveredShard] = useState<string | null>(null);

  // Minimalist Login form state
  const [loginInput, setLoginInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAnyHovered = hoveredShard !== null;
  const isShattered = animationState === 'logged_in';
  const isShattering = animationState === 'shattering';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim() || !pinInput.trim()) {
      setErrorMsg('Wprowadź login i PIN');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const res = await login(loginInput, pinInput);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.message || 'Nieprawidłowy login lub PIN');
    }
  };

  // Helper to map shard id to component with phase parameters
  const renderShardComponent = (shardId: string, clipPath: string, contentStyle: React.CSSProperties) => {
    const shardProps = {
      onHoverShard: setHoveredShard,
      isAnyHovered,
      isHovered: hoveredShard === shardId,
      clipPath,
      contentStyle,
      isShattered,
      isShattering
    };

    switch (shardId) {
      case 'czaty':
        return <ShardCzaty {...shardProps} staggerDelayMs={1500} />;
      case 'reels':
        return <ShardReels {...shardProps} staggerDelayMs={1570} />;
      case 'sciana':
        return <ShardSciana {...shardProps} staggerDelayMs={1640} />;
      case 'grupy':
        return <ShardGrupy {...shardProps} staggerDelayMs={1710} />;
      case 'gry':
        return <ShardGry {...shardProps} staggerDelayMs={1780} />;
      case 'wydarzenia':
        return <ShardWydarzenia {...shardProps} staggerDelayMs={1850} />;
      case 'profil':
        return <ShardProfil {...shardProps} staggerDelayMs={1920} />;
      default:
        return null;
    }
  };

  const isComic = portalTheme === 'komiksowy';

  return (
    <div className={`relative w-full h-full overflow-hidden select-none transition-colors duration-500 ${
      isComic
        ? 'bg-amber-100 text-slate-950 comic-halftone'
        : portalTheme === 'lustrzany'
        ? 'bg-[#dbe4ee] text-slate-900'
        : 'bg-[#030508] text-slate-100'
    }`}>
      {/* Halftone Pattern Overlay for Comic Theme */}
      {isComic && (
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#0f172a_1.5px,transparent_1.5px)] [background-size:12px_12px] z-0" />
      )}

      {/* 1. Dynamic Subtle Ambient Shader Canvas */}
      {!isComic && <FissureShaderCanvas />}

      {/* 2. Unbroken Smoked Glass Obsidian Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
            isShattered ? 'opacity-30 scale-100' : 'opacity-15 scale-105 saturate-0'
          }`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=80')`
          }}
        />
        {/* Vignette Layer */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          isComic
            ? 'bg-radial from-transparent via-amber-200/20 to-amber-900/40 opacity-70'
            : portalTheme === 'lustrzany'
            ? 'bg-radial from-transparent via-slate-200/40 to-slate-400/60 opacity-80'
            : 'bg-radial from-transparent via-black/80 to-black opacity-95'
        }`} />
      </div>

      {/* Comic Header Banner when in Comic Theme */}
      {isComic && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-3">
          <div className="bg-amber-400 border-3 border-slate-950 px-4 py-1 rounded-md shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transform -rotate-1 font-black text-xs uppercase tracking-widest text-slate-950">
            ISSUE #1: FRACTURED PORTAL
          </div>
          <div className="bg-rose-600 border-3 border-slate-950 px-3 py-1 rounded-md shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transform rotate-2 font-black text-xs uppercase tracking-widest text-white animate-pulse">
            SUPERHERO EDITION!
          </div>
        </div>
      )}

      {/* 3. Centered Monumental Carved "MaG" Logo Relief (Remains visible under glass before, during, and after login) */}
      <CarvedMaGLogo isShattered={isShattered} isShattering={isShattering} lightSweep={isShattering} />

      {/* 4. UNIFIED FRACTURED PORTAL SHARDS SURFACE (STABLE ABSOLUTE INSET-0 STAGE) */}
      <div
        className={`absolute inset-0 z-20 pt-14 pb-2 px-2 sm:px-4 lg:px-6 max-w-[1920px] mx-auto overflow-hidden transition-all duration-300 ${
          !isShattered && !isShattering ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        {/* DESKTOP VIEWPORT LAYOUT (>= md breakpoint) */}
        <div className="hidden md:block relative w-full h-full overflow-hidden">
          {DESKTOP_SHARDS.map((shard) => (
            <div key={shard.id} className="absolute inset-0 w-full h-full pointer-events-none">
              <div className="relative w-full h-full pointer-events-auto">
                {/* Smoked Mirror Glass Layer: Smooth Specular Reflections & Crisp Backlight */}
                <div
                  className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
                  style={{
                    clipPath: shard.clipPath,
                    backdropFilter: 'blur(2.5px) brightness(110%) contrast(120%)',
                    WebkitBackdropFilter: 'blur(2.5px) brightness(110%) contrast(120%)',
                    backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 18%, rgba(15, 23, 42, 0.08) 50%, rgba(255, 255, 255, 0.09) 82%, rgba(2, 6, 18, 0.25) 100%)`,
                    opacity: isShattered || isShattering ? 1 : 0
                  }}
                />
                {renderShardComponent(shard.id, shard.clipPath, shard.contentStyle)}
              </div>
            </div>
          ))}

          {/* MASTER GEOMETRY CRACK OVERLAY FOR DESKTOP (ALIGNED 1:1 WITH DESKTOP STAGE) */}
          {(isShattering || isShattered) && (
            <ShatterAnimationOverlay
              isShattered={isShattered}
              isShattering={isShattering}
              hoveredShard={hoveredShard}
            />
          )}

          {/* CONTINUOUS UNIFIED DIAGONAL LIGHT SWEEP PASS ACROSS ENTIRE GLASS SHEET */}
          <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden mix-blend-screen opacity-50">
            <div
              className="absolute -inset-[120%] bg-gradient-to-r from-transparent via-white/25 via-sky-100/35 via-white/20 to-transparent blur-sm transform -skew-x-30"
              style={{
                animation: 'unifiedPortalLightPass 11s ease-in-out infinite'
              }}
            />
          </div>
        </div>

        {/* MOBILE VIEWPORT LAYOUT (< md breakpoint) */}
        <div className="md:hidden relative w-full h-full overflow-hidden">
          {MOBILE_SHARDS.map((shard) => (
            <div key={`mob_${shard.id}`} className="absolute inset-0 w-full h-full pointer-events-none">
              <div className="relative w-full h-full pointer-events-auto">
                {/* Smoked Mirror Glass Layer: Smooth Specular Reflections & Crisp Backlight */}
                <div
                  className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
                  style={{
                    clipPath: shard.clipPath,
                    backdropFilter: 'blur(2.5px) brightness(110%) contrast(120%)',
                    WebkitBackdropFilter: 'blur(2.5px) brightness(110%) contrast(120%)',
                    backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 18%, rgba(15, 23, 42, 0.08) 50%, rgba(255, 255, 255, 0.09) 82%, rgba(2, 6, 18, 0.25) 100%)`,
                    opacity: isShattered || isShattering ? 1 : 0
                  }}
                />
                {renderShardComponent(shard.id, shard.clipPath, shard.contentStyle)}
              </div>
            </div>
          ))}

          {/* MASTER GEOMETRY CRACK OVERLAY FOR MOBILE (ALIGNED 1:1 WITH MOBILE STAGE) */}
          {(isShattering || isShattered) && (
            <ShatterAnimationOverlay
              isShattered={isShattered}
              isShattering={isShattering}
              hoveredShard={hoveredShard}
            />
          )}

          {/* CONTINUOUS UNIFIED DIAGONAL LIGHT SWEEP PASS ACROSS ENTIRE GLASS SHEET */}
          <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden mix-blend-screen opacity-50">
            <div
              className="absolute -inset-[120%] bg-gradient-to-r from-transparent via-white/25 via-sky-100/35 via-white/20 to-transparent blur-sm transform -skew-x-30"
              style={{
                animation: 'unifiedPortalLightPass 11s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>

      {/* 6. PRE-LOGIN MINIMALIST ETCHED FORM ON UNBROKEN GLASS PANE (ABSOLUTE OVERLAY, UNMOUNTS WHEN SHATTERED) */}
      {!isShattered && (
        <div
          className={`absolute inset-0 z-40 flex flex-col items-center justify-center p-6 transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isShattering ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'
          }`}
        >
          {/* Submerged Form Container */}
          <div className={`w-full max-w-xs pt-16 sm:pt-20 flex flex-col items-center z-20 ${
            isComic ? 'bg-amber-300 border-4 border-slate-950 p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transform -rotate-1' : ''
          }`}>
            {isComic && (
              <div className="w-full mb-4 px-3 py-1 bg-rose-600 text-white font-black text-center text-xs uppercase tracking-widest border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transform rotate-1">
                CLASSIFIED HERO ACCESS
              </div>
            )}
            <form onSubmit={handleLoginSubmit} className="w-full space-y-5">
              {/* LOGIN Field */}
              <div className={`relative border-b transition-colors py-1 ${
                isComic
                  ? 'border-b-3 border-slate-950'
                  : portalTheme === 'lustrzany'
                  ? 'border-slate-400 focus-within:border-slate-950'
                  : 'border-slate-700/60 focus-within:border-slate-300'
              }`}>
                <label className={`block text-[10px] font-bold uppercase tracking-[0.25em] mb-1 ${
                  isComic ? 'text-slate-950 font-black' : portalTheme === 'lustrzany' ? 'text-slate-800 font-extrabold' : 'text-slate-400/90'
                }`}>
                  LOGIN
                </label>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => {
                    setLoginInput(e.target.value);
                    setErrorMsg('');
                  }}
                  autoComplete="username"
                  className={`w-full bg-transparent font-sans text-base focus:outline-none tracking-wider py-1 ${
                    isComic
                      ? 'text-slate-950 font-black placeholder-slate-700'
                      : portalTheme === 'lustrzany'
                      ? 'text-slate-950 font-bold placeholder-slate-500'
                      : 'text-slate-100 placeholder-slate-700'
                  }`}
                />
              </div>

              {/* PIN Field */}
              <div className={`relative border-b transition-colors py-1 ${
                isComic
                  ? 'border-b-3 border-slate-950'
                  : portalTheme === 'lustrzany'
                  ? 'border-slate-400 focus-within:border-slate-950'
                  : 'border-slate-700/60 focus-within:border-slate-300'
              }`}>
                <label className={`block text-[10px] font-bold uppercase tracking-[0.25em] mb-1 ${
                  isComic ? 'text-slate-950 font-black' : portalTheme === 'lustrzany' ? 'text-slate-800 font-extrabold' : 'text-slate-400/90'
                }`}>
                  PIN
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setErrorMsg('');
                  }}
                  maxLength={8}
                  autoComplete="current-password"
                  className={`w-full bg-transparent font-sans text-base focus:outline-none tracking-[0.4em] py-1 ${
                    isComic
                      ? 'text-slate-950 font-black placeholder-slate-700'
                      : portalTheme === 'lustrzany'
                      ? 'text-slate-950 font-bold placeholder-slate-500'
                      : 'text-slate-100 placeholder-slate-700'
                  }`}
                />
              </div>

              {/* Error State */}
              {errorMsg && (
                <div className="text-rose-600 font-black text-xs text-center font-sans animate-in fade-in duration-200 bg-white p-1 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {errorMsg}
                </div>
              )}

              {/* ZALOGUJ Button */}
              <button
                type="submit"
                disabled={isSubmitting || isShattering}
                className={`w-full mt-4 py-3 active:scale-[0.98] transition-all text-xs font-black uppercase tracking-[0.3em] cursor-pointer shadow-lg ${
                  isComic
                    ? 'bg-sky-400 text-slate-950 border-3 border-slate-950 hover:bg-sky-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-xl transform rotate-1'
                    : portalTheme === 'lustrzany'
                    ? 'bg-slate-950 text-white hover:bg-slate-800 border border-slate-950 shadow-slate-900/20 rounded-lg'
                    : 'bg-slate-900/60 border border-slate-700/80 hover:border-slate-400 text-slate-200 hover:text-white hover:bg-slate-800/70 rounded-lg'
                } ${isShattering ? 'opacity-80 scale-[0.98]' : ''}`}
              >
                {isSubmitting ? '...' : 'ZALOGUJ!'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes unifiedPortalLightPass {
          0% {
            transform: translateX(-180%) skewX(-30deg);
            opacity: 0;
          }
          15% {
            opacity: 0.35;
          }
          35% {
            transform: translateX(180%) skewX(-30deg);
            opacity: 0;
          }
          100% {
            transform: translateX(180%) skewX(-30deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
