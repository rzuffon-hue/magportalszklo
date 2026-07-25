import React from 'react';
import { Sparkles, MessageSquare, Video, Shield, Users, Gamepad2, Calendar, User, Zap } from 'lucide-react';

export interface ComicPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'yellow' | 'blue' | 'purple' | 'emerald' | 'crimson' | 'amber' | 'cyan' | 'paper';
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const ComicPanel: React.FC<ComicPanelProps> = ({
  children,
  className = '',
  variant = 'paper',
  onClick,
  hoverEffect = true
}) => {
  const variantBg = {
    paper: 'bg-[#fffdfa] border-slate-950 text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]',
    yellow: 'bg-[#fef9c3] border-slate-950 text-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]',
    blue: 'bg-[#e0f2fe] border-slate-950 text-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]',
    purple: 'bg-[#f3e8ff] border-slate-950 text-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]',
    emerald: 'bg-[#dcfce7] border-slate-950 text-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]',
    crimson: 'bg-[#ffe4e6] border-slate-950 text-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]',
    amber: 'bg-[#fef3c7] border-slate-950 text-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]',
    cyan: 'bg-[#cffafe] border-slate-950 text-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`border-3 rounded-2xl p-4 transition-all duration-200 relative overflow-hidden ${variantBg} ${
        hoverEffect ? 'hover:-translate-y-1 hover:translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const ComicCaption: React.FC<{
  text: string;
  color?: 'yellow' | 'cyan' | 'rose' | 'amber' | 'emerald' | 'purple' | 'black';
  className?: string;
}> = ({ text, color = 'yellow', className = '' }) => {
  const bgStyles = {
    yellow: 'bg-amber-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    cyan: 'bg-cyan-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    rose: 'bg-rose-500 text-white border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    amber: 'bg-amber-500 text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    emerald: 'bg-emerald-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    purple: 'bg-purple-500 text-white border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    black: 'bg-slate-950 text-amber-300 border-slate-950 shadow-[2px_2px_0px_0px_rgba(251,191,36,1)]'
  }[color];

  return (
    <div className={`inline-block px-3 py-1 font-black text-xs uppercase tracking-wider border-2 transform -rotate-1 rounded-sm ${bgStyles} ${className}`}>
      {text}
    </div>
  );
};

export const ComicBubble: React.FC<{
  children: React.ReactNode;
  tailDirection?: 'left' | 'right' | 'bottom';
  variant?: 'white' | 'yellow' | 'purple';
  className?: string;
}> = ({ children, tailDirection = 'left', variant = 'white', className = '' }) => {
  const bg = {
    white: 'bg-white text-slate-950 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]',
    yellow: 'bg-amber-300 text-slate-950 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]',
    purple: 'bg-purple-600 text-white border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
  }[variant];

  return (
    <div className={`relative border-2 rounded-2xl p-3 text-xs font-bold leading-snug ${bg} ${className}`}>
      {children}
      {tailDirection === 'left' && (
        <span className="absolute -left-2.5 top-3 w-0 h-0 border-y-[6px] border-y-transparent border-r-[10px] border-r-slate-950 drop-shadow-[1px_0_0_rgba(255,255,255,1)]" />
      )}
      {tailDirection === 'right' && (
        <span className="absolute -right-2.5 top-3 w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-slate-950" />
      )}
    </div>
  );
};

export const ComicBadge: React.FC<{
  text: string | number;
  type?: 'burst' | 'pill';
  color?: 'red' | 'gold' | 'blue';
  className?: string;
}> = ({ text, type = 'burst', color = 'red', className = '' }) => {
  if (type === 'burst') {
    return (
      <div className={`relative inline-flex items-center justify-center font-black text-xs text-white transform rotate-6 z-10 ${className}`}>
        <div className={`px-2.5 py-1 ${color === 'red' ? 'bg-rose-600' : color === 'gold' ? 'bg-amber-500' : 'bg-sky-600'} text-white border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md font-mono font-black`}>
          {text}
        </div>
      </div>
    );
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full border-2 border-slate-950 font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
      color === 'red' ? 'bg-rose-500 text-white' : color === 'gold' ? 'bg-amber-400 text-slate-950' : 'bg-sky-400 text-slate-950'
    } ${className}`}>
      {text}
    </span>
  );
};

export const ComicIllustration: React.FC<{
  type: 'czaty' | 'reels' | 'sciana' | 'grupy' | 'gry' | 'wydarzenia' | 'profil';
  className?: string;
}> = ({ type, className = '' }) => {
  switch (type) {
    case 'czaty':
      return (
        <svg viewBox="0 0 400 240" className={`w-full h-full object-cover ${className}`}>
          <defs>
            <linearGradient id="czatyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#6d28d9" />
              <stop offset="100%" stopColor="#4c1d95" />
            </linearGradient>
            <pattern id="dotPattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#ffffff" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="400" height="240" fill="url(#czatyGrad)" />
          <rect width="400" height="240" fill="url(#dotPattern)" />
          {/* Speedburst lines */}
          <g stroke="#ffffff" strokeWidth="1.5" opacity="0.2">
            <line x1="200" y1="120" x2="0" y2="0" />
            <line x1="200" y1="120" x2="400" y2="0" />
            <line x1="200" y1="120" x2="0" y2="240" />
            <line x1="200" y1="120" x2="400" y2="240" />
            <line x1="200" y1="120" x2="200" y2="0" />
            <line x1="200" y1="120" x2="0" y2="120" />
          </g>
          {/* Speech Bubble 1 */}
          <g transform="translate(40, 30)">
            <path d="M 0 10 Q 0 0 10 0 L 130 0 Q 140 0 140 10 L 140 50 Q 140 60 130 60 L 40 60 L 20 80 L 25 60 L 10 60 Q 0 60 0 50 Z" fill="#ffffff" stroke="#090d16" strokeWidth="4" />
            <text x="20" y="35" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="16">SIEMA SOJUSZ! ⚡</text>
          </g>
          {/* Speech Bubble 2 */}
          <g transform="translate(200, 110)">
            <path d="M 0 10 Q 0 0 10 0 L 150 0 Q 160 0 160 10 L 160 55 Q 160 65 150 65 L 120 65 L 140 85 L 100 65 L 10 65 Q 0 65 0 55 Z" fill="#fef08a" stroke="#090d16" strokeWidth="4" />
            <text x="20" y="38" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="15">SVS BITWA DZISIAJ! 🔥</text>
          </g>
          {/* Silhouettes */}
          <path d="M 20 240 C 20 180, 50 160, 80 150 C 70 140, 65 120, 75 100 C 85 80, 110 80, 120 100 C 130 120, 125 140, 115 150 C 145 160, 175 180, 175 240 Z" fill="#090d16" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
          <path d="M 240 240 C 240 190, 270 170, 300 160 C 290 150, 285 130, 295 110 C 305 90, 330 90, 340 110 C 350 130, 345 150, 335 160 C 365 170, 395 190, 395 240 Z" fill="#090d16" stroke="#fef08a" strokeWidth="2" opacity="0.85" />
          {/* Comic action word */}
          <g transform="translate(140, 105) rotate(-8)">
            <rect x="-10" y="-15" width="85" height="34" fill="#f43f5e" stroke="#090d16" strokeWidth="3" rx="4" />
            <text x="0" y="8" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontSize="18" fontStyle="italic">CHAT!</text>
          </g>
        </svg>
      );

    case 'reels':
      return (
        <svg viewBox="0 0 400 240" className={`w-full h-full object-cover ${className}`}>
          <defs>
            <linearGradient id="reelsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="50%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="url(#reelsGrad)" />
          {/* Halftone / Lines */}
          <g stroke="#ffffff" strokeWidth="1" opacity="0.15">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={i} x1="0" y1={i * 12} x2="400" y2={i * 12 + 100} />
            ))}
          </g>
          {/* Camera lens & Video Beam */}
          <path d="M 80 180 L 320 60 L 320 180 Z" fill="#fef08a" opacity="0.2" />
          <g transform="translate(60, 80)">
            {/* Phone / Reel Frame */}
            <rect x="0" y="0" width="80" height="130" rx="12" fill="#090d16" stroke="#ffffff" strokeWidth="4" />
            <rect x="8" y="12" width="64" height="106" rx="6" fill="#fb7185" />
            <polygon points="32,50 52,65 32,80" fill="#ffffff" stroke="#090d16" strokeWidth="3" />
          </g>
          {/* Floating Action Elements */}
          <g transform="translate(180, 40) rotate(6)">
            <rect x="0" y="0" width="160" height="42" rx="8" fill="#facc15" stroke="#090d16" strokeWidth="4" />
            <text x="15" y="28" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="20">ACTION! 🎬</text>
          </g>
          <g transform="translate(240, 130) rotate(-4)">
            <circle cx="25" cy="25" r="25" fill="#ffffff" stroke="#090d16" strokeWidth="4" />
            <path d="M 25 15 C 20 10 12 15 15 23 C 18 30 25 35 25 35 C 25 35 32 30 35 23 C 38 15 30 10 25 15 Z" fill="#e11d48" stroke="#090d16" strokeWidth="2" />
            <rect x="60" y="8" width="80" height="32" rx="6" fill="#090d16" stroke="#ffffff" strokeWidth="2" />
            <text x="70" y="29" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontSize="14">12.8K ♥</text>
          </g>
        </svg>
      );

    case 'sciana':
      return (
        <svg viewBox="0 0 600 280" className={`w-full h-full object-cover ${className}`}>
          <defs>
            <linearGradient id="scianaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <rect width="600" height="280" fill="url(#scianaGrad)" />
          {/* Comic Grid Lines */}
          <line x1="0" y1="140" x2="600" y2="140" stroke="#facc15" strokeWidth="3" opacity="0.3" strokeDasharray="8 8" />
          {/* Main Community Wall Frame */}
          <g transform="translate(40, 30)">
            <rect x="0" y="0" width="320" height="200" rx="12" fill="#ffffff" stroke="#090d16" strokeWidth="5" />
            {/* Header banner inside frame */}
            <rect x="0" y="0" width="320" height="45" fill="#38bdf8" stroke="#090d16" strokeWidth="3" />
            <text x="20" y="30" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="18">TABLICA SOJUSZU MaG 🛡️</text>
            {/* Post preview lines */}
            <rect x="20" y="65" width="280" height="60" rx="6" fill="#f8fafc" stroke="#090d16" strokeWidth="2" />
            <text x="35" y="90" fill="#0f172a" fontFamily="sans-serif" fontWeight="800" fontSize="14">Witajcie Bohaterowie! Dzisiaj SVS!</text>
            <text x="35" y="110" fill="#64748b" fontFamily="sans-serif" fontWeight="700" fontSize="12">Opublikowane przez: RZABA (Lider)</text>
            <rect x="20" y="135" width="130" height="45" rx="6" fill="#fef08a" stroke="#090d16" strokeWidth="2" />
            <text x="35" y="162" fill="#0f172a" fontFamily="sans-serif" fontWeight="900" fontSize="13">184 LAJKÓW 👍</text>
            <rect x="160" y="135" width="140" height="45" rx="6" fill="#e2e8f0" stroke="#090d16" strokeWidth="2" />
            <text x="175" y="162" fill="#0f172a" fontFamily="sans-serif" fontWeight="900" fontSize="13">42 KOMENTARZE</text>
          </g>
          {/* Side Hero Graphic */}
          <g transform="translate(400, 20)">
            <polygon points="80,10 160,50 140,220 20,180" fill="#facc15" stroke="#090d16" strokeWidth="5" />
            <text x="45" y="110" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="28" transform="rotate(-10, 80, 110)">NEWS!</text>
            <circle cx="100" cy="150" r="30" fill="#ef4444" stroke="#090d16" strokeWidth="3" />
            <text x="88" y="158" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontSize="22">MaG</text>
          </g>
        </svg>
      );

    case 'grupy':
      return (
        <svg viewBox="0 0 400 240" className={`w-full h-full object-cover ${className}`}>
          <defs>
            <linearGradient id="grupyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="url(#grupyGrad)" />
          {/* Squad Shield */}
          <g transform="translate(140, 25)">
            <path d="M 60 0 L 120 30 L 120 110 C 120 160 60 190 60 190 C 60 190 0 160 0 110 L 0 30 Z" fill="#facc15" stroke="#090d16" strokeWidth="5" />
            <path d="M 60 15 L 105 38 L 105 105 C 105 145 60 170 60 170 C 60 170 15 145 15 105 L 15 38 Z" fill="#10b981" stroke="#090d16" strokeWidth="3" />
            <text x="32" y="105" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontSize="32">SQUAD</text>
          </g>
          {/* Team Icons */}
          <circle cx="60" cy="120" r="35" fill="#ffffff" stroke="#090d16" strokeWidth="4" />
          <text x="43" y="130" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="28">👥</text>
          <circle cx="340" cy="120" r="35" fill="#ffffff" stroke="#090d16" strokeWidth="4" />
          <text x="323" y="130" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="28">⚔️</text>
        </svg>
      );

    case 'gry':
      return (
        <svg viewBox="0 0 400 240" className={`w-full h-full object-cover ${className}`}>
          <defs>
            <linearGradient id="gryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="url(#gryGrad)" />
          {/* Speedburst rays */}
          <polygon points="200,120 0,0 100,0" fill="#38bdf8" opacity="0.3" />
          <polygon points="200,120 300,0 400,0" fill="#38bdf8" opacity="0.3" />
          <polygon points="200,120 400,100 400,200" fill="#38bdf8" opacity="0.3" />
          {/* 3D Dice */}
          <g transform="translate(60, 50) rotate(-12)">
            <rect x="0" y="0" width="70" height="70" rx="10" fill="#ffffff" stroke="#090d16" strokeWidth="4" />
            <circle cx="20" cy="20" r="6" fill="#ef4444" />
            <circle cx="50" cy="20" r="6" fill="#090d16" />
            <circle cx="35" cy="35" r="6" fill="#090d16" />
            <circle cx="20" cy="50" r="6" fill="#090d16" />
            <circle cx="50" cy="50" r="6" fill="#ef4444" />
          </g>
          {/* Tower Defense / Controller */}
          <g transform="translate(230, 80) rotate(10)">
            <rect x="0" y="0" width="120" height="80" rx="20" fill="#090d16" stroke="#facc15" strokeWidth="4" />
            <circle cx="35" cy="40" r="14" fill="#38bdf8" />
            <circle cx="85" cy="30" r="6" fill="#ef4444" />
            <circle cx="98" cy="42" r="6" fill="#10b981" />
            <circle cx="72" cy="42" r="6" fill="#facc15" />
            <circle cx="85" cy="54" r="6" fill="#a855f7" />
          </g>
          {/* GAME ON Badge */}
          <g transform="translate(120, 150) rotate(-4)">
            <rect x="0" y="0" width="160" height="46" rx="8" fill="#facc15" stroke="#090d16" strokeWidth="4" />
            <text x="15" y="32" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="22">GAME ON! 🕹️</text>
          </g>
        </svg>
      );

    case 'wydarzenia':
      return (
        <svg viewBox="0 0 400 240" className={`w-full h-full object-cover ${className}`}>
          <defs>
            <linearGradient id="wydarzeniaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="url(#wydarzeniaGrad)" />
          {/* Calendar comic sheet */}
          <g transform="translate(60, 30)">
            <rect x="0" y="0" width="150" height="170" rx="12" fill="#ffffff" stroke="#090d16" strokeWidth="5" />
            <rect x="0" y="0" width="150" height="45" rx="8" fill="#ef4444" stroke="#090d16" strokeWidth="3" />
            <text x="35" y="30" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontSize="18">LIPIEC</text>
            <text x="30" y="120" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="64">25</text>
          </g>
          {/* Event Callout */}
          <g transform="translate(200, 70) rotate(5)">
            <path d="M 0 0 L 160 0 L 160 100 L 0 100 Z" fill="#fef08a" stroke="#090d16" strokeWidth="4" />
            <text x="15" y="35" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="18">BITWA SVS ⚔️</text>
            <text x="15" y="65" fill="#dc2626" fontFamily="sans-serif" fontWeight="900" fontSize="15">START: 20:00</text>
            <text x="15" y="85" fill="#059669" fontFamily="sans-serif" fontWeight="800" fontSize="12">ZAPISANYCH: 48</text>
          </g>
        </svg>
      );

    case 'profil':
      return (
        <svg viewBox="0 0 400 240" className={`w-full h-full object-cover ${className}`}>
          <defs>
            <linearGradient id="profilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="url(#profilGrad)" />
          {/* Starburst rays */}
          <g stroke="#ffffff" strokeWidth="2" opacity="0.3">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={i} x1="200" y1="120" x2={200 + Math.cos(i * 0.4) * 250} y2={120 + Math.sin(i * 0.4) * 250} />
            ))}
          </g>
          {/* Hero Portrait Circle Frame */}
          <g transform="translate(130, 20)">
            <circle cx="70" cy="70" r="60" fill="#ffffff" stroke="#090d16" strokeWidth="6" />
            <circle cx="70" cy="70" r="52" fill="#38bdf8" />
            <text x="38" y="85" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="50">👤</text>
            <rect x="15" y="120" width="110" height="36" rx="18" fill="#facc15" stroke="#090d16" strokeWidth="4" />
            <text x="28" y="144" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="16">HERO #1</text>
          </g>
        </svg>
      );

    default:
      return null;
  }
};
