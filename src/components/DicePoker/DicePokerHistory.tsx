import React from 'react';
import { History, Swords, ShieldCheck, Award } from 'lucide-react';

export interface DicePokerHistoryRecord {
  id: string;
  opponentId: string;
  opponentName: string;
  opponentAvatar: string;
  p1Score: number;
  p2Score: number;
  isWin: boolean;
  isTie?: boolean;
  ranked: boolean; // CRITICAL: true = ELO changed, false = Tournament (no ELO change)
  eloChange: number; // e.g. +18 or -12
  newElo: number;
  timestamp: string;
  tournamentName?: string;
}

interface DicePokerHistoryProps {
  history: DicePokerHistoryRecord[];
}

export const DicePokerHistory: React.FC<DicePokerHistoryProps> = ({ history }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-10">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-950 border border-purple-500/30 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white font-serif tracking-wide">HISTORIA ROZEGRANYCH MECZÓW</h3>
            <p className="text-xs text-slate-400">Rejestr wyników i zmian punktacji ELO</p>
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 max-w-md mx-auto my-6">
          <Swords className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Brak historii pojedynków</p>
          <p className="text-xs text-slate-500">Zagraj swój pierwszy mecz w trybie 1v1 lub w turnieju!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => (
            <div
              key={record.id}
              className={`p-4 rounded-2xl border transition-all shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                record.isWin
                  ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900/90 to-slate-950 border-emerald-500/40 hover:border-emerald-400/70'
                  : record.isTie
                  ? 'bg-slate-900/80 border-slate-700'
                  : 'bg-gradient-to-r from-rose-950/30 via-slate-900/90 to-slate-950 border-rose-500/40 hover:border-rose-400/70'
              }`}
            >
              {/* Opponent Info */}
              <div className="flex items-center gap-3">
                <img
                  src={record.opponentAvatar}
                  alt={record.opponentName}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">vs {record.opponentName}</h4>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        record.ranked
                          ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                          : 'bg-purple-950/80 border-purple-500/40 text-purple-300'
                      }`}
                    >
                      {record.ranked ? 'MECZ 1v1' : `TURNIEJ ${record.tournamentName ? `(${record.tournamentName})` : ''}`}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{record.timestamp}</span>
                </div>
              </div>

              {/* Score & Result */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <div className="text-center sm:text-right">
                  <span
                    className={`text-xs font-black uppercase tracking-wider block ${
                      record.isWin
                        ? 'text-emerald-400'
                        : record.isTie
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {record.isWin ? 'ZWYCIĘSTWO' : record.isTie ? 'REMIS' : 'PORAŻKA'}
                  </span>
                  <span className="text-sm font-black font-mono text-white">
                    {record.p1Score} : {record.p2Score}
                  </span>
                </div>

                {/* ELO Delta Tag */}
                <div className="text-right font-mono min-w-[110px]">
                  {record.ranked ? (
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-xl border block text-center ${
                        record.eloChange > 0
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : record.eloChange < 0
                          ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {record.eloChange > 0 ? `+${record.eloChange}` : record.eloChange} ELO
                      <span className="text-[9px] text-slate-400 block font-normal">
                        ({record.newElo})
                      </span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 block text-center">
                      TURNIEJ
                      <span className="text-[8px] text-purple-200/80 block font-normal">
                        ELO BEZ ZMIAN
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
