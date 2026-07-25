import type React from 'react';

export interface ShardGeometry {
  id: 'czaty' | 'sciana' | 'reels' | 'grupy' | 'wydarzenia' | 'gry' | 'profil';
  title: string;
  points: [number, number][]; // percentages 0-100
  clipPath: string;
  contentStyle: React.CSSProperties;
}

// Master geometry for Desktop (7 Shards)
export const DESKTOP_SHARDS: ShardGeometry[] = [
  {
    id: 'czaty',
    title: 'CZATY',
    points: [[0, 0], [44, 0], [44, 18], [28, 38], [0, 48]],
    clipPath: 'polygon(0% 0%, 44% 0%, 44% 18%, 28% 38%, 0% 48%)',
    contentStyle: { position: 'absolute', top: '3%', left: '3%', width: '28%', height: '36%' }
  },
  {
    id: 'sciana',
    title: 'ŚCIANA',
    points: [[44, 18], [72, 42], [64, 62], [36, 65], [28, 38]],
    clipPath: 'polygon(44% 18%, 72% 42%, 64% 62%, 36% 65%, 28% 38%)',
    contentStyle: { position: 'absolute', top: '24%', left: '32%', width: '36%', height: '36%' }
  },
  {
    id: 'reels',
    title: 'REELS',
    points: [[44, 0], [100, 0], [100, 52], [72, 42], [44, 18]],
    clipPath: 'polygon(44% 0%, 100% 0%, 100% 52%, 72% 42%, 44% 18%)',
    contentStyle: { position: 'absolute', top: '3%', left: '48%', width: '48%', height: '35%' }
  },
  {
    id: 'grupy',
    title: 'GRUPY',
    points: [[0, 48], [28, 38], [36, 65], [22, 82], [0, 78]],
    clipPath: 'polygon(0% 48%, 28% 38%, 36% 65%, 22% 82%, 0% 78%)',
    contentStyle: { position: 'absolute', top: '48%', left: '3%', width: '24%', height: '28%' }
  },
  {
    id: 'wydarzenia',
    title: 'WYDARZENIA',
    points: [[0, 78], [22, 82], [36, 65], [64, 62], [78, 76], [60, 100], [0, 100]],
    clipPath: 'polygon(0% 78%, 22% 82%, 36% 65%, 64% 62%, 78% 76%, 60% 100%, 0% 100%)',
    contentStyle: { position: 'absolute', top: '74%', left: '3%', width: '54%', height: '23%' }
  },
  {
    id: 'gry',
    title: 'GRY',
    points: [[72, 42], [100, 52], [100, 84], [78, 76], [64, 62]],
    clipPath: 'polygon(72% 42%, 100% 52%, 100% 84%, 78% 76%, 64% 62%)',
    contentStyle: { position: 'absolute', top: '50%', left: '74%', width: '23%', height: '28%' }
  },
  {
    id: 'profil',
    title: 'PROFIL',
    points: [[78, 76], [100, 84], [100, 100], [60, 100]],
    clipPath: 'polygon(78% 76%, 100% 84%, 100% 100%, 60% 100%)',
    contentStyle: { position: 'absolute', top: '80%', left: '64%', width: '33%', height: '18%' }
  }
];

