import React from 'react';

interface ShatterAnimationOverlayProps {
  isShattered?: boolean;
  isShattering?: boolean;
  hoveredShard?: string | null;
}

interface OrganicFissureData {
  mainPath: string;
  branches: string[];
  pathShards: string[];
}

interface UniqueCornerFrost {
  id: string;
  x: number;
  y: number;
  // Specific unique shape/type per corner to ensure no repetitive stars or glowing dots
  type: 'dusting' | 'patch' | 'granules' | 'micro_rim' | 'branch_fracture' | 'icy_haze';
}

// Master organic Desktop fissures with subtle micro-jagged fracture lines and branching micro-cracks
const DESKTOP_ORGANIC_FISSURES: OrganicFissureData[] = [
  {
    // 0: Czaty <-> Reels (44,18 -> 44,0) - Tier 1
    mainPath: 'M 44,18 L 43.8,14.2 L 44.3,10.1 L 43.7,5.5 L 44,0',
    branches: [
      'M 43.8,14.2 L 42.1,13.2',
      'M 44.3,10.1 L 45.9,9.2'
    ],
    pathShards: ['czaty', 'reels']
  },
  {
    // 1: Czaty <-> Ściana (44,18 -> 28,38) - Tier 1
    mainPath: 'M 44,18 L 40.2,22.8 L 36.4,27.3 L 32.7,32.2 L 28,38',
    branches: [
      'M 40.2,22.8 L 39.1,24.6',
      'M 36.4,27.3 L 35.1,25.8',
      'M 32.7,32.2 L 34.0,33.5'
    ],
    pathShards: ['czaty', 'sciana']
  },
  {
    // 2: Reels <-> Ściana (44,18 -> 72,42) - Tier 1
    mainPath: 'M 44,18 L 50.8,23.8 L 57.7,29.6 L 64.9,35.7 L 72,42',
    branches: [
      'M 50.8,23.8 L 52.2,22.3',
      'M 57.7,29.6 L 56.4,31.2',
      'M 64.9,35.7 L 66.3,34.2'
    ],
    pathShards: ['reels', 'sciana']
  },
  {
    // 3: Czaty <-> Grupy (28,38 -> 0,48) - Tier 2
    mainPath: 'M 28,38 L 21.1,40.4 L 14.3,42.8 L 7.2,45.3 L 0,48',
    branches: [
      'M 21.1,40.4 L 20.2,38.8',
      'M 14.3,42.8 L 15.2,44.6'
    ],
    pathShards: ['czaty', 'grupy']
  },
  {
    // 4: Reels <-> Gry (72,42 -> 100,52) - Tier 2
    mainPath: 'M 72,42 L 79.1,44.5 L 86.2,47.0 L 93.1,49.5 L 100,52',
    branches: [
      'M 79.1,44.5 L 78.2,42.8',
      'M 86.2,47.0 L 87.3,48.7'
    ],
    pathShards: ['reels', 'gry']
  },
  {
    // 5: Ściana <-> Grupy (28,38 -> 36,65) - Tier 2
    mainPath: 'M 28,38 L 29.9,44.7 L 31.8,51.4 L 33.9,58.2 L 36,65',
    branches: [
      'M 29.9,44.7 L 28.1,46.0',
      'M 31.8,51.4 L 33.6,50.1',
      'M 33.9,58.2 L 32.1,59.5'
    ],
    pathShards: ['sciana', 'grupy']
  },
  {
    // 6: Ściana <-> Gry (72,42 -> 64,62) - Tier 2
    mainPath: 'M 72,42 L 70.0,46.9 L 68.0,51.9 L 66.1,56.9 L 64,62',
    branches: [
      'M 70.0,46.9 L 68.2,45.7',
      'M 68.0,51.9 L 69.8,53.0',
      'M 66.1,56.9 L 64.3,55.8'
    ],
    pathShards: ['sciana', 'gry']
  },
  {
    // 7: Ściana <-> Wydarzenia (36,65 -> 64,62) - Tier 3
    mainPath: 'M 36,65 L 43.0,64.2 L 50.1,63.5 L 57.0,62.7 L 64,62',
    branches: [
      'M 43.0,64.2 L 42.4,66.0',
      'M 50.1,63.5 L 50.6,61.6',
      'M 57.0,62.7 L 56.5,64.5'
    ],
    pathShards: ['sciana', 'wydarzenia']
  },
  {
    // 8: Grupy <-> Wydarzenia (36,65 -> 22,82 -> 0,78) - Tier 3
    mainPath: 'M 36,65 L 32.5,69.2 L 29.0,73.5 L 25.5,77.8 L 22,82 L 16.5,81.0 L 11.0,80.0 L 5.5,79.0 L 0,78',
    branches: [
      'M 32.5,69.2 L 33.8,70.6',
      'M 29.0,73.5 L 27.2,72.1',
      'M 16.5,81.0 L 17.2,82.8'
    ],
    pathShards: ['grupy', 'wydarzenia']
  },
  {
    // 9: Gry <-> Profil (64,62 -> 78,76 -> 100,84) - Tier 3
    mainPath: 'M 64,62 L 67.5,65.5 L 71.0,69.0 L 74.5,72.5 L 78,76 L 83.5,78.0 L 89.0,80.0 L 94.5,82.0 L 100,84',
    branches: [
      'M 67.5,65.5 L 66.1,66.9',
      'M 74.5,72.5 L 75.9,71.1',
      'M 89.0,80.0 L 88.2,81.8'
    ],
    pathShards: ['gry', 'profil']
  },
  {
    // 10: Wydarzenia <-> Profil (78,76 -> 60,100) - Tier 3
    mainPath: 'M 78,76 L 73.5,82.0 L 69.0,88.0 L 64.5,94.0 L 60,100',
    branches: [
      'M 73.5,82.0 L 75.1,83.2',
      'M 69.0,88.0 L 67.3,86.8',
      'M 64.5,94.0 L 66.1,95.2'
    ],
    pathShards: ['wydarzenia', 'profil']
  }
];

