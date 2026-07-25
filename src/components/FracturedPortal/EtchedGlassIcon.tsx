import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EtchedGlassIconProps {
  icon: LucideIcon;
  size?: number;
  label: string;
  badge?: number | string;
  userAvatar?: string;
  reflectionClass?: string;
  isTouched?: boolean;
}

export const EtchedGlassIcon: React.FC<EtchedGlassIconProps> = ({
  icon: Icon,
  size = 52,
  label,
  badge,
  userAvatar,
  reflectionClass = 'text-slate-300/70 group-hover:text-slate-100',
  isTouched = false,
}) => {
  const { portalTheme } = useApp();
  const isMirror = portalTheme === 'lustrzany';
  const isComic = portalTheme === 'komiksowy';

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full h-full p-2 select-none">
      <div className="relative flex items-center justify-center">
        {/* Engraved Glass Groove Frame */}
        <div className={`relative flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-[1.05] ${
          isComic ? 'p-2 rounded-2xl bg-amber-300 border-3 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transform -rotate-1' : ''
        }`}>
          {/* Sunken Intaglio Shadow Spot in Subsurface Glass */}
          {!isMirror && !isComic && (
            <div className="absolute w-12 h-12 rounded-full bg-black/40 blur-md pointer-events-none" />
          )}

          {/* Main Icon */}
          <Icon
            size={isComic ? size * 0.8 : size}
            strokeWidth={isComic ? 2.8 : isMirror ? 2.2 : 1.3}
            className={`transition-all duration-200 ease-out ${
              isComic
                ? 'text-slate-950 drop-shadow-[1px_1px_0px_rgba(255,255,255,1)]'
                : isMirror
                ? 'text-black opacity-100 group-hover:text-slate-950 group-hover:scale-105 drop-shadow-[0_1px_0.5px_rgba(255,255,255,0.8)]'
                : isTouched
                ? 'text-white brightness-150 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] drop-shadow-[0_0_4px_rgba(255,255,255,1)]'
                : `${reflectionClass} opacity-75 group-hover:opacity-100 group-hover:brightness-110 drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] drop-shadow-[0_-0.75px_0.5px_rgba(255,255,255,0.35)]`
            }`}
          />
        </div>

        {/* Dynamic Badge */}
        {badge !== undefined && badge !== null && (
          <span className={`absolute -top-2 -right-3 px-2 py-0.5 text-[9px] font-black rounded-md border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            isComic
              ? 'bg-rose-600 text-white transform rotate-6 animate-pulse'
              : isMirror
              ? 'bg-black text-white border-black font-black'
              : 'bg-slate-950/90 text-slate-300 border-slate-700/60 backdrop-blur-md'
          }`}>
            {badge}{isComic ? '!' : ''}
          </span>
        )}

        {/* Optional User Avatar for Profil Shard */}
        {userAvatar && (
          <div className={`absolute -bottom-1 -right-2 w-6 h-6 rounded-full overflow-hidden shadow-md ${
            isComic ? 'border-2 border-slate-950 ring-2 ring-amber-400' : 'ring-2 ring-black'
          }`}>
            <img src={userAvatar} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Typography Label */}
      {isComic ? (
        <span className="mt-2.5 px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] rounded-sm transform -rotate-1 group-hover:scale-105 group-hover:bg-amber-300 transition-all">
          {label}
        </span>
      ) : (
        <span
          className={`mt-2 text-[11px] sm:text-[12px] font-sans font-black tracking-[0.26em] uppercase transition-all duration-200 ${
            isMirror
              ? 'text-black opacity-100 font-extrabold group-hover:tracking-[0.28em] drop-shadow-[0_1px_0px_rgba(255,255,255,0.9)]'
              : isTouched
              ? 'text-white brightness-150 tracking-[0.28em] drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]'
              : `${reflectionClass} opacity-70 group-hover:opacity-95 group-hover:tracking-[0.28em] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_-0.5px_0.5px_rgba(255,255,255,0.3)]`
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};



