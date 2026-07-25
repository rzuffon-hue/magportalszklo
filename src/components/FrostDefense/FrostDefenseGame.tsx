import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Heart,
  Zap,
  Flame,
  Play,
  Pause,
  FastForward,
  Trophy,
  ArrowLeft,
  ChevronUp,
  X,
  HelpCircle,
  Target,
  Sparkles,
  Skull,
  Award
} from 'lucide-react';
import {
  TowerType,
  TowerData,
  EnemyType,
  EnemyData,
  Projectile,
  Particle,
  BuildSpot,
  TOWER_SPECS,
  ENEMY_SPECS,
  getUpgradeCost,
  getSellRefund,
  getTowerTier,
  generateWaveConfig,
  getWaveHpMultiplier
} from './gameEngine';
import { FrostDefenseLeaderboard, FrostDefenseScoreRecord } from './FrostDefenseLeaderboard';

interface FrostDefenseGameProps {
  onBackToCatalog: () => void;
}

// Normalized path coordinates (0 to 1) along the S-curve
const WAYPOINTS = [
  { x: 0.12, y: 0.05 },
  { x: 0.12, y: 0.22 },
  { x: 0.82, y: 0.22 },
  { x: 0.82, y: 0.48 },
  { x: 0.18, y: 0.48 },
  { x: 0.18, y: 0.72 },
  { x: 0.50, y: 0.72 },
  { x: 0.50, y: 0.88 } // Fortress Gate
];

// 10 Interactive Build Spots (normalized coords) carefully spaced along path
const INITIAL_BUILD_SPOTS: BuildSpot[] = [
  { id: 0, normX: 0.28, normY: 0.13 },
  { id: 1, normX: 0.65, normY: 0.13 },
  { id: 2, normX: 0.68, normY: 0.35 },
  { id: 3, normX: 0.35, normY: 0.35 },
  { id: 4, normX: 0.34, normY: 0.60 },
  { id: 5, normX: 0.66, normY: 0.60 },
  { id: 6, normX: 0.28, normY: 0.80 },
  { id: 7, normX: 0.72, normY: 0.80 },
  { id: 8, normX: 0.50, normY: 0.35 },
  { id: 9, normX: 0.50, normY: 0.60 }
];

