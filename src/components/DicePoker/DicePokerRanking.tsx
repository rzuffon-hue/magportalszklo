import React from 'react';
import { UserProfile } from '../../types';
import { Trophy, Award, Medal, Swords, TrendingUp, ShieldAlert } from 'lucide-react';

export interface UserDicePokerStats {
  elo: number;
  wins: number;
  losses: number;
  played: number;
  tournamentsPlayed: number;
  tournamentWins: number;
}

interface DicePokerRankingProps {
  currentUserId: string;
  usersList: UserProfile[];
  getUserStats: (userId: string) => UserDicePokerStats;
}

export const DicePokerRanking: React.FC<DicePokerRankingProps> = ({
  currentUserId,
  usersList,
  getUserStats,
}) => {
  // Map users with their stats
  const rankedUsers = usersList
    .map((user) => {
      const stats = getUserStats(user.id);
      return {
        user,
        stats,
      };
    })
    .sort((a, b) => b.stats.elo - a.stats.elo);

  const top3 = rankedUsers.slice(0, 3);
  const remaining = rankedUsers.slice(3);

  const topBadges = [
    { title: 'MISTRZ PORTALU', bg: 'from-amber-500/20 via-amber-900/40 to-slate-950', border: 'border-amber-400', text: 'text-amber-300', icon: Trophy, medalColor: 'text-amber-400' },
    { title: 'WICEMISTRZ', bg: 'from-slate-400/20 via-slate-800/40 to-slate-950', border: 'border-slate-300', text: 'text-slate-200', icon: Award, medalColor: 'text-slate-300' },
    { title: 'III MIEJSCE', bg: 'from-amber-800/20 via-orange-950/40 to-slate-950', border: 'border-amber-700/80', text: 'text-amber-500', icon: Medal, medalColor: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* Top Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-purple-950/60 border border-cyan-500/30 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white font-serif tracking-wide">OFICJALNY RANKING ELO</h3>
            <p className="text-xs text-slate-400">Liga Poker Kości Portalu MaG – Tylko pojedynki 1v1</p>
          </div>
        </div>
      </div>

      {/* TOP 3 Prestigious Cards */}
      {top3.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {top3.map((item, idx) => {
            const badge = topBadges[idx];
            const Icon = badge.icon;
            const isMe = item.user.id === currentUserId;

            return (
              <div
                key={item.user.id}
                className={`p-4 rounded-2xl bg-gradient-to-b ${badge.bg} border ${badge.border} relative overflow-hidden shadow-2xl flex flex-col justify-between space-y-4 ${
                  isMe ? 'ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]' : ''
                }`}
              >
                {/* Crown/Rank Badge Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 border border-slate-700 ${badge.text}`}>
                    #{idx + 1} {badge.title}
                  </span>
                  <Icon className={`w-5 h-5 ${badge.medalColor}`} />
                </div>

                {/* User Avatar & Name */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={item.user.avatar}
                      alt={item.user.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10"
                    />
                    {isMe && (
                      <span className="absolute -top-1 -right-1 text-[9px] font-black bg-cyan-500 text-black px-1.5 py-0.2 rounded-full uppercase">
                        TY
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1">
                      {item.user.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {item.user.alliance ? `[${item.user.alliance}]` : 'Sojusz MaG'}
                    </p>
                  </div>
                </div>

                {/* Stats Breakdown */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800/80 grid grid-cols-3 gap-1 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">ELO</span>
                    <span className={`text-sm font-black ${badge.text}`}>{item.stats.elo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">WYGRANE</span>
                    <span className="text-sm font-black text-emerald-400">{item.stats.wins}W</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">PRZEGRANE</span>
                    <span className="text-sm font-black text-rose-400">{item.stats.losses}L</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
          Brak zarejestrowanych wyników w rankingu
        </div>
      )}

      {/* Remaining Leaderboard Table */}
      {remaining.length > 0 && (
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>POZYCJA & GRACZ</span>
            <div className="flex items-center gap-6">
              <span>W / L</span>
              <span>ELO</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/50">
            {remaining.map((item, idx) => {
              const rankNum = idx + 4;
              const isMe = item.user.id === currentUserId;

              return (
                <div
                  key={item.user.id}
                  className={`p-3.5 flex items-center justify-between transition-colors ${
                    isMe ? 'bg-cyan-950/30 border-l-4 border-l-cyan-400' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500 w-6">
                      #{rankNum}
                    </span>
                    <img
                      src={item.user.avatar}
                      alt={item.user.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        {item.user.name}
                        {isMe && (
                          <span className="text-[9px] font-black text-cyan-400 bg-cyan-950 border border-cyan-800 px-1 py-0.2 rounded">
                            TY
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Mecze: {item.stats.played}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs">
                    <span className="text-slate-300">
                      <strong className="text-emerald-400">{item.stats.wins}</strong> /{' '}
                      <strong className="text-rose-400">{item.stats.losses}</strong>
                    </span>
                    <span className="text-sm font-black text-cyan-300 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                      {item.stats.elo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
