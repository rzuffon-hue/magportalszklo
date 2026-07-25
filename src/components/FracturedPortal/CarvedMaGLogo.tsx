import React from 'react';

interface CarvedMaGLogoProps {
  isShattered?: boolean;
  isShattering?: boolean;
  lightSweep?: boolean;
}

export const CarvedMaGLogo: React.FC<CarvedMaGLogoProps> = ({ isShattered = false, isShattering = false }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 overflow-hidden select-none">
      <div
        className={`relative flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isShattered || isShattering ? 'opacity-[0.15] scale-100' : 'opacity-[0.13] scale-100'
        }`}
        style={{
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 70%, rgba(0,0,0,0.5) 92%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 70%, rgba(0,0,0,0.5) 92%, transparent 100%)'
        }}
      >
        {/* Giant Monolithic Carved Text Relief Submerged Deep Beneath Glass Sheet */}
        <div className="relative font-black tracking-tighter text-center flex items-center justify-center text-[130px] sm:text-[220px] md:text-[320px] lg:text-[440px] xl:text-[520px]">
          
          {/* Deep Chiseled Base Groove in Subsurface Obsidian */}
          <span
            className="bg-clip-text text-transparent bg-gradient-to-b from-slate-100 via-slate-300 to-slate-600 drop-shadow-[0_10px_35px_rgba(255,255,255,0.2)]"
            style={{
              fontFamily: "'Cinzel Decorative', 'Trajan Pro', 'Cinzel', 'Playfair Display', serif",
              letterSpacing: '-0.06em',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.25)'
            }}
          >
            MaG
          </span>

          {/* Subdued Specular Chisel Edge Highlight */}
          <span
            className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"
            style={{
              fontFamily: "'Cinzel Decorative', 'Trajan Pro', 'Cinzel', 'Playfair Display', serif",
              letterSpacing: '-0.06em',
              transform: 'translate(-1px, -1px)'
            }}
          >
            MaG
          </span>

          {/* Subsurface Silver-Ice Sheen Pass */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
            <div
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md transform -skew-x-25"
              style={{
                animation: 'magSubsurfaceSheen 12s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes magSubsurfaceSheen {
          0% {
            transform: translateX(-220%) skewX(-25deg);
            opacity: 0;
          }
          15% {
            opacity: 0.5;
          }
          35% {
            transform: translateX(220%) skewX(-25deg);
            opacity: 0;
          }
          100% {
            transform: translateX(220%) skewX(-25deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};


