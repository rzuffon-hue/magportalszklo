import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, X, Clock, Flame, Zap, Grid, Snowflake } from 'lucide-react';
import { UserProfile } from '../../types';

export interface SnowBlocksScoreRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  avatar?: string;
  score: number;
  maxLevel: number;
  linesCleared: number;
  bestCombo: number;
  timestamp: string;
}

interface SnowBlocksLeaderboardProps {
  currentUser: UserProfile;
  usersList: UserProfile[];
  onClose: () => void;
}

export const SnowBlocksLeaderboard: React.FC<SnowBlocksLeaderboardProps> = ({
  currentUser,
  usersList,
  onClose
}) => {
  const [records, setRecords] = useState<SnowBlocksScoreRecord[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('mag_snow_blocks_leaderboard');
    let loaded: SnowBlocksScoreRecord[] = [];
    if (raw) {
      try {
        loaded = JSON.parse(raw);
      } catch {
        loaded = [];
      }
    }

    // Default seeded top records from real users list if none present
    if (loaded.length === 0 && usersList.length > 0) {
      const initialSeed: SnowBlocksScoreRecord[] = usersList.slice(0, 5).map((u, idx) => ({
        id: `seed_${u.id}`,
        userId: u.id,
        userName: u.name,
        userRole: u.role,
        avatar: u.avatar,
        score: 184520 - idx * 22000,
        maxLevel: 17 - idx * 2,
        linesCleared: 92 - idx * 12,
        bestCombo: 7 - idx,
        timestamp: new Date().toLocaleDateString('pl-PL')
      }));
      loaded = initialSeed;
      localStorage.setItem('mag_snow_blocks_leaderboard', JSON.stringify(initialSeed));
    }

    // Sort descending by score
    loaded.sort((a, b) => b.score - a.score);
    setRecords(loaded);
  }, [usersList]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
              <Snowflake className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                RANKING MaG SNOW BLOCKS
              </h3>
              <p className="text-xs text-cyan-300 font-bold uppercase tracking-wider">
                Mistrzowie Lodowych Klocków
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
              Brak rozegranych meczów w rankingu. Zagraj i zostań liderem!
            </div>
          ) : (
            records.map((rec, idx) => {
              const isCurrent = rec.userId === currentUser.id;

              return (
                <div
                  key={rec.id || idx}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-cyan-950/70 border-cyan-400/80 ring-2 ring-cyan-400/30'
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
                        <span className="flex items-center gap-1 text-cyan-300 font-mono font-bold">
                          LEVEL {rec.maxLevel}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          {rec.linesCleared} Linii
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-amber-300">
                          COMBO x{rec.bestCombo}
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
          Wskazówka: Czyszczenie 4 linii naraz (FROST BREAK) i wysokie COMBO dają najwięcej punktów.
        </div>
      </div>
    </div>
  );
};
