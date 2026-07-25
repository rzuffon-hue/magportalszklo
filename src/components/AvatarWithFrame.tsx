import React from 'react';
import { AvatarFrameStyle } from '../types';

interface AvatarWithFrameProps {
  src: string;
  alt?: string;
  frame?: AvatarFrameStyle;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const AvatarWithFrame: React.FC<AvatarWithFrameProps> = ({
  src,
  alt = 'Avatar',
  frame = 'standard',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28'
  }[size];

  const paddingClasses = {
    xs: 'p-0.5',
    sm: 'p-0.5',
    md: 'p-1',
    lg: 'p-1.5',
    xl: 'p-2',
    '2xl': 'p-2.5'
  }[size];

  const isMini = size === 'xs' || size === 'sm' || size === 'md';

  // Standard Cosmetic Frames
  if (
    frame === 'standard' ||
    frame === 'ice' ||
    frame === 'gold' ||
    frame === 'emerald' ||
    frame === 'crimson' ||
    frame === 'mag'
  ) {
    const getFrameStyles = () => {
      switch (frame) {
        case 'ice':
          return {
            container: 'ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] bg-cyan-950/60',
            image: 'ring-1 ring-cyan-200/50'
          };
        case 'gold':
          return {
            container: 'ring-2 ring-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.6)] bg-gradient-to-tr from-amber-800/80 via-yellow-600/40 to-amber-300/80',
            image: 'ring-1 ring-amber-100/60'
          };
        case 'emerald':
          return {
            container: 'ring-2 ring-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)] bg-emerald-950/60',
            image: 'ring-1 ring-emerald-200/50'
          };
        case 'crimson':
          return {
            container: 'ring-2 ring-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)] bg-rose-950/60',
            image: 'ring-1 ring-rose-200/50'
          };
        case 'mag':
          return {
            container: 'ring-2 ring-purple-500 border border-amber-400/90 shadow-[0_0_16px_rgba(168,85,247,0.7)] bg-slate-950',
            image: 'ring-1 ring-purple-300/60'
          };
        case 'standard':
        default:
          return {
            container: 'ring-1 ring-slate-700/80 bg-slate-900/60 shadow-md',
            image: 'ring-1 ring-slate-800'
          };
      }
    };

    const frameStyle = getFrameStyles();

    return (
      <div className={`relative rounded-full shrink-0 flex items-center justify-center transition-all ${sizeClasses} ${paddingClasses} ${frameStyle.container} ${className}`}>
        <img
          src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
          alt={alt}
          referrerPolicy="no-referrer"
          className={`w-full h-full rounded-full object-cover ${frameStyle.image}`}
        />
      </div>
    );
  }

  // ================= EXCLUSIVE ROLE FRAMES (NON-CIRCULAR & GEOMETRIC) =================

  // 1. ADMIN FRAME (Gold + Ice Square/Shield Heraldic Geometry)
  if (frame === 'admin_frame') {
    if (isMini) {
      return (
        <div className={`relative shrink-0 flex items-center justify-center ${sizeClasses} ${className}`}>
          {/* Mini Gold-Ice Square-Rounded Frame */}
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-tr from-amber-500 via-yellow-300 to-cyan-400 p-[1.5px] shadow-[0_0_8px_rgba(245,158,11,0.6)]">
            <div className="w-full h-full rounded-md bg-slate-950 p-[1px]">
              <img
                src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={alt}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-md object-cover ring-1 ring-amber-400/80"
              />
            </div>
          </div>
          {/* Tiny Crown Top Accent */}
          <div className="absolute -top-1.5 font-mono text-[9px] text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.9)] z-10">
            👑
          </div>
        </div>
      );
    }

    // Full Admin Non-Circular Square/Shield Frame
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${sizeClasses} ${className}`}>
        {/* Animated Background Pulse Glow */}
        <div className="absolute -inset-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/30 via-rose-500/20 to-cyan-400/30 blur-md animate-pulse" />

        {/* Irregular SVG Metallic Gold & Ice Crystal Crest Surround */}
        <svg
          viewBox="0 0 100 100"
          className="absolute -inset-3.5 w-[calc(100%+1.75rem)] h-[calc(100%+1.75rem)] pointer-events-none drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] z-10"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="35%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          {/* Square Outer Heraldic Crest Frame */}
          <rect x="10" y="10" width="80" height="80" rx="16" fill="none" stroke="url(#goldGrad)" strokeWidth="4" />

          {/* Top Crown Peak */}
          <path d="M50 0 L58 10 L68 4 L62 16 L50 12 L38 16 L32 4 L42 10 Z" fill="url(#goldGrad)" stroke="#FEF08A" strokeWidth="0.8" />
          <circle cx="50" cy="3" r="2" fill="#38BDF8" />

          {/* Corner Ice Jewels */}
          <polygon points="10,10 18,10 10,18" fill="url(#iceGrad)" />
          <polygon points="90,10 82,10 90,18" fill="url(#iceGrad)" />
          <polygon points="10,90 18,90 10,82" fill="url(#iceGrad)" />
          <polygon points="90,90 82,90 90,82" fill="url(#iceGrad)" />
        </svg>

        {/* Inner Gold-Ice Square/Rounded Container */}
        <div className="relative w-full h-full rounded-2xl p-1 bg-gradient-to-tr from-amber-600 via-yellow-300 to-cyan-400 shadow-[0_0_20px_rgba(245,158,11,0.8)]">
          <div className="w-full h-full rounded-xl bg-slate-950 p-0.5 overflow-hidden">
            <img
              src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={alt}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-lg object-cover ring-2 ring-amber-300"
            />
          </div>
        </div>

        {/* Admin Crown Tag */}
        <div className="absolute -bottom-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border border-amber-200 px-2 py-0.5 rounded-md text-[9px] font-black text-black shadow-lg uppercase tracking-wider z-20 whitespace-nowrap">
          👑 ADMIN
        </div>
      </div>
    );
  }

  // 2. R4 MaG FRAME (Dark Gold + Blue Ice Military Shield Frame)
  if (frame === 'r4_frame') {
    if (isMini) {
      return (
        <div className={`relative shrink-0 flex items-center justify-center ${sizeClasses} ${className}`}>
          {/* Mini Shield Geometry Frame */}
          <div className="absolute -inset-0.5 rounded-md bg-gradient-to-br from-cyan-300 via-slate-300 to-indigo-600 p-[1.5px] shadow-[0_0_8px_rgba(56,189,248,0.6)]">
            <div className="w-full h-full rounded bg-slate-950 p-[1px]">
              <img
                src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={alt}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded object-cover ring-1 ring-cyan-300"
              />
            </div>
          </div>
        </div>
      );
    }

    // Full R4 MaG Shield & Polygon Frame
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${sizeClasses} ${className}`}>
        {/* Glow behind frame */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-indigo-600/30 to-slate-900/60 blur-md" />

        {/* Angular Military Shield Surround */}
        <svg
          viewBox="0 0 100 100"
          className="absolute -inset-3.5 w-[calc(100%+1.75rem)] h-[calc(100%+1.75rem)] pointer-events-none drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] z-10"
        >
          <defs>
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="r4IceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
          </defs>

          {/* Polygon Shield Border */}
          <polygon points="50,2 95,20 95,70 50,98 5,70 5,20" fill="none" stroke="url(#silverGrad)" strokeWidth="3.5" />
          <path d="M50 2 L58 12 L68 8 L62 18 L38 18 L32 8 L42 12 Z" fill="url(#silverGrad)" />
        </svg>

        {/* Inner Octagonal Container */}
        <div className="relative w-full h-full rounded-xl p-1 bg-gradient-to-br from-amber-400 via-cyan-300 to-indigo-800 shadow-[0_0_18px_rgba(14,165,233,0.7)]">
          <div className="w-full h-full rounded-lg bg-slate-950 p-0.5 overflow-hidden">
            <img
              src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={alt}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-md object-cover ring-1 ring-cyan-200"
            />
          </div>
        </div>

        {/* Alliance MaG Badge Tag at Bottom */}
        <div className="absolute -bottom-2.5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border border-cyan-400/80 px-2 py-0.5 rounded text-[9px] font-black text-cyan-200 shadow-md uppercase tracking-wider z-20 whitespace-nowrap">
          🛡️ R4 MaG
        </div>
      </div>
    );
  }

