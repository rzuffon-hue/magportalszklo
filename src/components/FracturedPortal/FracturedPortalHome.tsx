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
  const { animationState, login } = useApp();
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

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#030508] select-none text-slate-100">
      {/* 1. Dynamic Subtle Ambient Shader Canvas */}
      <FissureShaderCanvas />

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
        {/* Dark Smoked Obsidian Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/80 to-black opacity-95" />
      </div>

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

      {/* 5. MASTER GEOMETRY CRACK ANIMATION OVERLAY (ON LOGIN TRANSITION ONLY) */}
      {isShattering && <ShatterAnimationOverlay />}

      {/* 6. PRE-LOGIN MINIMALIST ETCHED FORM ON UNBROKEN GLASS PANE (ABSOLUTE OVERLAY, UNMOUNTS WHEN SHATTERED) */}
      {!isShattered && (
        <div
          className={`absolute inset-0 z-40 flex flex-col items-center justify-center p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isShattering ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'
          }`}
        >
          {/* Submerged Form Container - Directly etched into glass surface */}
          <div className="w-full max-w-xs pt-16 sm:pt-20 flex flex-col items-center z-20">
            <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
              {/* LOGIN Field */}
              <div className="relative border-b border-slate-700/60 focus-within:border-slate-300 transition-colors py-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400/90 mb-1">
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
                  className="w-full bg-transparent text-slate-100 font-sans text-base focus:outline-none placeholder-slate-700 tracking-wider py-1"
                />
              </div>

              {/* PIN Field */}
              <div className="relative border-b border-slate-700/60 focus-within:border-slate-300 transition-colors py-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400/90 mb-1">
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
                  className="w-full bg-transparent text-slate-100 font-sans text-base focus:outline-none placeholder-slate-700 tracking-[0.4em] py-1"
                />
              </div>

              {/* Error State */}
              {errorMsg && (
                <div className="text-rose-400/90 text-xs font-semibold text-center font-sans animate-in fade-in duration-200">
                  {errorMsg}
                </div>
              )}

              {/* ZALOGUJ Button */}
              <button
                type="submit"
                disabled={isSubmitting || isShattering}
                className={`w-full mt-4 py-3 rounded-lg bg-slate-900/60 border border-slate-700/80 hover:border-slate-400 text-slate-200 hover:text-white hover:bg-slate-800/70 active:scale-[0.98] transition-all font-serif text-xs font-bold uppercase tracking-[0.3em] cursor-pointer shadow-lg ${
                  isShattering ? 'opacity-80 scale-[0.98]' : ''
                }`}
              >
                {isSubmitting ? '...' : 'ZALOGUJ'}
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
