import React from 'react';
import { DESKTOP_FISSURE_PATHS, MOBILE_FISSURE_PATHS } from './portalGeometry';

export const ShatterAnimationOverlay: React.FC = () => {
  // Desktop Stagger delays (ms) for lines originating from central core (44 18)
  const desktopDelays = [450, 510, 570, 670, 730, 790, 850, 910, 970, 1040, 1110];
  const desktopDurations = [320, 320, 320, 300, 300, 300, 280, 280, 320, 320, 280];

  // Mobile Stagger delays (ms) for lines originating from central core (42 20)
  const mobileDelays = [450, 520, 600, 680, 780, 870, 960, 1060, 1150];
  const mobileDurations = [320, 320, 350, 350, 300, 350, 350, 320, 280];

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Central Fracture Spark (Phase 3: 450-700ms) */}
      <div
        className="hidden md:block absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-slate-100 shadow-[0_0_25px_rgba(255,255,255,1)]"
        style={{
          left: '44%',
          top: '18%',
          animation: 'centralSparkFlash 300ms cubic-bezier(0.22, 1, 0.36, 1) 450ms forwards',
          opacity: 0
        }}
      />
      <div
        className="md:hidden absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-slate-100 shadow-[0_0_25px_rgba(255,255,255,1)]"
        style={{
          left: '42%',
          top: '20%',
          animation: 'centralSparkFlash 300ms cubic-bezier(0.22, 1, 0.36, 1) 450ms forwards',
          opacity: 0
        }}
      />

      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="fissure-anim-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Desktop Fissures */}
        <g className="hidden md:block">
          {DESKTOP_FISSURE_PATHS.map((pathD, idx) => {
            const delay = desktopDelays[idx] || 500;
            const duration = desktopDurations[idx] || 300;

            return (
              <g key={`desk_${idx}`}>
                {/* 1. Deep Void Shadow Line (Phase 5: 1200ms+) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.95)"
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    animation: `fissureDeepen 400ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 300}ms forwards`,
                    opacity: 0
                  }}
                />

                {/* 2. Primary Cold Glass Spreading Crack Line (Phases 3 & 4: 450-1400ms) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(241, 245, 249, 0.95)"
                  strokeWidth="0.7"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#fissure-anim-glow)"
                  style={{
                    animation: `crackDraw ${duration}ms cubic-bezier(0.25, 0.8, 0.25, 1) ${delay}ms forwards`
                  }}
                />

                {/* 3. Specular Edge Catchlight (Phase 5: 1200ms+) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth="0.35"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    animation: `fissureCatchlight 400ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 350}ms forwards`,
                    opacity: 0
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* Mobile Fissures */}
        <g className="md:hidden">
          {MOBILE_FISSURE_PATHS.map((pathD, idx) => {
            const delay = mobileDelays[idx] || 500;
            const duration = mobileDurations[idx] || 300;

            return (
              <g key={`mob_${idx}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.95)"
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    animation: `fissureDeepen 400ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 300}ms forwards`,
                    opacity: 0
                  }}
                />

                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(241, 245, 249, 0.95)"
                  strokeWidth="0.7"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#fissure-anim-glow)"
                  style={{
                    animation: `crackDraw ${duration}ms cubic-bezier(0.25, 0.8, 0.25, 1) ${delay}ms forwards`
                  }}
                />

                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth="0.35"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    animation: `fissureCatchlight 400ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + 350}ms forwards`,
                    opacity: 0
                  }}
                />
              </g>
            );
          })}
        </g>
      </svg>

      <style>{`
        @keyframes crackDraw {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes centralSparkFlash {
          0% {
            opacity: 0;
            transform: scale(0.4);
          }
          40% {
            opacity: 1;
            transform: scale(1.8);
          }
          100% {
            opacity: 0;
            transform: scale(3);
          }
        }

        @keyframes fissureDeepen {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fissureCatchlight {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.85;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          path {
            animation-duration: 200ms !important;
            animation-delay: 100ms !important;
          }
        }
      `}</style>
    </div>
  );
};