  // 3. MODERATOR FRAME (Silver + Ice Blue Polygonal Hexagon Frame)
  if (frame === 'moderator_frame') {
    if (isMini) {
      return (
        <div className={`relative shrink-0 flex items-center justify-center ${sizeClasses} ${className}`}>
          {/* Mini Hexagon Frame */}
          <div className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-purple-500 via-slate-300 to-cyan-400 p-[1.5px] shadow-[0_0_8px_rgba(168,85,247,0.6)]">
            <div className="w-full h-full rounded bg-slate-950 p-[1px]">
              <img
                src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={alt}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded object-cover ring-1 ring-purple-300"
              />
            </div>
          </div>
        </div>
      );
    }

    // Full Moderator Hexagonal / Diamond Frame
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${sizeClasses} ${className}`}>
        {/* Glow */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-purple-600/30 via-cyan-500/20 to-slate-900/60 blur-md" />

        {/* Angular Diamond/Hexagon Surround */}
        <svg
          viewBox="0 0 100 100"
          className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] z-10"
        >
          <defs>
            <linearGradient id="modGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#3B0764" />
            </linearGradient>
          </defs>

          {/* Polygon Hexagon Outer Line */}
          <polygon points="50,2 95,25 95,75 50,98 5,75 5,25" fill="none" stroke="url(#modGrad)" strokeWidth="3" />
          <polygon points="50,2 58,10 50,14 42,10" fill="url(#modGrad)" stroke="#E2E8F0" strokeWidth="0.8" />
        </svg>

        {/* Inner Container */}
        <div className="relative w-full h-full rounded-xl p-1 bg-gradient-to-tr from-purple-600 via-cyan-300 to-indigo-900 shadow-[0_0_16px_rgba(168,85,247,0.7)]">
          <div className="w-full h-full rounded-lg bg-slate-950 p-0.5 overflow-hidden">
            <img
              src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={alt}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-md object-cover ring-1 ring-purple-300"
            />
          </div>
        </div>

        {/* Moderator Badge Tag */}
        <div className="absolute -bottom-2 bg-slate-950 border border-purple-400 px-2 py-0.5 rounded text-[9px] font-extrabold text-purple-200 shadow-md uppercase tracking-wider z-20 whitespace-nowrap">
          ⚖️ MODERATOR
        </div>
      </div>
    );
  }

  // Fallback Standard
  return (
    <div className={`relative rounded-full shrink-0 flex items-center justify-center ${sizeClasses} ${paddingClasses} ring-1 ring-slate-700/80 bg-slate-900/60 shadow-md ${className}`}>
      <img
        src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
        alt={alt}
        referrerPolicy="no-referrer"
        className="w-full h-full rounded-full object-cover ring-1 ring-slate-800"
      />
    </div>
  );
};
