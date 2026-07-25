import React from 'react';

interface GlassRimHighlightProps {
  clipPath?: string;
  themeColor?: string;
}

export const GlassRimHighlight: React.FC<GlassRimHighlightProps> = ({
  clipPath,
  themeColor = 'rgba(255, 255, 255, 0.25)'
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
        {/* Soft natural edge blur - reduced glow */}
        <filter id="fissure-soft-rim" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Layer 1: Dark Void Shadow Gap (Ciemna szczelina między taflami) */}
      <polygon
        points={points}
        fill="none"
        stroke="rgba(2, 6, 16, 0.95)"
        strokeWidth="2.2"
        vectorEffect="non-scaling-stroke"
      />

      {/* Layer 2: Subtle Subsurface Cold Refraction (Zmniejszony glow o ~60-70%) */}
      <polygon
        points={points}
        fill="none"
        stroke="rgba(186, 230, 253, 0.25)"
        strokeWidth="1.0"
        vectorEffect="non-scaling-stroke"
        filter="url(#fissure-soft-rim)"
        className="opacity-40 group-hover:opacity-70 transition-opacity duration-300"
      />

      {/* Layer 3: Section Color Accent Edge */}
      <polygon
        points={points}
        fill="none"
        stroke={themeColor}
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        className="opacity-30 group-hover:opacity-60 transition-opacity duration-300"
      />

      {/* Layer 4: Organic Irregular Frost Coating (Biały szron i śnieżny pył wzdłuż krawędzi) */}
      <polygon
        points={points}
        fill="none"
        stroke="rgba(240, 249, 255, 0.65)"
        strokeWidth="1.1"
        strokeDasharray="1.5 0.8 6 1.8 0.6 0.4 9 2.2 0.8 1.2"
        vectorEffect="non-scaling-stroke"
        className="opacity-70 group-hover:opacity-95 transition-opacity duration-300"
      />

      {/* Layer 5: Fine Specular Catchlight (Refrakcja zimnego światła na szkle) */}
      <polygon
        points={points}
        fill="none"
        stroke="rgba(255, 255, 255, 0.75)"
        strokeWidth="0.4"
        strokeDasharray="12 6 22 14 6 3 30 18"
        vectorEffect="non-scaling-stroke"
        className="opacity-60 group-hover:stroke-white group-hover:opacity-90 transition-all duration-300"
      />
    </svg>
  );
};



