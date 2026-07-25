// MaG Frost Defense - Endless Tower Defense Game Engine
// Handles simulation, pathing, tower targeting, projectiles, particles, wave spawner, endless scaling, and rendering.

export type TowerType = 'archer' | 'frost' | 'cannon' | 'flame';

export type TowerTier = 'BASIC' | 'IMPROVED' | 'ADVANCED' | 'ELITE' | 'LEGENDARY';

export function getTowerTier(level: number): { tier: TowerTier; label: string; color: string } {
  if (level <= 2) return { tier: 'BASIC', label: 'PODSTAWOWA', color: '#94a3b8' };
  if (level <= 4) return { tier: 'IMPROVED', label: 'ULEPSZONA', color: '#38bdf8' };
  if (level <= 6) return { tier: 'ADVANCED', label: 'ZAAWANSOWANA', color: '#a855f7' };
  if (level <= 8) return { tier: 'ELITE', label: 'ELITARNA', color: '#f59e0b' };
  return { tier: 'LEGENDARY', label: 'LEGENDARNA', color: '#ef4444' };
}

export interface TowerData {
  id: string;
  type: TowerType;
  spotId: number;
  x: number; // canvas px
  y: number; // canvas px
  level: number; // 1..10
  damage: number;
  range: number;
  attackSpeed: number; // seconds per attack
  lastFired: number; // timestamp
  angle: number; // radians orientation
  kills: number;
  totalDamageDealt: number;
}

export type EnemyType =
  | 'frostling'
  | 'raider'
  | 'icewolf'
  | 'brute'
  | 'shield'
  | 'icebeast'
  | 'frost_golem'
  | 'glacier_drake'
  | 'jotun_warlord'
  | 'frost_titan'
  | 'ice_behemoth'
  | 'raider_king'
  | 'frozen_colossus';

export interface EnemyData {
  id: string;
  type: EnemyType;
  name: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number; // base speed in px/sec
  currentSpeed: number;
  bounty: number; // energy reward
  damageToFortress: number;
  waypointIndex: number;
  progress: number; // total distance traveled along path
  slowDuration: number; // remaining seconds of slow
  slowFactor: number; // e.g. 0.5 for 50% speed
  isBoss: boolean;
  size: number; // radius in px
  color: string;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetEnemyId?: string;
  speed: number;
  damage: number;
  towerType: TowerType;
  splashRadius?: number;
  slowEffect?: boolean;
  progress: number; // 0 to 1
  startX: number;
  startY: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number; // remaining sec
  maxLife: number;
}

export interface BuildSpot {
  id: number;
  normX: number; // 0 to 1
  normY: number; // 0 to 1
  tower?: TowerData;
}

export interface WaveConfig {
  waveNumber: number;
  title: string;
  description: string;
  enemiesToSpawn: { type: EnemyType; count: number; intervalSec: number }[];
  isBossWave?: boolean;
  bossName?: string;
}

// TOWER SPECS (Base LVL 1 values)
export const TOWER_SPECS: Record<TowerType, {
  name: string;
  cost: number;
  damage: number;
  range: number;
  attackSpeed: number; // sec
  desc: string;
  color: string;
}> = {
  archer: {
    name: 'WIEŻA ŁUCZNIKÓW',
    cost: 100,
    damage: 32,
    range: 155,
    attackSpeed: 0.5,
    desc: 'Szybkie celne strzały w pojedyncze cele.',
    color: '#38bdf8'
  },
  frost: {
    name: 'WIEŻA LODOWA',
    cost: 140,
    damage: 20,
    range: 140,
    attackSpeed: 0.85,
    desc: 'Lodowe pociski spowalniają wrogów o 50%.',
    color: '#06b6d4'
  },
  cannon: {
    name: 'CIĘŻKIE DZIAŁO',
    cost: 210,
    damage: 115,
    range: 180,
    attackSpeed: 1.7,
    desc: 'Potężny ogień eksplodujący obszarowo.',
    color: '#f59e0b'
  },
  flame: {
    name: 'MIOTACZ OGNIA',
    cost: 180,
    damage: 11,
    range: 115,
    attackSpeed: 0.1,
    desc: 'Ciągły strumień płomieni wypalający hordy.',
    color: '#ef4444'
  }
};