// Desktop Junction Corners - Każdy narożnik wygląda inaczej! Brak świecących gwiazdek/kropek.
const DESKTOP_CORNER_FROST: UniqueCornerFrost[] = [
  { id: 'core_44_18', x: 44, y: 18, type: 'dusting' },
  { id: 'mid_left_28_38', x: 28, y: 38, type: 'patch' },
  { id: 'mid_right_72_42', x: 72, y: 42, type: 'granules' },
  { id: 'lower_left_36_65', x: 36, y: 65, type: 'micro_rim' },
  { id: 'lower_right_64_62', x: 64, y: 62, type: 'branch_fracture' },
  { id: 'bot_left_22_82', x: 22, y: 82, type: 'icy_haze' },
  { id: 'bot_right_78_76', x: 78, y: 76, type: 'granules' }
];

// Master organic Mobile fissures
const MOBILE_ORGANIC_FISSURES: OrganicFissureData[] = [
  {
    // 0: czaty <-> reels (42,20 -> 52,0)
    mainPath: 'M 42,20 L 44.5,15.0 L 47.0,10.0 L 49.5,5.0 L 52,0',
    branches: ['M 44.5,15.0 L 42.8,14.2', 'M 47.0,10.0 L 48.7,9.2'],
    pathShards: ['czaty', 'reels']
  },
  {
    // 1: czaty <-> sciana (42,20 -> 0,28)
    mainPath: 'M 42,20 L 31.5,22.0 L 21.0,24.0 L 10.5,26.0 L 0,28',
    branches: ['M 31.5,22.0 L 30.8,20.2', 'M 21.0,24.0 L 21.7,25.8'],
    pathShards: ['czaty', 'sciana']
  },
  {
    // 2: reels <-> sciana (42,20 -> 62,34 -> 100,26)
    mainPath: 'M 42,20 L 52.0,27.0 L 62,34 L 81.0,30.0 L 100,26',
    branches: ['M 52.0,27.0 L 51.1,28.8', 'M 81.0,30.0 L 81.8,28.2'],
    pathShards: ['reels', 'sciana']
  },
  {
    // 3: sciana <-> grupy (0,28 -> 20,50 -> 48,58)
    mainPath: 'M 0,28 L 10.0,39.0 L 20,50 L 34.0,54.0 L 48,58',
    branches: ['M 10.0,39.0 L 11.5,37.8', 'M 34.0,54.0 L 33.0,55.8'],
    pathShards: ['sciana', 'grupy']
  },
  {
    // 4: sciana <-> gry (48,58 -> 88,52 -> 100,26)
    mainPath: 'M 48,58 L 68.0,55.0 L 88,52 L 94.0,39.0 L 100,26',
    branches: ['M 68.0,55.0 L 67.2,56.8', 'M 94.0,39.0 L 95.8,38.2'],
    pathShards: ['sciana', 'gry']
  },
  {
    // 5: grupy <-> gry (48,58 -> 32,74)
    mainPath: 'M 48,58 L 44.0,62.0 L 40.0,66.0 L 36.0,70.0 L 32,74',
    branches: ['M 44.0,62.0 L 42.5,60.8', 'M 36.0,70.0 L 37.5,71.2'],
    pathShards: ['grupy', 'gry']
  },
  {
    // 6: grupy <-> wydarzenia (0,68 -> 32,74)
    mainPath: 'M 0,68 L 8.0,69.5 L 16.0,71.0 L 24.0,72.5 L 32,74',
    branches: ['M 8.0,69.5 L 7.5,71.2', 'M 24.0,72.5 L 24.5,70.8'],
    pathShards: ['grupy', 'wydarzenia']
  },
  {
    // 7: gry <-> wydarzenia (32,74 -> 56,76)
    mainPath: 'M 32,74 L 38.0,74.5 L 44.0,75.0 L 50.0,75.5 L 56,76',
    branches: ['M 38.0,74.5 L 37.5,76.2', 'M 50.0,75.5 L 50.5,73.8'],
    pathShards: ['gry', 'wydarzenia']
  },
  {
    // 8: gry <-> profil (56,76 -> 100,72)
    mainPath: 'M 56,76 L 67.0,75.0 L 78.0,74.0 L 89.0,73.0 L 100,72',
    branches: ['M 67.0,75.0 L 66.2,76.8', 'M 89.0,73.0 L 89.8,71.2'],
    pathShards: ['gry', 'profil']
  },
  {
    // 9: wydarzenia <-> profil (56,76 -> 52,100)
    mainPath: 'M 56,76 L 55.0,82.0 L 54.0,88.0 L 53.0,94.0 L 52,100',
    branches: ['M 55.0,82.0 L 56.8,82.5', 'M 53.0,94.0 L 51.2,93.5'],
    pathShards: ['wydarzenia', 'profil']
  }
];

