import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types';
import { Trophy, Plus, Calendar, Users, Play, ShieldAlert, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

export interface TournamentMatch {
  id: string;
  roundIndex: number; // 0 = QF, 1 = SF, 2 = Final
  matchIndex: number;
  player1Id?: string;
  player1Name?: string;
  player1Avatar?: string;
  player2Id?: string;
  player2Name?: string;
  player2Avatar?: string;
  p1Score?: number;
  p2Score?: number;
  winnerId?: string;
  status: 'pending' | 'active' | 'finished';
}

export interface DicePokerTournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  maxParticipants: 4 | 8 | 16 | 32;
  registeredUserIds: string[];
  status: 'registration' | 'active' | 'finished';
  createdByUserId: string;
  createdByName: string;
  createdAt: string;
  bracketMatches: TournamentMatch[];
  winnerUserId?: string;
  winnerName?: string;
}

interface DicePokerTournamentsProps {
  currentUser: UserProfile;
  usersList: UserProfile[];
  tournaments: DicePokerTournament[];
  onCreateTournament: (tourney: Omit<DicePokerTournament, 'id' | 'createdAt' | 'registeredUserIds' | 'status' | 'bracketMatches'>) => void;
  onRegisterToggle: (tournamentId: string) => void;
  onStartMatch: (tournamentId: string, match: TournamentMatch) => void;
}