// Calculate upgrade cost for given tower level (1 to 9 -> 2 to 10)
export function getUpgradeCost(type: TowerType, currentLevel: number): number {
  const baseCost = TOWER_SPECS[type].cost;
  return Math.floor(baseCost * Math.pow(1.5, currentLevel));
}

// Calculate sell refund value
export function getSellRefund(type: TowerType, level: number): number {
  let totalInvested = TOWER_SPECS[type].cost;
  for (let l = 1; l < level; l++) {
    totalInvested += getUpgradeCost(type, l);
  }
  return Math.floor(totalInvested * 0.7);
}

// ENEMY SPECS
export const ENEMY_SPECS: Record<EnemyType, {
  name: string;
  hp: number;
  speed: number;
  bounty: number;
  damage: number;
  size: number;
  color: string;
  isBoss?: boolean;
}> = {
  frostling: { name: 'Frostling', hp: 120, speed: 78, bounty: 18, damage: 3, size: 8, color: '#a5f3fc' },
  raider: { name: 'Śnieżny Grabieżca', hp: 280, speed: 55, bounty: 28, damage: 5, size: 11, color: '#38bdf8' },
  icewolf: { name: 'Lodowy Wilk', hp: 210, speed: 98, bounty: 25, damage: 4, size: 9, color: '#e0f2fe' },
  brute: { name: 'Mroźny Brute', hp: 900, speed: 40, bounty: 60, damage: 12, size: 15, color: '#0284c7' },
  shield: { name: 'Tarczownik', hp: 1350, speed: 46, bounty: 80, damage: 10, size: 14, color: '#475569' },
  icebeast: { name: 'Bestia Lodu', hp: 2600, speed: 34, bounty: 130, damage: 18, size: 18, color: '#1e3a8a' },

  // Bosses (Every 10 waves)
  frost_golem: { name: 'FROST GOLEM (BOSS)', hp: 5500, speed: 28, bounty: 350, damage: 25, size: 24, color: '#38bdf8', isBoss: true },
  glacier_drake: { name: 'GLACIER DRAKE (BOSS)', hp: 12000, speed: 34, bounty: 600, damage: 35, size: 27, color: '#0284c7', isBoss: true },
  jotun_warlord: { name: 'JOTUN WARLORD (BOSS)', hp: 24000, speed: 25, bounty: 900, damage: 50, size: 30, color: '#1e293b', isBoss: true },
  frost_titan: { name: 'FROST TITAN (BOSS)', hp: 45000, speed: 22, bounty: 1500, damage: 70, size: 35, color: '#f59e0b', isBoss: true },
  ice_behemoth: { name: 'ICE BEHEMOTH (BOSS)', hp: 75000, speed: 20, bounty: 2200, damage: 85, size: 38, color: '#06b6d4', isBoss: true },
  raider_king: { name: 'RAIDER KING (BOSS)', hp: 120000, speed: 30, bounty: 3200, damage: 100, size: 36, color: '#ef4444', isBoss: true },
  frozen_colossus: { name: 'FROZEN COLOSSUS (BOSS)', hp: 200000, speed: 18, bounty: 5000, damage: 120, size: 40, color: '#9333ea', isBoss: true }
};

