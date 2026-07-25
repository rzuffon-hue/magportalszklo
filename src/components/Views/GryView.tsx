import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CompactHeader } from '../CompactHeader';
import { DicePokerHub } from '../DicePoker/DicePokerHub';
import { MiniWhiteoutCity } from '../MiniWhiteout/MiniWhiteoutCity';
import { RPSGameHub, RPSStats } from '../RPS/RPSGameHub';
import { FrostDefenseGame } from '../FrostDefense/FrostDefenseGame';
import { SnowBlocksGame } from '../SnowBlocks/SnowBlocksGame';
import {
  Gamepad2,
  ChevronRight,
  ArrowLeft,
  Flame,
  Dices,
  Scissors,
  Trophy,
  Users,
  Sparkles,
  Building2,
  Play,
  ShieldAlert,
  Snowflake
} from 'lucide-react';

import pokerDiceCoverImg from '../../assets/images/poker_dice_cover_1784994382551.jpg';
import miniWhiteoutCoverImg from '../../assets/images/mini_whiteout_cover_1784994435316.jpg';
import rpsCoverImg from '../../assets/images/rps_cover_1784993796107.jpg';
import frostDefenseCoverImg from '../../assets/images/frost_defense_cover_1784995065309.jpg';
import snowBlocksCoverImg from '../../assets/images/snow_blocks_cover_1784995650410.jpg';