export const FrostDefenseGame: React.FC<FrostDefenseGameProps> = ({ onBackToCatalog }) => {
  const { profile, usersList } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Core UI States
  const [fortressHp, setFortressHp] = useState<number>(100);
  const [energy, setEnergy] = useState<number>(320);
  const [currentWaveIdx, setCurrentWaveIdx] = useState<number>(1);
  const [gameSpeed, setGameSpeed] = useState<number>(1); // 1, 2, 3
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameState, setGameState] = useState<'idle' | 'wave_countdown' | 'playing' | 'defeat'>('idle');

  // Milestone Toast Banner (Every 5 waves)
  const [milestoneBanner, setMilestoneBanner] = useState<string | null>(null);

  // Wave Announcer & Countdown
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [waveAnnouncement, setWaveAnnouncement] = useState<string | null>(null);

  // Inspector & Popover States
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
  const [selectedTower, setSelectedTower] = useState<TowerData | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // Match Summary Stats
  const [enemiesKilledCount, setEnemiesKilledCount] = useState<number>(0);
  const [bossesKilledCount, setBossesKilledCount] = useState<number>(0);
  const [matchStartTime, setMatchStartTime] = useState<number>(0);
  const [matchDurationSec, setMatchDurationSec] = useState<number>(0);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isNewBestRecord, setIsNewBestRecord] = useState<boolean>(false);

  // Engine Refs (State persistence inside RAF animation loop)
  const buildSpotsRef = useRef<BuildSpot[]>(INITIAL_BUILD_SPOTS);
  const enemiesRef = useRef<EnemyData[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Wave Spawner Engine State
  const waveSpawningRef = useRef<{
    active: boolean;
    queue: EnemyType[];
    nextSpawnTime: number;
  }>({ active: false, queue: [], nextSpawnTime: 0 });

  const fortressHpRef = useRef<number>(100);
  const energyRef = useRef<number>(320);
  const currentWaveRef = useRef<number>(1);
  const enemiesKilledRef = useRef<number>(0);
  const bossesKilledRef = useRef<number>(0);
  const isGameRunningRef = useRef<boolean>(false);
  const screenShakeRef = useRef<number>(0);

  // Sync React state to refs
  useEffect(() => { fortressHpRef.current = fortressHp; }, [fortressHp]);
  useEffect(() => { energyRef.current = energy; }, [energy]);
  useEffect(() => { currentWaveRef.current = currentWaveIdx; }, [currentWaveIdx]);

  // Start / Reset Game Session
  const startNewGame = () => {
    buildSpotsRef.current = INITIAL_BUILD_SPOTS.map((s) => ({ ...s, tower: undefined }));
    enemiesRef.current = [];
    projectilesRef.current = [];
    particlesRef.current = [];
    waveSpawningRef.current = { active: false, queue: [], nextSpawnTime: 0 };

    setFortressHp(100);
    setEnergy(320);
    setCurrentWaveIdx(1);
    setEnemiesKilledCount(0);
    setBossesKilledCount(0);
    setMatchStartTime(Date.now());
    setMatchDurationSec(0);
    setSelectedSpotId(null);
    setSelectedTower(null);
    setIsPaused(false);
    setIsNewBestRecord(false);

    fortressHpRef.current = 100;
    energyRef.current = 320;
    currentWaveRef.current = 1;
    enemiesKilledRef.current = 0;
    bossesKilledRef.current = 0;

    triggerNextWaveCountdown(1);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Countdown & Wave Progression (Endless Mode)
  const triggerNextWaveCountdown = (waveNum: number) => {
    setGameState('wave_countdown');
    setCurrentWaveIdx(waveNum);
    currentWaveRef.current = waveNum;

    const waveConfig = generateWaveConfig(waveNum);
    setWaveAnnouncement(waveConfig.title);
    setCountdownNum(3);

    // Milestone every 5 waves
    if (waveNum % 5 === 0) {
      if (waveNum % 10 === 0) {
        setMilestoneBanner(`⚠️ BOSS NADCHODZI! FALA ${waveNum}`);
      } else {
        setMilestoneBanner(`🔥 KAMIEŃ MILOWY! FALA ${waveNum}`);
      }
      setTimeout(() => setMilestoneBanner(null), 3000);
    }

    if (waveConfig.isBossWave) {
      screenShakeRef.current = 25;
    }

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
      } else {
        clearInterval(interval);
        setWaveAnnouncement(null);
        setGameState('playing');
        startWaveSpawner(waveNum);
      }
    }, 1000);
  };

  // Populate Spawner Queue
  const startWaveSpawner = (waveNum: number) => {
    const waveConfig = generateWaveConfig(waveNum);
    const queue: EnemyType[] = [];

    waveConfig.enemiesToSpawn.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        queue.push(item.type);
      }
    });

    waveSpawningRef.current = {
      active: true,
      queue,
      nextSpawnTime: performance.now()
    };
  };

  // Handle Defeat when Fortress HP = 0
  const handleMatchDefeat = () => {
    setGameState('defeat');
    isGameRunningRef.current = false;

    const durationSec = Math.floor((Date.now() - matchStartTime) / 1000);
    setMatchDurationSec(durationSec);

    const waveReached = currentWaveRef.current;
    const killsBonus = enemiesKilledRef.current * 30;
    const bossBonus = bossesKilledRef.current * 1500;
    const waveBonus = waveReached * 800;
    const score = killsBonus + bossBonus + waveBonus;

    setFinalScore(score);
    saveScoreToLeaderboard(score, waveReached, durationSec);
  };

  // Save to Leaderboard LocalStorage DB
  const saveScoreToLeaderboard = (score: number, maxWave: number, durationSec: number) => {
    const raw = localStorage.getItem('mag_frost_defense_leaderboard');
    let list: FrostDefenseScoreRecord[] = [];
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {
        list = [];
      }
    }

    // Check if user set new personal best
    const existingUserBest = list.find((r) => r.userId === profile.id);
    if (!existingUserBest || maxWave > existingUserBest.maxWave) {
      setIsNewBestRecord(true);
    }

    const newRecord: FrostDefenseScoreRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: profile.id,
      userName: profile.name,
      userRole: profile.role,
      avatar: profile.avatar,
      score,
      maxWave,
      remainingHp: 0,
      enemiesKilled: enemiesKilledRef.current,
      bossesKilled: bossesKilledRef.current,
      durationSec,
      timestamp: new Date().toLocaleDateString('pl-PL')
    };

    list.push(newRecord);
    // Sort by maxWave desc, then score desc
    list.sort((a, b) => (b.maxWave !== a.maxWave ? b.maxWave - a.maxWave : b.score - a.score));
    localStorage.setItem('mag_frost_defense_leaderboard', JSON.stringify(list.slice(0, 50)));
  };

  // MAIN GAME CANVAS ENGINE LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    isGameRunningRef.current = true;

    const renderLoop = (now: number) => {
      const dtRaw = (now - lastTime) / 1000;
      lastTime = now;

      const dt = Math.min(0.1, dtRaw) * (isPaused ? 0 : gameSpeed);

      const width = canvas.width;
      const height = canvas.height;

      // 1. UPDATE GAME STATE
      if (gameState === 'playing' && !isPaused) {
        
        // A. WAVE SPAWNER
        const spawner = waveSpawningRef.current;
        if (spawner.active && spawner.queue.length > 0) {
          if (now >= spawner.nextSpawnTime) {
            const enemyType = spawner.queue.shift()!;
            const spec = ENEMY_SPECS[enemyType];

            const waveNum = currentWaveRef.current;
            const hpMult = getWaveHpMultiplier(waveNum, Boolean(spec.isBoss));
            const scaledHp = Math.floor(spec.hp * hpMult);

            const startPt = WAYPOINTS[0];
            const enemy: EnemyData = {
              id: `e_${now}_${Math.random()}`,
              type: enemyType,
              name: spec.name,
              x: startPt.x * width,
              y: startPt.y * height,
              hp: scaledHp,
              maxHp: scaledHp,
              speed: spec.speed,
              currentSpeed: spec.speed,
              bounty: Math.floor(spec.bounty * (1 + waveNum * 0.05)),
              damageToFortress: spec.damage,
              waypointIndex: 1,
              progress: 0,
              slowDuration: 0,
              slowFactor: 1.0,
              isBoss: Boolean(spec.isBoss),
              size: spec.size,
              color: spec.color
            };

            enemiesRef.current.push(enemy);

            const waveConfig = generateWaveConfig(waveNum);
            const intervalSec = waveConfig.enemiesToSpawn[0]?.intervalSec || 1.0;
            spawner.nextSpawnTime = now + (intervalSec * 1000) / gameSpeed;
          }
        } else if (spawner.active && spawner.queue.length === 0) {
          spawner.active = false;
        }

        // B. UPDATE ENEMIES
        const activeEnemies = enemiesRef.current;
        for (let i = activeEnemies.length - 1; i >= 0; i--) {
          const enemy = activeEnemies[i];

          if (enemy.slowDuration > 0) {
            enemy.slowDuration -= dt;
            enemy.currentSpeed = enemy.speed * enemy.slowFactor;
          } else {
            enemy.currentSpeed = enemy.speed;
          }

          const targetWp = WAYPOINTS[enemy.waypointIndex];
          const targetX = targetWp.x * width;
          const targetY = targetWp.y * height;

          const dx = targetX - enemy.x;
          const dy = targetY - enemy.y;
          const dist = Math.hypot(dx, dy);

          const step = enemy.currentSpeed * dt;
          enemy.progress += step;

          if (dist <= step) {
            enemy.x = targetX;
            enemy.y = targetY;
            enemy.waypointIndex += 1;

            if (enemy.waypointIndex >= WAYPOINTS.length) {
              const newHp = Math.max(0, fortressHpRef.current - enemy.damageToFortress);
              fortressHpRef.current = newHp;
              setFortressHp(newHp);

              screenShakeRef.current = enemy.isBoss ? 24 : 8;

              for (let p = 0; p < 12; p++) {
                particlesRef.current.push({
                  x: enemy.x,
                  y: enemy.y,
                  vx: (Math.random() - 0.5) * 120,
                  vy: (Math.random() - 0.5) * 120,
                  color: '#ef4444',
                  size: Math.random() * 4 + 2,
                  alpha: 1.0,
                  life: 0.6,
                  maxLife: 0.6
                });
              }

              activeEnemies.splice(i, 1);

              if (newHp <= 0) {
                handleMatchDefeat();
              }
              continue;
            }
          } else {
            enemy.x += (dx / dist) * step;
            enemy.y += (dy / dist) * step;
          }
        }

        // C. UPDATE TOWERS
        buildSpotsRef.current.forEach((spot) => {
          if (!spot.tower) return;
          const tower = spot.tower;

          let closestEnemy: EnemyData | null = null;
          let minDist = tower.range;

          enemiesRef.current.forEach((e) => {
            const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
            if (dist <= tower.range && dist < minDist) {
              minDist = dist;
              closestEnemy = e;
            }
          });

          if (closestEnemy) {
            tower.angle = Math.atan2(closestEnemy.y - tower.y, closestEnemy.x - tower.x);

            if (now - tower.lastFired >= (tower.attackSpeed * 1000) / gameSpeed) {
              tower.lastFired = now;

              if (tower.type === 'flame') {
                closestEnemy.hp -= tower.damage;
                tower.totalDamageDealt += tower.damage;

                for (let fp = 0; fp < 3; fp++) {
                  particlesRef.current.push({
                    x: tower.x,
                    y: tower.y,
                    vx: Math.cos(tower.angle + (Math.random() - 0.5) * 0.4) * 180,
                    vy: Math.sin(tower.angle + (Math.random() - 0.5) * 0.4) * 180,
                    color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
                    size: Math.random() * 6 + 3,
                    alpha: 1.0,
                    life: 0.3,
                    maxLife: 0.3
                  });
                }
              } else {
                projectilesRef.current.push({
                  id: `p_${now}_${Math.random()}`,
                  x: tower.x,
                  y: tower.y,
                  startX: tower.x,
                  startY: tower.y,
                  targetX: closestEnemy.x,
                  targetY: closestEnemy.y,
                  targetEnemyId: closestEnemy.id,
                  speed: tower.type === 'cannon' ? 320 : 550,
                  damage: tower.damage,
                  towerType: tower.type,
                  splashRadius: tower.type === 'cannon' ? 70 : undefined,
                  slowEffect: tower.type === 'frost',
                  progress: 0
                });
              }
            }
          }
        });

        // D. UPDATE PROJECTILES
        const activeProjectiles = projectilesRef.current;
        for (let i = activeProjectiles.length - 1; i >= 0; i--) {
          const p = activeProjectiles[i];

          const targetEnemy = enemiesRef.current.find((e) => e.id === p.targetEnemyId);
          if (targetEnemy) {
            p.targetX = targetEnemy.x;
            p.targetY = targetEnemy.y;
          }

          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const dist = Math.hypot(dx, dy);
          const step = p.speed * dt;

          if (dist <= step || p.progress >= 1.0) {
            if (p.towerType === 'cannon' && p.splashRadius) {
              enemiesRef.current.forEach((e) => {
                const splashDist = Math.hypot(e.x - p.targetX, e.y - p.targetY);
                if (splashDist <= p.splashRadius!) {
                  e.hp -= p.damage;
                }
              });

              for (let exp = 0; exp < 18; exp++) {
                particlesRef.current.push({
                  x: p.targetX,
                  y: p.targetY,
                  vx: (Math.random() - 0.5) * 220,
                  vy: (Math.random() - 0.5) * 220,
                  color: Math.random() > 0.4 ? '#f59e0b' : '#38bdf8',
                  size: Math.random() * 7 + 3,
                  alpha: 1.0,
                  life: 0.5,
                  maxLife: 0.5
                });
              }
            } else if (targetEnemy) {
              targetEnemy.hp -= p.damage;

              if (p.slowEffect) {
                targetEnemy.slowDuration = 2.5;
                targetEnemy.slowFactor = 0.5;
              }

              for (let hp = 0; hp < 6; hp++) {
                particlesRef.current.push({
                  x: targetEnemy.x,
                  y: targetEnemy.y,
                  vx: (Math.random() - 0.5) * 90,
                  vy: (Math.random() - 0.5) * 90,
                  color: p.slowEffect ? '#06b6d4' : '#38bdf8',
                  size: Math.random() * 4 + 2,
                  alpha: 1.0,
                  life: 0.3,
                  maxLife: 0.3
                });
              }
            }

            activeProjectiles.splice(i, 1);
          } else {
            p.x += (dx / dist) * step;
            p.y += (dy / dist) * step;
            p.progress += step / Math.hypot(p.targetX - p.startX, p.targetY - p.startY);
          }
        }

        // E. CHECK DEAD ENEMIES & REWARDS
        for (let i = activeEnemies.length - 1; i >= 0; i--) {
          const e = activeEnemies[i];
          if (e.hp <= 0) {
            const newEnergy = energyRef.current + e.bounty;
            energyRef.current = newEnergy;
            setEnergy(newEnergy);

            enemiesKilledRef.current += 1;
            setEnemiesKilledCount((prev) => prev + 1);

            if (e.isBoss) {
              bossesKilledRef.current += 1;
              setBossesKilledCount((prev) => prev + 1);
            }

            for (let dp = 0; dp < 15; dp++) {
              particlesRef.current.push({
                x: e.x,
                y: e.y,
                vx: (Math.random() - 0.5) * 140,
                vy: (Math.random() - 0.5) * 140,
                color: e.color,
                size: Math.random() * 5 + 2,
                alpha: 1.0,
                life: 0.6,
                maxLife: 0.6
              });
            }

            activeEnemies.splice(i, 1);
          }
        }

        // F. CHECK WAVE COMPLETION
        if (
          !waveSpawningRef.current.active &&
          waveSpawningRef.current.queue.length === 0 &&
          enemiesRef.current.length === 0
        ) {
          const nextWave = currentWaveRef.current + 1;
          triggerNextWaveCountdown(nextWave);
        }
      }

      // G. UPDATE PARTICLES
      const activeParticles = particlesRef.current;
      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const pt = activeParticles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        pt.alpha = Math.max(0, pt.life / pt.maxLife);

        if (pt.life <= 0) {
          activeParticles.splice(i, 1);
        }
      }

      // 2. RENDERING CANVAS SCENE
      ctx.save();

      if (screenShakeRef.current > 0) {
        const shake = screenShakeRef.current;
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
        screenShakeRef.current = Math.max(0, screenShakeRef.current - dt * 40);
      }

      // Background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(10, 10, width - 20, height - 20);

      // Draw Path Line
      ctx.beginPath();
      WAYPOINTS.forEach((pt, idx) => {
        const px = pt.x * width;
        const py = pt.y * height;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 42;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      ctx.beginPath();
      WAYPOINTS.forEach((pt, idx) => {
        const px = pt.x * width;
        const py = pt.y * height;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 32;
      ctx.stroke();

      ctx.beginPath();
      WAYPOINTS.forEach((pt, idx) => {
        const px = pt.x * width;
        const py = pt.y * height;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Spawn Point
      const spawnPt = WAYPOINTS[0];
      const spX = spawnPt.x * width;
      const spY = spawnPt.y * height;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(spX, spY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SPAWN', spX, spY - 18);

      // Fortress Gate
      const fortPt = WAYPOINTS[WAYPOINTS.length - 1];
      const ftX = fortPt.x * width;
      const ftY = fortPt.y * height;

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(ftX, ftY, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      const glowGrad = ctx.createRadialGradient(ftX, ftY, 5, ftX, ftY, 35);
      glowGrad.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
      glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(ftX, ftY, 35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TWIERDZA MaG', ftX, ftY - 5);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`❤️ ${fortressHpRef.current} HP`, ftX, ftY + 10);

      // Draw ALL 10 Build Spots (Interactive & High contrast)
      buildSpotsRef.current.forEach((spot) => {
        const sx = spot.normX * width;
        const sy = spot.normY * height;

        if (!spot.tower) {
          // Empty Slot Foundation
          ctx.fillStyle = selectedSpotId === spot.id ? '#334155' : '#1e293b';
          ctx.beginPath();
          ctx.arc(sx, sy, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = selectedSpotId === spot.id ? '#f59e0b' : '#38bdf8';
          ctx.lineWidth = selectedSpotId === spot.id ? 3.5 : 2;
          ctx.stroke();

          // Plus Symbol
          ctx.fillStyle = selectedSpotId === spot.id ? '#f59e0b' : '#38bdf8';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('+', sx, sy);
        } else {
          // Built Tower
          const tower = spot.tower;
          tower.x = sx;
          tower.y = sy;

          const spec = TOWER_SPECS[tower.type];
          const tierInfo = getTowerTier(tower.level);

          // Tower Range Circle preview if selected
          if (selectedTower?.id === tower.id || selectedSpotId === spot.id) {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
            ctx.beginPath();
            ctx.arc(sx, sy, tower.range, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Base Pedestal
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(sx, sy, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = tierInfo.color;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Level Glow Ring
          if (tower.level >= 3) {
            ctx.strokeStyle = tierInfo.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(sx, sy, 28, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Cannon barrel orientation
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(tower.angle);

          ctx.fillStyle = tierInfo.color;
          ctx.fillRect(0, -4, 18 + tower.level * 1.5, 8);

          ctx.restore();

          // Tower Icon Letter
          ctx.fillStyle = '#ffffff';
          ctx.font = 'black 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const labelLetter = tower.type[0].toUpperCase();
          ctx.fillText(labelLetter, sx, sy - 1);

          // Level Badge Badge
          ctx.fillStyle = tierInfo.color;
          ctx.beginPath();
          ctx.arc(sx + 16, sy - 16, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(`L${tower.level}`, sx + 16, sy - 16);
        }
      });

      // Draw Enemies
      enemiesRef.current.forEach((enemy) => {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);

        if (enemy.slowDuration > 0) {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.beginPath();
          ctx.arc(0, 0, enemy.size + 6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
        ctx.fill();

        if (enemy.isBoss) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3.5;
          ctx.stroke();
        } else {
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // HP Bar
        const hpPercent = enemy.hp / enemy.maxHp;
        const barW = Math.max(22, enemy.size * 2);
        const barH = 4;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(-barW / 2, -enemy.size - 10, barW, barH);

        ctx.fillStyle = hpPercent > 0.5 ? '#10b981' : hpPercent > 0.25 ? '#f59e0b' : '#ef4444';
        ctx.fillRect(-barW / 2, -enemy.size - 10, barW * hpPercent, barH);

        ctx.restore();
      });

      // Draw Projectiles
      projectilesRef.current.forEach((p) => {
        ctx.fillStyle = p.towerType === 'cannon' ? '#f59e0b' : p.towerType === 'frost' ? '#06b6d4' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.towerType === 'cannon' ? 6 : 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Particles
      particlesRef.current.forEach((pt) => {
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      ctx.restore();

      if (isGameRunningRef.current) {
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      isGameRunningRef.current = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, isPaused, gameSpeed, selectedSpotId, selectedTower]);

  // Touch Target Canvas Click Handler (Minimum 48x48px hit area)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const width = canvas.width;
    const height = canvas.height;

    let clickedSpot: BuildSpot | null = null;
    let minSpotDist = 45; // Generous 90px diameter hit box

    buildSpotsRef.current.forEach((spot) => {
      const sx = spot.normX * width;
      const sy = spot.normY * height;
      const dist = Math.hypot(clickX - sx, clickY - sy);
      if (dist <= minSpotDist) {
        minSpotDist = dist;
        clickedSpot = spot;
      }
    });

    if (clickedSpot) {
      if ((clickedSpot as BuildSpot).tower) {
        setSelectedTower((clickedSpot as BuildSpot).tower!);
        setSelectedSpotId((clickedSpot as BuildSpot).id);
      } else {
        setSelectedTower(null);
        setSelectedSpotId((clickedSpot as BuildSpot).id);
      }
    } else {
      setSelectedSpotId(null);
      setSelectedTower(null);
    }
  };

  // Build Tower Action
  const handleBuildTower = (type: TowerType) => {
    if (selectedSpotId === null) return;
    const spec = TOWER_SPECS[type];

    if (energy < spec.cost) return;

    const newEnergy = energy - spec.cost;
    setEnergy(newEnergy);
    energyRef.current = newEnergy;

    const canvas = canvasRef.current;
    const width = canvas?.width || 900;
    const height = canvas?.height || 650;

    const spot = buildSpotsRef.current.find((s) => s.id === selectedSpotId);
    if (!spot) return;

    const newTower: TowerData = {
      id: `t_${Date.now()}`,
      type,
      spotId: selectedSpotId,
      x: spot.normX * width,
      y: spot.normY * height,
      level: 1,
      damage: spec.damage,
      range: spec.range,
      attackSpeed: spec.attackSpeed,
      lastFired: 0,
      angle: 0,
      kills: 0,
      totalDamageDealt: 0
    };

    spot.tower = newTower;
    setSelectedTower(newTower);
  };

  // Upgrade Tower Action (Up to Level 10)
  const handleUpgradeTower = () => {
    if (!selectedTower) return;
    if (selectedTower.level >= 10) return;

    const upgradeCost = getUpgradeCost(selectedTower.type, selectedTower.level);
    if (energy < upgradeCost) return;

    const newEnergy = energy - upgradeCost;
    setEnergy(newEnergy);
    energyRef.current = newEnergy;

    selectedTower.level += 1;
    selectedTower.damage = Math.floor(selectedTower.damage * 1.45);
    selectedTower.range = Math.floor(selectedTower.range * 1.1);
    selectedTower.attackSpeed = Number((selectedTower.attackSpeed * 0.9).toFixed(2));

    setSelectedTower({ ...selectedTower });
  };

  // Sell Tower Action
  const handleSellTower = () => {
    if (!selectedTower) return;

    const refund = getSellRefund(selectedTower.type, selectedTower.level);
    const newEnergy = energy + refund;
    setEnergy(newEnergy);
    energyRef.current = newEnergy;

    const spot = buildSpotsRef.current.find((s) => s.id === selectedTower.spotId);
    if (spot) {
      spot.tower = undefined;
    }

    setSelectedTower(null);
    setSelectedSpotId(null);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col overflow-hidden select-none">
      
      {/* 1. TOP MINIMAL HUD BAR */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 z-30 backdrop-blur-md">
        
        {/* Left Stats: HP & ENERGY */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBackToCatalog}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Powrót do Katalogu Gier"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Fortress HP */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
            <span className="text-xs font-black font-mono text-rose-300">{fortressHp} HP</span>
          </div>

          {/* Energy Currency */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="text-xs font-black font-mono text-amber-300">{energy} ⚡</span>
          </div>
        </div>

        {/* Center: Wave Indicator */}
        <div className="flex items-center gap-2 bg-slate-950/90 px-3 py-1 rounded-2xl border border-amber-500/30">
          <Flame className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black text-white font-mono uppercase tracking-wider">
            FALA {currentWaveIdx} (ENDLESS)
          </span>
        </div>

        {/* Right Controls: Speed, Pause, Ranking, Rules */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setGameSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1))}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono font-black text-xs border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>x{gameSpeed}</span>
          </button>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
            title="Ranking"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowRulesModal(true)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            title="Zasady Gry"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MILESTONE BANNER TOAST */}
      {milestoneBanner && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-amber-500 text-black px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 animate-in slide-in-from-top-2 duration-200 pointer-events-none">
          {milestoneBanner}
        </div>
      )}

      {/* 2. MAIN BATTLEFIELD CANVAS CONTAINER */}
      <div className="relative flex-1 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={900}
          height={650}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain cursor-crosshair touch-none"
        />

        {/* WAVE COUNTDOWN / ANNOUNCER OVERLAY */}
        {gameState === 'wave_countdown' && waveAnnouncement && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-none">
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-amber-500/50 text-center space-y-3 shadow-2xl max-w-sm mx-4">
              <span className="text-xs font-black uppercase text-amber-400 tracking-widest">
                PRZYGOTUJ SIĘ!
              </span>
              <h2 className="text-xl font-black text-white">{waveAnnouncement}</h2>
              <div className="text-5xl font-black text-amber-400 font-mono animate-bounce">
                {countdownNum}
              </div>
            </div>
          </div>
        )}

        {/* BUILD POPOVER OVERLAY */}
        {selectedSpotId !== null && !selectedTower && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-950/95 border border-amber-500/50 rounded-3xl p-4 shadow-2xl max-w-md w-[92%] backdrop-blur-md space-y-3 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                WYBIERZ KONSTRUKCJĘ OBRONNĄ
              </span>
              <button
                onClick={() => setSelectedSpotId(null)}
                className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Towers Selector Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(TOWER_SPECS) as TowerType[]).map((type) => {
                const spec = TOWER_SPECS[type];
                const canAfford = energy >= spec.cost;

                return (
                  <button
                    key={type}
                    disabled={!canAfford}
                    onClick={() => handleBuildTower(type)}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-slate-900/90 border-slate-700 hover:border-amber-400 hover:scale-102 active:scale-98'
                        : 'bg-slate-950/60 border-slate-900 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-white">{spec.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{spec.desc}</div>
                    </div>

                    <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-400">KOSZT:</span>
                      <span className={`text-xs font-black font-mono ${canAfford ? 'text-amber-300' : 'text-rose-400'}`}>
                        {spec.cost} ⚡
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TOWER INSPECTOR & UPGRADE POPOVER */}
        {selectedTower && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-950/95 border border-cyan-500/50 rounded-3xl p-4 shadow-2xl max-w-md w-[92%] backdrop-blur-md space-y-3 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-white uppercase">
                    {TOWER_SPECS[selectedTower.type].name}
                  </h4>
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
                    style={{
                      backgroundColor: `${getTowerTier(selectedTower.level).color}25`,
                      color: getTowerTier(selectedTower.level).color,
                      border: `1px solid ${getTowerTier(selectedTower.level).color}50`
                    }}
                  >
                    {getTowerTier(selectedTower.level).tier} (LVL {selectedTower.level}/10)
                  </span>
                </div>
                <p className="text-[10px] text-cyan-300 mt-0.5">
                  Obrażenia: {selectedTower.damage} • Zasięg: {selectedTower.range} • Szybkość: {selectedTower.attackSpeed}s
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTower(null);
                  setSelectedSpotId(null);
                }}
                className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Upgrade Button */}
              {selectedTower.level < 10 ? (
                <button
                  disabled={energy < getUpgradeCost(selectedTower.type, selectedTower.level)}
                  onClick={handleUpgradeTower}
                  className={`p-2.5 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    energy >= getUpgradeCost(selectedTower.type, selectedTower.level)
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black shadow-lg shadow-amber-500/20 hover:scale-102'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <ChevronUp className="w-4 h-4 stroke-[3]" />
                  <span>ULEPSZ ({getUpgradeCost(selectedTower.type, selectedTower.level)} ⚡)</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs text-center flex items-center justify-center">
                  LEGENDARNA (LVL 10 MAX)
                </div>
              )}

              {/* Sell Button */}
              <button
                onClick={handleSellTower}
                className="p-2.5 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-black text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>SPRZEDAJ (+{getSellRefund(selectedTower.type, selectedTower.level)} ⚡)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. END GAME MODAL WHEN TWIERDZA HP = 0 */}
      {gameState === 'defeat' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-slate-950 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-center text-slate-100">
            
            {/* Header Icon */}
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-xl border border-rose-500/40 bg-gradient-to-tr from-rose-900 via-slate-900 to-rose-950 text-rose-400">
              <Skull className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-wide">
                TWIERDZA UPADŁA
              </h2>
              <p className="text-xs text-amber-300 font-bold uppercase mt-1">
                DOTARŁEŚ DO FALI {currentWaveIdx}
              </p>
              {isNewBestRecord && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider animate-bounce shadow-lg shadow-amber-400/30">
                  🎉 NOWY REKORD!
                </span>
              )}
            </div>

            {/* Summary Stats Grid */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Pokonani Wrodzy:</span>
                <span className="text-sm font-black text-white font-mono">{enemiesKilledCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Pokonani Bossowie:</span>
                <span className="text-sm font-black text-amber-400 font-mono">{bossesKilledCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Czas Czas Walki:</span>
                <span className="text-sm font-black text-cyan-300 font-mono">
                  {Math.floor(matchDurationSec / 60)}m {matchDurationSec % 60}s
                </span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400 block font-extrabold uppercase">WYNIK KOŃCOWY:</span>
                <span className="text-base font-black text-amber-300 font-mono">{finalScore.toLocaleString('pl-PL')}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={startNewGame}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                ZAGRAJ PONOWNIE
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-black text-xs uppercase transition-all cursor-pointer"
                >
                  RANKING
                </button>
                <button
                  onClick={onBackToCatalog}
                  className="py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-black text-xs uppercase transition-all cursor-pointer"
                >
                  KATALOG GIER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RULES / INSTRUCTIONS MODAL */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                ZASADY MaG FROST DEFENSE
              </h3>
              <button onClick={() => setShowRulesModal(false)} className="p-1 rounded-full bg-slate-900 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>• <strong>Endless Survival:</strong> Gra nie ma końca! Broń Twierdzy tak długo, jak zdołasz powstrzymać narastające hordy.</p>
              <p>• <strong>Bossowie co 10 fal:</strong> Mierz się z gigantycznymi bossami (Frost Titan, Ice Behemoth, Raider King...)!</p>
              <p>• <strong>10 Poziomów Wież:</strong> Rozwijaj swoje wieże od poziomu Basic aż do Legendary (LVL 10).</p>
              <p>• <strong>Energia (⚡):</strong> Każdy zniszczony wróg generuje energię do rozbudowy bastionu.</p>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white"
            >
              ROZUMIEM
            </button>
          </div>
        </div>
      )}

      {/* LEADERBOARD MODAL */}
      {showLeaderboard && (
        <FrostDefenseLeaderboard
          currentUser={profile}
          usersList={usersList}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
};