// PROCEDURAL ENDLESS WAVE GENERATOR
export function generateWaveConfig(waveNum: number): WaveConfig {
  const isBoss = waveNum % 10 === 0;

  if (isBoss) {
    const bossTypes: EnemyType[] = [
      'frost_golem',
      'glacier_drake',
      'jotun_warlord',
      'frost_titan',
      'ice_behemoth',
      'raider_king',
      'frozen_colossus'
    ];
    const bossIndex = Math.floor((waveNum / 10 - 1)) % bossTypes.length;
    const bossType = bossTypes[bossIndex];
    const bossSpec = ENEMY_SPECS[bossType];

    // Scale minion counts with wave
    const minionCount = 10 + Math.floor(waveNum * 0.5);

    return {
      waveNumber: waveNum,
      title: `Fala ${waveNum}: BOSS - ${bossSpec.name}`,
      description: `Potężny Boss nadciąga z osłoną ${minionCount} mroźnych strażników!`,
      isBossWave: true,
      bossName: bossSpec.name,
      enemiesToSpawn: [
        { type: bossType, count: 1, intervalSec: 0.1 },
        { type: waveNum > 30 ? 'shield' : 'raider', count: minionCount, intervalSec: 0.8 }
      ]
    };
  }

  // Regular Wave composition scaling
  if (waveNum <= 5) {
    return {
      waveNumber: waveNum,
      title: `Fala ${waveNum}: Zwiadowcy Mrozu`,
      description: 'Niewielkie oddziały Frostlingów i Grabieżców badają bramy.',
      enemiesToSpawn: [
        { type: 'frostling', count: 6 + waveNum * 2, intervalSec: 1.1 },
        { type: 'raider', count: Math.max(0, waveNum - 1) * 2, intervalSec: 1.4 }
      ]
    };
  }

  if (waveNum <= 10) {
    return {
      waveNumber: waveNum,
      title: `Fala ${waveNum}: Wataha i Piechota`,
      description: 'Szybkie Wilki i opancerzeni Grabieżcy przechodzą do szturmu.',
      enemiesToSpawn: [
        { type: 'icewolf', count: 8 + waveNum, intervalSec: 0.8 },
        { type: 'raider', count: 6 + waveNum, intervalSec: 1.1 },
        { type: 'shield', count: Math.floor(waveNum / 2), intervalSec: 2.0 }
      ]
    };
  }

  if (waveNum <= 20) {
    return {
      waveNumber: waveNum,
      title: `Fala ${waveNum}: Ciężka Kolumna`,
      description: 'Tarczownicy oraz Bruty prowadzą zwarty szpaler.',
      enemiesToSpawn: [
        { type: 'shield', count: 6 + Math.floor(waveNum * 0.8), intervalSec: 1.0 },
        { type: 'brute', count: 4 + Math.floor(waveNum * 0.5), intervalSec: 1.8 },
        { type: 'frostling', count: 12 + waveNum, intervalSec: 0.5 }
      ]
    };
  }

  if (waveNum <= 30) {
    return {
      waveNumber: waveNum,
      title: `Fala ${waveNum}: Szturm Pancerza i Szybkości`,
      description: 'Ciężkie Bestie Lodu i pędzące Wilki w mieszanej wataże.',
      enemiesToSpawn: [
        { type: 'icebeast', count: 4 + Math.floor(waveNum * 0.3), intervalSec: 2.2 },
        { type: 'icewolf', count: 15 + waveNum, intervalSec: 0.4 },
        { type: 'shield', count: 10 + Math.floor(waveNum * 0.5), intervalSec: 0.9 }
      ]
    };
  }

  // Wave 31+ Endless Horde
  return {
    waveNumber: waveNum,
    title: `Fala ${waveNum}: Mroźny Armageddon`,
    description: `Potężna bezkresna horda przerażających stworzeń lodu!`,
    enemiesToSpawn: [
      { type: 'icebeast', count: 6 + Math.floor(waveNum * 0.25), intervalSec: 1.5 },
      { type: 'brute', count: 8 + Math.floor(waveNum * 0.3), intervalSec: 1.2 },
      { type: 'shield', count: 12 + Math.floor(waveNum * 0.4), intervalSec: 0.7 },
      { type: 'icewolf', count: 20 + Math.floor(waveNum * 0.5), intervalSec: 0.3 }
    ]
  };
}

// Calculate HP multiplier for wave scaling
export function getWaveHpMultiplier(waveNum: number, isBoss: boolean): number {
  if (waveNum <= 10) return 1 + (waveNum - 1) * 0.12;
  if (waveNum <= 20) return 2.2 + (waveNum - 10) * 0.18;
  if (waveNum <= 30) return 4.0 + (waveNum - 20) * 0.25;
  if (waveNum <= 50) return 6.5 + (waveNum - 30) * 0.35;
  // Endless 50+
  return 13.5 + (waveNum - 50) * 0.55;
}