// Master geometry for Mobile (7 Shards)
export const MOBILE_SHARDS: ShardGeometry[] = [
  {
    id: 'czaty',
    title: 'CZATY',
    points: [[0, 0], [52, 0], [42, 20], [0, 28]],
    clipPath: 'polygon(0% 0%, 52% 0%, 42% 20%, 0% 28%)',
    contentStyle: { position: 'absolute', top: '2%', left: '2%', width: '38%', height: '22%' }
  },
  {
    id: 'reels',
    title: 'REELS',
    points: [[52, 0], [100, 0], [100, 26], [62, 34], [42, 20]],
    clipPath: 'polygon(52% 0%, 100% 0%, 100% 26%, 62% 34%, 42% 20%)',
    contentStyle: { position: 'absolute', top: '2%', left: '50%', width: '46%', height: '22%' }
  },
  {
    id: 'sciana',
    title: 'ŚCIANA',
    points: [[42, 20], [62, 34], [100, 26], [88, 52], [48, 58], [20, 50], [0, 28]],
    clipPath: 'polygon(42% 20%, 62% 34%, 100% 26%, 88% 52%, 48% 58%, 20% 50%, 0% 28%)',
    contentStyle: { position: 'absolute', top: '26%', left: '6%', width: '88%', height: '24%' }
  },
  {
    id: 'grupy',
    title: 'GRUPY',
    points: [[0, 28], [20, 50], [48, 58], [32, 74], [0, 68]],
    clipPath: 'polygon(0% 28%, 20% 50%, 48% 58%, 32% 74%, 0% 68%)',
    contentStyle: { position: 'absolute', top: '48%', left: '2%', width: '40%', height: '18%' }
  },
  {
    id: 'gry',
    title: 'GRY',
    points: [[48, 58], [88, 52], [100, 26], [100, 72], [56, 76], [32, 74]],
    clipPath: 'polygon(48% 58%, 88% 52%, 100% 26%, 100% 72%, 56% 76%, 32% 74%)',
    contentStyle: { position: 'absolute', top: '54%', left: '50%', width: '46%', height: '18%' }
  },
  {
    id: 'wydarzenia',
    title: 'WYDARZENIA',
    points: [[0, 68], [32, 74], [56, 76], [52, 100], [0, 100]],
    clipPath: 'polygon(0% 68%, 32% 74%, 56% 76%, 52% 100%, 0% 100%)',
    contentStyle: { position: 'absolute', top: '74%', left: '2%', width: '48%', height: '22%' }
  },
  {
    id: 'profil',
    title: 'PROFIL',
    points: [[56, 76], [100, 72], [100, 100], [52, 100]],
    clipPath: 'polygon(56% 76%, 100% 72%, 100% 100%, 52% 100%)',
    contentStyle: { position: 'absolute', top: '76%', left: '58%', width: '38%', height: '20%' }
  }
];

// Shared internal seam lines (fissure paths) derived from the exact polygon shared edges of Desktop
// Spreading outward from the central core (around 44 18, 36 65, 64 62)
export const DESKTOP_FISSURE_PATHS: string[] = [
  // Central core to top edge (separating CZATY and REELS)
  'M 44,18 L 44,0',
  // Central core to top-left (separating CZATY and ŚCIANA)
  'M 44,18 L 28,38',
  // Mid-left to left edge (separating CZATY and GRUPY)
  'M 28,38 L 0,48',
  // Central core to top-right (separating REELS and ŚCIANA)
  'M 44,18 L 72,42',
  // Mid-right to right edge (separating REELS and GRY)
  'M 72,42 L 100,52',
  // Mid-left down to lower-mid (separating ŚCIANA and GRUPY)
  'M 28,38 L 36,65',
  // Lower-mid across (separating ŚCIANA and WYDARZENIA)
  'M 36,65 L 64,62',
  // Lower-mid up-right (separating ŚCIANA and GRY)
  'M 64,62 L 72,42',
  // Lower-mid to bottom-left (separating GRUPY and WYDARZENIA)
  'M 36,65 L 22,82 L 0,78',
  // Lower-mid to bottom-right (separating GRY and PROFIL)
  'M 64,62 L 78,76 L 100,84',
  // Bottom-right to bottom edge (separating WYDARZENIA and PROFIL)
  'M 78,76 L 60,100'
];

// Shared internal seam lines for Mobile
export const MOBILE_FISSURE_PATHS: string[] = [
  'M 42,20 L 52,0',
  'M 42,20 L 0,28',
  'M 42,20 L 62,34 L 100,26',
  'M 42,20 L 20,50 L 0,28',
  'M 20,50 L 48,58',
  'M 48,58 L 88,52 L 100,26',
  'M 48,58 L 32,74 L 0,68',
  'M 32,74 L 56,76 L 100,72',
  'M 56,76 L 52,100'
];