export const DicePokerTournaments: React.FC<DicePokerTournamentsProps> = ({
  currentUser,
  usersList,
  tournaments,
  onCreateTournament,
  onRegisterToggle,
  onStartMatch,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<DicePokerTournament | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-07-28 19:00');
  const [maxParticipants, setMaxParticipants] = useState<4 | 8 | 16 | 32>(8);

  const canCreate = currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR';

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateTournament({
      name,
      description,
      startDate,
      maxParticipants,
      createdByUserId: currentUser.id,
      createdByName: currentUser.name,
    });

    setName('');
    setDescription('');
    setShowCreateModal(false);
  };

  const getUser = (userId?: string) => usersList.find((u) => u.id === userId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-cyan-950/60 border border-purple-500/40 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white font-serif tracking-wide">OFFICIAL TURNIEJE MaG</h3>
            <p className="text-xs text-slate-400">Puchary Sojuszu – Mecze turniejowe nie wpływają na ELO</p>
          </div>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            STWÓRZ TURNIEJ
          </button>
        )}
      </div>

      {/* Selected Tournament Detail View / Bracket */}
      {selectedTournament ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedTournament(null)}
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            ← Powrót do listy turniejów
          </button>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    STATUS: {selectedTournament.status === 'registration' ? 'REJESTRACJA' : selectedTournament.status === 'active' ? 'W TRAKCIE' : 'ZAKOŃCZONY'}
                  </span>
                  <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
                    BEZ ZMIAN ELO
                  </span>
                </div>
                <h2 className="text-lg font-black text-white mt-1">{selectedTournament.name}</h2>
                <p className="text-xs text-slate-300 mt-0.5">{selectedTournament.description}</p>
              </div>

              <div className="text-right font-mono text-xs text-slate-400 space-y-1">
                <div>Start: <strong className="text-slate-200">{selectedTournament.startDate}</strong></div>
                <div>Uczestnicy: <strong className="text-cyan-300">{selectedTournament.registeredUserIds.length}/{selectedTournament.maxParticipants}</strong></div>
              </div>
            </div>

            {/* Registration CTA if in registration status */}
            {selectedTournament.status === 'registration' && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Zapisani: {selectedTournament.registeredUserIds.length} z {selectedTournament.maxParticipants} graczy
                </div>

                <button
                  onClick={() => onRegisterToggle(selectedTournament.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    selectedTournament.registeredUserIds.includes(currentUser.id)
                      ? 'bg-rose-950 border border-rose-500/80 text-rose-300 hover:bg-rose-900'
                      : selectedTournament.registeredUserIds.length >= selectedTournament.maxParticipants
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                  }`}
                  disabled={
                    !selectedTournament.registeredUserIds.includes(currentUser.id) &&
                    selectedTournament.registeredUserIds.length >= selectedTournament.maxParticipants
                  }
                >
                  {selectedTournament.registeredUserIds.includes(currentUser.id)
                    ? 'ANULUJ ZAPIS'
                    : selectedTournament.registeredUserIds.length >= selectedTournament.maxParticipants
                    ? 'BRAK MIEJSC'
                    : 'ZAPISZ SIĘ DO TURNIEJU'}
                </button>
              </div>
            )}

            {/* BRACKET VIEW (Horizontal scroll on mobile) */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                DRABINKA TURNIEJOWA (KNOCKOUT BRACKET)
              </h4>

              {selectedTournament.bracketMatches.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
                  Drabinka zostanie wygenerowana automatycznie po zamknięciu zapisów i wystartowaniu turnieju!
                </div>
              ) : (
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                  <div className="min-w-[600px] flex items-stretch gap-6 p-2">
                    {/* Render rounds: Round 0 (QF), Round 1 (SF), Round 2 (Final) */}
                    {[0, 1, 2].map((roundIdx) => {
                      const roundMatches = selectedTournament.bracketMatches.filter(
                        (m) => m.roundIndex === roundIdx
                      );
                      if (roundMatches.length === 0) return null;

                      const roundNames = ['ĆWIERĆFINAŁ', 'PÓŁFINAŁ', 'FINAŁ'];

                      return (
                        <div key={roundIdx} className="flex-1 space-y-3 flex flex-col justify-around min-w-[180px]">
                          <span className="text-[10px] font-black uppercase tracking-wider text-center text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 py-1 rounded-lg">
                            {roundNames[roundIdx] || `RUNDA ${roundIdx + 1}`}
                          </span>

                          {roundMatches.map((match) => {
                            const p1 = getUser(match.player1Id);
                            const p2 = getUser(match.player2Id);

                            const isUserMatch =
                              (match.player1Id === currentUser.id || match.player2Id === currentUser.id) &&
                              match.status !== 'finished';

                            return (
                              <div
                                key={match.id}
                                className={`p-2.5 rounded-xl border transition-all text-xs ${
                                  isUserMatch
                                    ? 'bg-purple-950/80 border-purple-400 ring-2 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                    : match.status === 'finished'
                                    ? 'bg-slate-950/80 border-slate-800'
                                    : 'bg-slate-900/60 border-slate-800'
                                }`}
                              >
                                {/* Player 1 */}
                                <div
                                  className={`flex items-center justify-between p-1.5 rounded-lg ${
                                    match.winnerId === match.player1Id ? 'bg-emerald-950/80 text-emerald-200 font-bold' : 'text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    {p1 ? (
                                      <img src={p1.avatar} alt={p1.name} className="w-5 h-5 rounded-full object-cover" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-slate-800" />
                                    )}
                                    <span className="truncate">{p1?.name || match.player1Name || 'Oczekuje...'}</span>
                                  </div>
                                  <span className="font-mono font-bold text-xs">{match.p1Score ?? '-'}</span>
                                </div>

                                <div className="h-px bg-slate-800 my-1" />

                                {/* Player 2 */}
                                <div
                                  className={`flex items-center justify-between p-1.5 rounded-lg ${
                                    match.winnerId === match.player2Id ? 'bg-emerald-950/80 text-emerald-200 font-bold' : 'text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    {p2 ? (
                                      <img src={p2.avatar} alt={p2.name} className="w-5 h-5 rounded-full object-cover" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-slate-800" />
                                    )}
                                    <span className="truncate">{p2?.name || match.player2Name || 'Oczekuje...'}</span>
                                  </div>
                                  <span className="font-mono font-bold text-xs">{match.p2Score ?? '-'}</span>
                                </div>

                                {/* Play CTA if active for current user */}
                                {isUserMatch && match.player1Id && match.player2Id && (
                                  <button
                                    onClick={() => onStartMatch(selectedTournament.id, match)}
                                    className="mt-2 w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] flex items-center justify-center gap-1 shadow-md"
                                  >
                                    <Play className="w-3 h-3 fill-current" /> ROZEGRAJ MECZ
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Tournament Catalog List */
        <div className="space-y-3">
          {tournaments.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 max-w-md mx-auto my-6">
              <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">Brak aktywnych turniejów</p>
              <p className="text-xs text-slate-500">Moderatorzy oraz Administratorzy utworzą wkrótce nowe pucharowe rozgrywki!</p>
            </div>
          ) : (
            tournaments.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTournament(t)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-purple-500/50 transition-all cursor-pointer shadow-lg flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                        t.status === 'registration'
                          ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
                          : t.status === 'active'
                          ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {t.status === 'registration' ? 'OTWARTE ZAPISY' : t.status === 'active' ? 'W TRAKCIE' : 'ZAKOŃCZONY'}
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/30">
                      BEZ ELO
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{t.description}</p>
                </div>

                <div className="flex items-center gap-4 text-right font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">MIEJSCA</span>
                    <span className="text-cyan-300 font-bold">
                      {t.registeredUserIds.length} / {t.maxParticipants}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CREATE TOURNAMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-purple-500/40 p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" /> STWÓRZ NOWY TURNIEJ
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nazwa Turnieju</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="np. Puchar Smoczej Twierdzy #1"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Opis / Zasady</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Krótki opis nagród i wymagań turnieju..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Data i Godzina</label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Limit Graczy</label>
                  <select
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value) as 4 | 8 | 16 | 32)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                  >
                    <option value={4}>4 Graczy (2 Rundy)</option>
                    <option value={8}>8 Graczy (3 Rundy)</option>
                    <option value={16}>16 Graczy (4 Rundy)</option>
                    <option value={32}>32 Graczy (5 Rund)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200">
                ⚠️ Uwaga: Mecze turniejowe nie przydzielają i nie odejmują punktów ELO. Zwycięzca otrzyma dedykowane osiągnięcie na profilu.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30"
                >
                  OTWÓRZ ZAPISY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
