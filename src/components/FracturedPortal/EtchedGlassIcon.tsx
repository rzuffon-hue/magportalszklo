import React from 'react';
import { LucideIcon } from 'lucide-react';

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
  return (
    <div className="flex flex-col items-center justify-center my-auto w-full h-full p-2 select-none">
      <div className="relative flex items-center justify-center">
        {/* Engraved Glass Groove Frame */}
        <div className="relative flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-[1.03]">
          {/* Sunken Intaglio Shadow Spot in Subsurface Glass */}
          <div className="absolute w-12 h-12 rounded-full bg-black/40 blur-md pointer-events-none" />

          {/* Main Engraved Icon (Intaglio Groove Cut into Glass with Specular Rim Highlight) */}
          <Icon
            size={size}
            strokeWidth={1.3}
            className={`transition-all duration-200 ease-out ${
              isTouched
                ? 'text-white brightness-150 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] drop-shadow-[0_0_4px_rgba(255,255,255,1)]'
                : `${reflectionClass} opacity-75 group-hover:opacity-100 group-hover:brightness-110 drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] drop-shadow-[0_-0.75px_0.5px_rgba(255,255,255,0.35)]`
            }`}
          />
        </div>

        {/* Dynamic Badge if count > 0 */}
        {badge !== undefined && badge !== null && (
          <span className="absolute -top-1 -right-3 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-full bg-slate-950/90 text-slate-300 border border-slate-700/60 backdrop-blur-md shadow-md">
            {badge}
          </span>
        )}

        {/* Optional User Avatar for Profil Shard */}
        {userAvatar && (
          <div className="absolute -bottom-1 -right-2 w-4 h-4 rounded-full ring-1 ring-amber-400/60 overflow-hidden shadow-md">
            <img src={userAvatar} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Laser-Etched Typography Label (Engraved Inscription) */}
      <span
        className={`mt-1.5 text-[10px] sm:text-[11px] font-sans font-black tracking-[0.26em] uppercase transition-all duration-200 ${
          isTouched
            ? 'text-white brightness-150 tracking-[0.28em] drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]'
            : `${reflectionClass} opacity-70 group-hover:opacity-95 group-hover:tracking-[0.28em] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_-0.5px_0.5px_rgba(255,255,255,0.3)]`
        }`}
      >
        {label}
      </span>
    </div>
  );
};



