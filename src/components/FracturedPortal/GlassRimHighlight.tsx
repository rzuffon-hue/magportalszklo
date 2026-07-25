import React from 'react';
import { useApp } from '../../context/AppContext';

interface GlassRimHighlightProps {
  clipPath?: string;
  themeColor?: string;
}

export const GlassRimHighlight: React.FC<GlassRimHighlightProps> = ({
  clipPath,
  themeColor = 'rgba(255, 255, 255, 0.25)'
}) => {
  const { portalTheme } = useApp();
  const isMirror = portalTheme === 'lustrzany';

  if (!clipPath) return null;

  // Convert "polygon(0% 0%, 100% 0%, ...)" into SVG points format "0 0, 100 0, ..."
  const points = clipPath
    .replace(/^polygon\(/i, '')
    .replace(/\)$/i, '')
    .replaceAll('%', '')
    .trim();

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-hidden"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Soft natural edge blur */}
        <filter id="fissure-soft-rim" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Layer 1: Dark Void Crack Line */}
      <polygon
        points={points}
        fill="none"
        stroke={isMirror ? 'rgba(0, 0, 0, 0.95)' : 'rgba(2, 6, 16, 0.95)'}
        strokeWidth={isMirror ? '2.8' : '2.2'}
        vectorEffect="non-scaling-stroke"
      />

      {/* Layer 2: Refraction Line */}
      <polygon
        points={points}
        fill="none"
        stroke={isMirror ? 'rgba(255, 255, 255, 0.9)' : 'rgba(186, 230, 253, 0.25)'}
        strokeWidth="1.0"
        vectorEffect="non-scaling-stroke"
        filter={isMirror ? undefined : 'url(#fissure-soft-rim)'}
        className={isMirror ? 'opacity-90' : 'opacity-40 group-hover:opacity-70 transition-opacity duration-300'}
      />

      {/* Layer 3: Edge Color / Dark Line in Mirror */}
      {!isMirror && (
        <polygon
          points={points}
          fill="none"
          stroke={themeColor}
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
          className="opacity-30 group-hover:opacity-60 transition-opacity duration-300"
        />
      )}

      {/* Layer 4: Catchlight */}
      <polygon
        points={points}
        fill="none"
        stroke={isMirror ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.75)'}
        strokeWidth={isMirror ? '0.6' : '0.4'}
        strokeDasharray="12 6 22 14 6 3 30 18"
        vectorEffect="non-scaling-stroke"
        className="opacity-80 group-hover:stroke-white transition-all duration-300"
      />
    </svg>
  );
};



