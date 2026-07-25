import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, X, Shield, Clock, Flame, Swords, Skull } from 'lucide-react';
import { UserProfile } from '../../types';

export interface FrostDefenseScoreRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  avatar?: string;
  score: number;
  maxWave: number;
  remainingHp: number;
  enemiesKilled: number;
  bossesKilled: number;
  durationSec: number;
  timestamp: string;
}

interface FrostDefenseLeaderboardProps {
  currentUser: UserProfile;
  usersList: UserProfile[];
  onClose: () => void;
}

export const FrostDefenseLeaderboard: React.FC<FrostDefenseLeaderboardProps> = ({
  currentUser,
  usersList,
  onClose
}) => {
  const [records, setRecords] = useState<FrostDefenseScoreRecord[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('mag_frost_defense_leaderboard');
    let loaded: FrostDefenseScoreRecord[] = [];
    if (raw) {
      try {
        loaded = JSON.parse(raw);
      } catch {
        loaded = [];
      }
    }

    // Default seeded top records from real users list if none present
    if (loaded.length === 0 && usersList.length > 0) {
      const initialSeed: FrostDefenseScoreRecord[] = usersList.slice(0, 5).map((u, idx) => ({
        id: `seed_${u.id}`,
        userId: u.id,
        userName: u.name,
        userRole: u.role,
        avatar: u.avatar,
        score: 184250 - idx * 24000,
        maxWave: 58 - idx * 7,
        remainingHp: 0,
        enemiesKilled: 940 - idx * 120,
        bossesKilled: 5 - idx,
        durationSec: 1120 - idx * 140,
        timestamp: new Date().toLocaleDateString('pl-PL')
      }));
      loaded = initialSeed;
      localStorage.setItem('mag_frost_defense_leaderboard', JSON.stringify(initialSeed));
    }

    // Primary sort: maxWave descending, then score descending
    loaded.sort((a, b) => {
      if (b.maxWave !== a.maxWave) {
        return b.maxWave - a.maxWave;
      }
      return b.score - a.score;
    });

    setRecords(loaded);
  }, [usersList]);

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-950 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/10">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                RANKING ENDLESS FROST DEFENSE
              </h3>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                Najwyższa Osiągnięta Fala
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 app-scroll-container">
          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-bold">
              Brak rozegranych meczów w rankingu. Zagraj i ustanów swój rekord!
            </div>
          ) : (
            records.map((rec, idx) => {
              const isCurrent = rec.userId === currentUser.id;

              return (
                <div
                  key={rec.id || idx}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-amber-950/70 border-amber-400/80 ring-2 ring-amber-400/30'
                      : idx === 0
                      ? 'bg-amber-950/60 border-amber-500/60'
                      : idx === 1
                      ? 'bg-slate-900/90 border-slate-400/50'
                      : idx === 2
                      ? 'bg-amber-950/30 border-amber-800/40'
                      : 'bg-slate-900/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                          : idx === 1
                          ? 'bg-slate-300 text-black'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      #{idx + 1}
                    </div>

                    {/* User Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">
                          {rec.userName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 text-amber-300 font-mono font-bold">
                          <Flame className="w-3 h-3 text-amber-400" /> FALA {rec.maxWave}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Skull className="w-3 h-3 text-rose-400" /> {rec.enemiesKilled} wrogów
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-cyan-400" /> {formatTime(rec.durationSec)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-amber-300 font-mono tracking-tight">
                      {rec.score.toLocaleString('pl-PL')}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">
                      PKT WYNIKU
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-[10px] text-slate-400">
          Wskazówka: W klasyfikacji liczy się najwyższa ukończona Fala, a przy remisie punktacja wynikowa.
        </div>
      </div>
    </div>
  );
};