export const GryView: React.FC = () => {
  const { profile, usersList, setProfile } = useApp();

  // Active View Mode: 'catalog' is the primary default home screen
  const [activeTabMode, setActiveTabMode] = useState<
    'catalog' | 'poker_kosci' | 'mini_whiteout' | 'rps' | 'frost_defense' | 'snow_blocks'
  >('catalog');

  // Live Tournaments State
  const [activeTournament, setActiveTournament] = useState<{
    id: string;
    name: string;
    description: string;
    registeredCount: number;
    maxParticipants: number;
    status: string;
  } | null>(null);

  // RPS Stats for badge
  const [rpsElo, setRpsElo] = useState<number>(1000);

  // Load Active Tournaments & RPS Stats
  useEffect(() => {
    // 1. Check active tournament
    const savedTournaments = localStorage.getItem('mag_dice_poker_tournaments_db');
    if (savedTournaments) {
      try {
        const list = JSON.parse(savedTournaments);
        const live = list.find((t: any) => t.status === 'active' || t.status === 'registration');
        if (live) {
          setActiveTournament({
            id: live.id,
            name: live.name,
            description: live.description,
            registeredCount: live.registeredUserIds?.length || 0,
            maxParticipants: live.maxParticipants || 8,
            status: live.status
          });
        }
      } catch {
        // fallback
      }
    }

    // 2. Load RPS Elo
    const savedRps = localStorage.getItem(`mag_rps_stats_${profile.id}`);
    if (savedRps) {
      try {
        const parsed: RPSStats = JSON.parse(savedRps);
        if (parsed.elo) setRpsElo(parsed.elo);
      } catch {
        // fallback
      }
    }
  }, [profile.id]);

  const handleUpgradeCity = (nextLevel: number) => {
    setProfile((prev) => ({
      ...prev,
      cityData: {
        ...prev.cityData,
        level: nextLevel,
        stats: prev.cityData?.stats || { likesGiven: 35, commentsWritten: 15, likesReceived: 25 },
        lastUpgradedAt: new Date().toLocaleDateString('pl-PL')
      }
    }));
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* 1. TOP HEADER / BACK NAVIGATION BAR */}
      {activeTabMode === 'catalog' ? (
        <CompactHeader
          title="Gry Portalu MaG"
          badge="KATALOG GIER"
        />
      ) : (
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between backdrop-blur-md z-20 shrink-0">
          <button
            onClick={() => setActiveTabMode('catalog')}
            className="flex items-center gap-2 text-xs font-black text-cyan-300 hover:text-cyan-200 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KATALOG GIER</span>
          </button>

          <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wide">
            {activeTabMode === 'poker_kosci'
              ? 'POKER KOŚCI 🎲'
              : activeTabMode === 'mini_whiteout'
              ? 'MINI WHITEOUT 🏰'
              : activeTabMode === 'rps'
              ? 'KAMIEŃ PAPIER NOŻYCE ✂️'
              : activeTabMode === 'frost_defense'
              ? 'MaG FROST DEFENSE ❄️'
              : 'MaG SNOW BLOCKS 🧩'}
          </span>
        </div>
      )}

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* VIEW 1: CATALOG OF GAMES */}
        {activeTabMode === 'catalog' && (
          <div className="h-full app-scroll-container p-3.5 sm:p-5 max-w-2xl mx-auto w-full space-y-4">
            
            {/* LIVE TOURNAMENT BANNER (Rendered ONLY if an active/open tournament exists) */}
            {activeTournament && (
              <div
                onClick={() => setActiveTabMode('poker_kosci')}
                className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-950 border border-amber-500/50 p-4 shadow-2xl cursor-pointer group active:scale-[0.98] transition-all duration-150"
              >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping absolute top-0 left-0" />
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 block relative shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                          ● TURNIEJ TRWA
                        </span>
                        <span className="text-xs font-black text-amber-300">
                          {activeTournament.name}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-200 mt-1">
                        {activeTournament.description || `${activeTournament.registeredCount}/${activeTournament.maxParticipants} graczy w szrankach`}
                      </p>
                    </div>
                  </div>

                  <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-lg shadow-amber-500/20 group-hover:translate-x-1 transition-transform">
                    <span>ZOBACZ</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}

            {/* VERTICAL CATALOG OF GAME CARDS */}
            <div className="space-y-4 pb-12">
              
              {/* CARD 1: POKER KOŚCI */}
              <div
                onClick={() => setActiveTabMode('poker_kosci')}
                className="relative w-full aspect-[16/8] sm:aspect-[16/7.5] min-h-[160px] sm:min-h-[185px] rounded-3xl overflow-hidden border border-slate-800/90 hover:border-cyan-400/80 shadow-2xl cursor-pointer group active:scale-[0.98] transition-all duration-200 flex flex-col justify-end p-4 sm:p-5 select-none"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${pokerDiceCoverImg})` }}
                />

                {/* Dark Gradient Overlay for perfect readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Top Status Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                  <span className="text-[10px] font-black text-cyan-300 bg-slate-950/90 border border-cyan-500/40 px-2.5 py-1 rounded-full uppercase tracking-wide backdrop-blur-md">
                    ● DOSTĘPNY MATCHMAKING 1v1
                  </span>
                  <div className="p-1.5 rounded-full bg-slate-950/80 text-amber-400 border border-slate-700">
                    <Dices className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Card Title & Action Button Overlay */}
                <div className="relative z-10 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                      POKER KOŚCI
                    </h2>
                    <p className="text-xs font-bold text-slate-300 mt-0.5">
                      PvP • ELO • Turnieje
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 group-hover:translate-x-1 transition-all">
                    <span>GRAJ</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* CARD 2: MINI WHITEOUT */}
              <div
                onClick={() => setActiveTabMode('mini_whiteout')}
                className="relative w-full aspect-[16/8] sm:aspect-[16/7.5] min-h-[160px] sm:min-h-[185px] rounded-3xl overflow-hidden border border-slate-800/90 hover:border-amber-400/80 shadow-2xl cursor-pointer group active:scale-[0.98] transition-all duration-200 flex flex-col justify-end p-4 sm:p-5 select-none"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${miniWhiteoutCoverImg})` }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Top Status Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                  <span className="text-[10px] font-black text-amber-300 bg-slate-950/90 border border-amber-500/40 px-2.5 py-1 rounded-full uppercase tracking-wide backdrop-blur-md flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                    PIEC LVL {profile.cityData?.level || 1}
                  </span>
                  <div className="p-1.5 rounded-full bg-slate-950/80 text-cyan-300 border border-slate-700">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Card Title & Action Button Overlay */}
                <div className="relative z-10 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                      MINI WHITEOUT
                    </h2>
                    <p className="text-xs font-bold text-slate-300 mt-0.5">
                      Buduj swoją osadę
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 group-hover:from-amber-400 group-hover:to-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 group-hover:translate-x-1 transition-all">
                    <span>GRAJ</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* CARD 3: KAMIEŃ • PAPIER • NOŻYCE */}
              <div
                onClick={() => setActiveTabMode('rps')}
                className="relative w-full aspect-[16/8] sm:aspect-[16/7.5] min-h-[160px] sm:min-h-[185px] rounded-3xl overflow-hidden border border-slate-800/90 hover:border-rose-400/80 shadow-2xl cursor-pointer group active:scale-[0.98] transition-all duration-200 flex flex-col justify-end p-4 sm:p-5 select-none"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${rpsCoverImg})` }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Top Status Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                  <span className="text-[10px] font-black text-rose-300 bg-slate-950/90 border border-rose-500/40 px-2.5 py-1 rounded-full uppercase tracking-wide backdrop-blur-md">
                    RPS ELO: {rpsElo}
                  </span>
                  <div className="p-1.5 rounded-full bg-slate-950/80 text-rose-400 border border-slate-700">
                    <Scissors className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Card Title & Action Button Overlay */}
                <div className="relative z-10 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                      KAMIEŃ • PAPIER • NOŻYCE
                    </h2>
                    <p className="text-xs font-bold text-slate-300 mt-0.5">
                      PvP • ELO • Ranking
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 group-hover:from-rose-400 group-hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-rose-500/20 group-hover:translate-x-1 transition-all">
                    <span>GRAJ</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* CARD 4: MaG FROST DEFENSE */}
              <div
                onClick={() => setActiveTabMode('frost_defense')}
                className="relative w-full aspect-[16/8] sm:aspect-[16/7.5] min-h-[160px] sm:min-h-[185px] rounded-3xl overflow-hidden border border-slate-800/90 hover:border-amber-400/80 shadow-2xl cursor-pointer group active:scale-[0.98] transition-all duration-200 flex flex-col justify-end p-4 sm:p-5 select-none"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${frostDefenseCoverImg})` }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Top Status Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                  <span className="text-[10px] font-black text-amber-300 bg-slate-950/90 border border-amber-500/40 px-2.5 py-1 rounded-full uppercase tracking-wide backdrop-blur-md flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    ENDLESS SURVIVAL
                  </span>
                  <div className="p-1.5 rounded-full bg-slate-950/80 text-amber-400 border border-slate-700">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Card Title & Action Button Overlay */}
                <div className="relative z-10 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                      MaG FROST DEFENSE
                    </h2>
                    <p className="text-xs font-bold text-slate-300 mt-0.5">
                      Endless Wave • Tower Defense
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 group-hover:from-amber-400 group-hover:to-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 group-hover:translate-x-1 transition-all">
                    <span>GRAJ</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* CARD 5: MaG SNOW BLOCKS */}
              <div
                onClick={() => setActiveTabMode('snow_blocks')}
                className="relative w-full aspect-[16/8] sm:aspect-[16/7.5] min-h-[160px] sm:min-h-[185px] rounded-3xl overflow-hidden border border-slate-800/90 hover:border-cyan-400/80 shadow-2xl cursor-pointer group active:scale-[0.98] transition-all duration-200 flex flex-col justify-end p-4 sm:p-5 select-none"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${snowBlocksCoverImg})` }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Top Status Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                  <span className="text-[10px] font-black text-cyan-300 bg-slate-950/90 border border-cyan-500/40 px-2.5 py-1 rounded-full uppercase tracking-wide backdrop-blur-md flex items-center gap-1.5">
                    <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                    LODOWE KLOCKI PUZZLE
                  </span>
                  <div className="p-1.5 rounded-full bg-slate-950/80 text-cyan-400 border border-slate-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Card Title & Action Button Overlay */}
                <div className="relative z-10 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                      MaG SNOW BLOCKS
                    </h2>
                    <p className="text-xs font-bold text-slate-300 mt-0.5">
                      Układaj • Czyść linie • Bij rekordy
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 group-hover:from-cyan-400 group-hover:to-sky-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 group-hover:translate-x-1 transition-all">
                    <span>GRAJ</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: POKER KOŚCI HUB */}
        {activeTabMode === 'poker_kosci' && (
          <DicePokerHub
            currentUser={profile}
            usersList={usersList}
            onBackToHub={() => setActiveTabMode('catalog')}
          />
        )}

        {/* VIEW 3: MINI WHITEOUT CITY */}
        {activeTabMode === 'mini_whiteout' && (
          <div className="h-full app-scroll-container p-3 sm:p-5 max-w-5xl mx-auto w-full space-y-4">
            <MiniWhiteoutCity
              cityName={`OSADA ${profile.name.toUpperCase()}`}
              ownerName={profile.name}
              ownerRole={profile.role}
              cityLevel={profile.cityData?.level || 1}
              onUpgrade={handleUpgradeCity}
            />
          </div>
        )}

        {/* VIEW 4: KAMIEŃ PAPIER NOŻYCE HUB */}
        {activeTabMode === 'rps' && (
          <RPSGameHub />
        )}

        {/* VIEW 5: MaG FROST DEFENSE */}
        {activeTabMode === 'frost_defense' && (
          <FrostDefenseGame onBackToCatalog={() => setActiveTabMode('catalog')} />
        )}

        {/* VIEW 6: MaG SNOW BLOCKS */}
        {activeTabMode === 'snow_blocks' && (
          <SnowBlocksGame onBackToCatalog={() => setActiveTabMode('catalog')} />
        )}

      </div>
    </div>
  );
};
