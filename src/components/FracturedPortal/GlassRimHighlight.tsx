import React from 'react';

interface GlassRimHighlightProps {
  clipPath?: string;
  themeColor?: string;
}

export const GlassRimHighlight: React.FC<GlassRimHighlightProps> = ({
  clipPath,
  themeColor = 'rgba(255, 255, 255, 0.35)'
}) => {
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
        {/* Soft edge blur filter */}
        <filter id="fissure-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Dark Micro-fissure Groove (Deep Dark Gap between Shattered Panes) */}
      <polygon
        points={points}
        fill="none"
        stroke="rgba(0, 0, 0, 0.98)"
        strokeWidth="3.2"
        vectorEffect="non-scaling-stroke"
      />

      {/* 2. Secondary Refractive Shadow Offset Line */}
      <polygon
        points={points}
        fill="none"
        stroke="rgba(2, 6, 18, 0.9)"
        strokeWidth="1.8"
        vectorEffect="non-scaling-stroke"
      />

      {/* 3. Section Color Subsurface Refraction along Fracture Line */}
      <polygon
        points={points}
        fill="none"
        stroke={themeColor}
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
        filter="url(#fissure-soft)"
        className="opacity-40 group-hover:opacity-80 transition-opacity duration-300"
      />

      {/* 4. Ultra-thin Specular Broken Glass Edge Catchlight */}
      <polygon
        points={points}
        fill="none"
        stroke="rgba(255, 255, 255, 0.75)"
        strokeWidth="0.8"
        strokeDasharray="18 10 28 14 10 6 36 20"
        vectorEffect="non-scaling-stroke"
        className="opacity-70 group-hover:stroke-white group-hover:opacity-100 transition-all duration-300"
      />

      {/* 5. Focal Point Glints on Cracked Rim Corner Intersections */}
      <polygon
        points={points}
        fill="none"
        stroke="rgba(255, 255, 255, 0.95)"
        strokeWidth="1.2"
        strokeDasharray="1.5 35 2.5 50 2 60"
        vectorEffect="non-scaling-stroke"
        className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
      />
    </svg>
  );
};