// Mobile Junction Corners - Różnorodne oszronienia narożników
const MOBILE_CORNER_FROST: UniqueCornerFrost[] = [
  { id: 'mob_core_42_20', x: 42, y: 20, type: 'dusting' },
  { id: 'mob_mid_48_58', x: 48, y: 58, type: 'patch' },
  { id: 'mob_lower_32_74', x: 32, y: 74, type: 'branch_fracture' },
  { id: 'mob_bot_56_76', x: 56, y: 76, type: 'granules' }
];

const SHARD_HOVER_COLORS: Record<string, string> = {
  czaty: 'rgba(168, 85, 247, 0.95)',
  sciana: 'rgba(56, 189, 248, 0.95)',
  reels: 'rgba(244, 63, 94, 0.95)',
  grupy: 'rgba(16, 185, 129, 0.95)',
  gry: 'rgba(6, 182, 212, 0.95)',
  wydarzenia: 'rgba(245, 158, 11, 0.95)',
  profil: 'rgba(234, 179, 8, 0.95)'
};

export const ShatterAnimationOverlay: React.FC<ShatterAnimationOverlayProps> = ({
  isShattered = false,
  isShattering = false,
  hoveredShard = null
}) => {
  // Crack propagation sequence timing (ms) starting at 250ms after initial glass stress flash
  // Tier 1 (250-470ms) -> Tier 2 (450-670ms) -> Tier 3 (620-840ms)
  const desktopDelays = [250, 270, 290, 450, 480, 510, 540, 620, 650, 680, 710];
  const desktopDurations = [220, 220, 220, 210, 210, 210, 210, 200, 200, 200, 200];

  const mobileDelays = [250, 280, 310, 450, 490, 530, 610, 650, 690, 730];
  const mobileDurations = [220, 220, 220, 210, 210, 210, 200, 200, 200, 200];

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* 0–250 ms: Subtelne naprężenie/flash szkła w punkcie inicjalnym */}
      {isShattering && (
        <>
          <div
            className="hidden md:block absolute w-20 h-20 -ml-10 -mt-10 rounded-full bg-radial from-cyan-100/30 via-sky-300/10 to-transparent pointer-events-none"
            style={{
              left: '44%',
              top: '18%',
              animation: 'centralTensionFlash 250ms cubic-bezier(0.22, 1, 0.36, 1) forwards'
            }}
          />
          <div
            className="md:hidden absolute w-20 h-20 -ml-10 -mt-10 rounded-full bg-radial from-cyan-100/30 via-sky-300/10 to-transparent pointer-events-none"
            style={{
              left: '42%',
              top: '20%',
              animation: 'centralTensionFlash 250ms cubic-bezier(0.22, 1, 0.36, 1) forwards'
            }}
          />
        </>
      )}

      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Subtelny blur krawędzi - zredukowany glow o 60-70% */}
          <filter id="fissure-subtle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="fissure-hover-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* DESKTOP FROZEN FISSURES & CORNERS */}
        <g className="hidden md:block">
          {DESKTOP_ORGANIC_FISSURES.map((fissure, idx) => {
            const delay = desktopDelays[idx] || 250;
            const duration = desktopDurations[idx] || 200;
            const isHighlighted = hoveredShard ? fissure.pathShards.includes(hoveredShard) : false;
            const highlightColor = hoveredShard && SHARD_HOVER_COLORS[hoveredShard]
              ? SHARD_HOVER_COLORS[hoveredShard]
              : 'rgba(240, 249, 255, 0.95)';

            return (
              <g key={`desk_fiss_${idx}`}>
                {/* 1. Deep Void Gap Shadow (Ciemna szczelina między taflami) */}
                <path
                  d={fissure.mainPath}
                  fill="none"
                  stroke="rgba(2, 6, 16, 0.95)"
                  strokeWidth={isHighlighted ? '2.4' : '1.8'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={
                    isShattered && !isShattering
                      ? { opacity: 1, transition: 'all 300ms ease' }
                      : {
                          animation: `fissureFadeIn 300ms ease ${delay + 150}ms forwards`,
                          opacity: 0
                        }
                  }
                />

                {/* 2. Organic Frost Coating Layer (Nieregularny szron i śnieżny pył) */}
                <path
                  d={fissure.mainPath}
                  fill="none"
                  stroke="rgba(240, 249, 255, 0.72)"
                  strokeWidth={isHighlighted ? '1.5' : '1.0'}
                  strokeDasharray="1.5 0.8 6 1.8 0.6 0.4 9 2.2 0.8 1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={
                    isShattered && !isShattering
                      ? { opacity: 0.85, transition: 'all 300ms ease' }
                      : {
                          animation: `fissureFadeIn 350ms ease ${delay + 180}ms forwards`,
                          opacity: 0
                        }
                  }
                />

                {/* 3. Primary Crack Propagation Line (Krawędź pęknięcia szkła) */}
                <path
                  d={fissure.mainPath}
                  fill="none"
                  stroke={isHighlighted ? highlightColor : 'rgba(255, 255, 255, 0.88)'}
                  strokeWidth={isHighlighted ? '1.0' : '0.6'}
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset={isShattered && !isShattering ? 0 : 100}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  filter={isHighlighted ? 'url(#fissure-hover-glow)' : 'url(#fissure-subtle-glow)'}
                  style={
                    isShattered && !isShattering
                      ? { strokeDashoffset: 0, transition: 'all 300ms ease' }
                      : {
                          animation: `crackDraw ${duration}ms cubic-bezier(0.25, 0.8, 0.25, 1) ${delay}ms forwards`
                        }
                  }
                />

                {/* 4. Branching Micro-cracks (Mikropęknięcia odchodzące kilka px) */}
                {fissure.branches.map((branchD, bIdx) => (
                  <path
                    key={`desk_br_${idx}_${bIdx}`}
                    d={branchD}
                    fill="none"
                    stroke={isHighlighted ? highlightColor : 'rgba(224, 242, 254, 0.75)'}
                    strokeWidth="0.45"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={
                      isShattered && !isShattering
                        ? { opacity: 0.7, transition: 'all 300ms ease' }
                        : {
                            animation: `fissureFadeIn 250ms ease ${delay + 200 + bIdx * 30}ms forwards`,
                            opacity: 0
                          }
                    }
                  />
                ))}
              </g>
            );
          })}

          {/* Organic Junction Corners for Desktop - Każdy narożnik Unikalny */}
          {DESKTOP_CORNER_FROST.map((corner) => (
            <g
              key={`desk_corner_${corner.id}`}
              style={{
                opacity: isShattered ? 1 : isShattering ? 1 : 0,
                transition: 'opacity 400ms ease'
              }}
            >
              {corner.type === 'dusting' && (
                <circle
                  cx={corner.x}
                  cy={corner.y}
                  r="0.8"
                  fill="rgba(240, 249, 255, 0.55)"
                  filter="url(#fissure-subtle-glow)"
                />
              )}
              {corner.type === 'patch' && (
                <path
                  d={`M ${corner.x - 0.9},${corner.y - 0.6} Q ${corner.x},${corner.y - 1.2} ${corner.x + 0.9},${corner.y - 0.4} Q ${corner.x + 0.6},${corner.y + 0.8} ${corner.x - 0.7},${corner.y + 0.6} Z`}
                  fill="rgba(240, 249, 255, 0.45)"
                />
              )}
              {corner.type === 'granules' && (
                <>
                  <circle cx={corner.x - 0.4} cy={corner.y - 0.3} r="0.2" fill="rgba(255, 255, 255, 0.8)" />
                  <circle cx={corner.x + 0.3} cy={corner.y + 0.4} r="0.18" fill="rgba(255, 255, 255, 0.7)" />
                  <circle cx={corner.x + 0.2} cy={corner.y - 0.5} r="0.15" fill="rgba(240, 249, 255, 0.6)" />
                </>
              )}
              {corner.type === 'micro_rim' && (
                <circle cx={corner.x} cy={corner.y} r="0.5" fill="rgba(224, 242, 254, 0.35)" />
              )}
              {corner.type === 'branch_fracture' && (
                <path
                  d={`M ${corner.x - 0.6},${corner.y - 0.5} L ${corner.x},${corner.y} L ${corner.x + 0.7},${corner.y - 0.3} M ${corner.x},${corner.y} L ${corner.x - 0.2},${corner.y + 0.6}`}
                  stroke="rgba(240, 249, 255, 0.7)"
                  strokeWidth="0.4"
                  fill="none"
                />
              )}
              {corner.type === 'icy_haze' && (
                <circle cx={corner.x} cy={corner.y} r="1.1" fill="rgba(186, 230, 253, 0.2)" />
              )}
            </g>
          ))}
        </g>

        {/* MOBILE FROZEN FISSURES & CORNERS */}
        <g className="md:hidden">
          {MOBILE_ORGANIC_FISSURES.map((fissure, idx) => {
            const delay = mobileDelays[idx] || 250;
            const duration = mobileDurations[idx] || 200;
            const isHighlighted = hoveredShard ? fissure.pathShards.includes(hoveredShard) : false;
            const highlightColor = hoveredShard && SHARD_HOVER_COLORS[hoveredShard]
              ? SHARD_HOVER_COLORS[hoveredShard]
              : 'rgba(240, 249, 255, 0.95)';

            return (
              <g key={`mob_fiss_${idx}`}>
                {/* 1. Deep Void Shadow */}
                <path
                  d={fissure.mainPath}
                  fill="none"
                  stroke="rgba(2, 6, 16, 0.95)"
                  strokeWidth={isHighlighted ? '2.4' : '1.8'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={
                    isShattered && !isShattering
                      ? { opacity: 1, transition: 'all 300ms ease' }
                      : {
                          animation: `fissureFadeIn 300ms ease ${delay + 150}ms forwards`,
                          opacity: 0
                        }
                  }
                />

                {/* 2. Organic Frost Coating */}
                <path
                  d={fissure.mainPath}
                  fill="none"
                  stroke="rgba(240, 249, 255, 0.72)"
                  strokeWidth={isHighlighted ? '1.5' : '1.0'}
                  strokeDasharray="1.5 0.8 6 1.8 0.6 0.4 9 2.2 0.8 1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={
                    isShattered && !isShattering
                      ? { opacity: 0.85, transition: 'all 300ms ease' }
                      : {
                          animation: `fissureFadeIn 350ms ease ${delay + 180}ms forwards`,
                          opacity: 0
                        }
                  }
                />

                {/* 3. Primary Crack Line */}
                <path
                  d={fissure.mainPath}
                  fill="none"
                  stroke={isHighlighted ? highlightColor : 'rgba(255, 255, 255, 0.88)'}
                  strokeWidth={isHighlighted ? '1.0' : '0.6'}
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset={isShattered && !isShattering ? 0 : 100}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  filter={isHighlighted ? 'url(#fissure-hover-glow)' : 'url(#fissure-subtle-glow)'}
                  style={
                    isShattered && !isShattering
                      ? { strokeDashoffset: 0, transition: 'all 300ms ease' }
                      : {
                          animation: `crackDraw ${duration}ms cubic-bezier(0.25, 0.8, 0.25, 1) ${delay}ms forwards`
                        }
                  }
                />

                {/* 4. Branching Micro-cracks */}
                {fissure.branches.map((branchD, bIdx) => (
                  <path
                    key={`mob_br_${idx}_${bIdx}`}
                    d={branchD}
                    fill="none"
                    stroke={isHighlighted ? highlightColor : 'rgba(224, 242, 254, 0.75)'}
                    strokeWidth="0.45"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={
                      isShattered && !isShattering
                        ? { opacity: 0.7, transition: 'all 300ms ease' }
                        : {
                            animation: `fissureFadeIn 250ms ease ${delay + 200 + bIdx * 30}ms forwards`,
                            opacity: 0
                          }
                    }
                  />
                ))}
              </g>
            );
          })}

          {/* Organic Junction Corners for Mobile */}
          {MOBILE_CORNER_FROST.map((corner) => (
            <g
              key={`mob_corner_${corner.id}`}
              style={{
                opacity: isShattered ? 1 : isShattering ? 1 : 0,
                transition: 'opacity 400ms ease'
              }}
            >
              {corner.type === 'dusting' && (
                <circle cx={corner.x} cy={corner.y} r="0.8" fill="rgba(240, 249, 255, 0.55)" filter="url(#fissure-subtle-glow)" />
              )}
              {corner.type === 'patch' && (
                <path d={`M ${corner.x - 0.8},${corner.y - 0.5} Q ${corner.x},${corner.y - 1.0} ${corner.x + 0.8},${corner.y - 0.3} Q ${corner.x + 0.5},${corner.y + 0.7} ${corner.x - 0.6},${corner.y + 0.5} Z`} fill="rgba(240, 249, 255, 0.45)" />
              )}
              {corner.type === 'branch_fracture' && (
                <path d={`M ${corner.x - 0.5},${corner.y - 0.4} L ${corner.x},${corner.y} L ${corner.x + 0.6},${corner.y - 0.2}`} stroke="rgba(240, 249, 255, 0.7)" strokeWidth="0.4" fill="none" />
              )}
              {corner.type === 'granules' && (
                <>
                  <circle cx={corner.x - 0.3} cy={corner.y - 0.3} r="0.2" fill="rgba(255, 255, 255, 0.8)" />
                  <circle cx={corner.x + 0.3} cy={corner.y + 0.3} r="0.18" fill="rgba(255, 255, 255, 0.7)" />
                </>
              )}
            </g>
          ))}
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

        @keyframes centralTensionFlash {
          0% {
            opacity: 0;
            transform: scale(0.2);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.2);
          }
          100% {
            opacity: 0;
            transform: scale(2.0);
          }
        }

        @keyframes fissureFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          path {
            animation-duration: 150ms !important;
            animation-delay: 50ms !important;
          }
        }
      `}</style>
    </div>
  );
};
