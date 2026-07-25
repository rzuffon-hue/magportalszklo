import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import {
  Swords,
  Trophy,
  Users,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Gamepad2,
  RotateCcw,
  UserPlus
} from 'lucide-react';
import rpsCoverImg from '../../assets/images/rps_cover_1784993796107.jpg';

export type RPSChoice = 'rock' | 'paper' | 'scissors';

export interface RPSStats {
  elo: number;
  wins: number;
  losses: number;
  draws: number;
}

export const RPSGameHub: React.FC = () => {
  const { profile, usersList } = useApp();

  // Active Tab Mode: DUEL_ARENA | MATCHMAKING | LEADERBOARD
  const [activeTab, setActiveTab] = useState<'arena' | 'matchmaking' | 'leaderboard'>('arena');

  // Player RPS Stats
  const [myStats, setMyStats] = useState<RPSStats>({
    elo: 1000,
    wins: 0,
    losses: 0,
    draws: 0
  });

  // Opponent for active match
  const [opponent, setOpponent] = useState<{
    id: string;
    name: string;
    avatar: string;
    elo: number;
    isBot: boolean;
  }>({
    id: 'bot_rzaba',
    name: 'Rzaba (MaG AI)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    elo: 1050,
    isBot: true
  });

  // Match State
  const [playerWins, setPlayerWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);
  const [mySelection, setMySelection] = useState<RPSChoice | null>(null);
  const [opponentSelection, setOpponentSelection] = useState<RPSChoice | null>(null);
  const [hasConfirmedSelection, setHasConfirmedSelection] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [roundResultText, setRoundResultText] = useState<string | null>(null);
  const [matchWinner, setMatchWinner] = useState<'player' | 'opponent' | null>(null);
  const [eloDelta, setEloDelta] = useState<number>(0);

  // Invite state
  const [selectedUserToInvite, setSelectedUserToInvite] = useState<UserProfile | null>(null);

  // Load RPS Stats
  useEffect(() => {
    const saved = localStorage.getItem(`mag_rps_stats_${profile.id}`);
    if (saved) {
      try {
        setMyStats(JSON.parse(saved));
      } catch {
        // default
      }
    }
  }, [profile.id]);

  // Save RPS Stats
  const saveStats = (newStats: RPSStats) => {
    setMyStats(newStats);
    localStorage.setItem(`mag_rps_stats_${profile.id}`, JSON.stringify(newStats));
  };

  // Start new match
  const handleStartNewMatch = (oppUser?: UserProfile) => {
    if (oppUser) {
      const oppStats = getRPSStatsForUser(oppUser.id);
      setOpponent({
        id: oppUser.id,
        name: oppUser.name,
        avatar: oppUser.avatar,
        elo: oppStats.elo,
        isBot: false
      });
    } else {
      // Default Bot Opponent
      setOpponent({
        id: 'bot_rzaba',
        name: 'Rzaba (MaG AI)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        elo: 1050,
        isBot: true
      });
    }

    setPlayerWins(0);
    setOpponentWins(0);
    setMySelection(null);
    setOpponentSelection(null);
    setHasConfirmedSelection(false);
    setIsRevealing(false);
    setCountdown(null);
    setRoundResultText(null);
    setMatchWinner(null);
    setActiveTab('arena');
  };

  // Helper to read user RPS stats from local storage
  const getRPSStatsForUser = (userId: string): RPSStats => {
    const saved = localStorage.getItem(`mag_rps_stats_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { elo: 1000, wins: 0, losses: 0, draws: 0 };
      }
    }
    return { elo: 1000, wins: 0, losses: 0, draws: 0 };
  };

  // Lock in player selection
  const handleSelectChoice = (choice: RPSChoice) => {
    if (hasConfirmedSelection || isRevealing || matchWinner) return;
    setMySelection(choice);
  };

  // Confirm selection and trigger opponent AI/Player turn -> Countdown -> Reveal
  const handleConfirmTurn = () => {
    if (!mySelection || hasConfirmedSelection || matchWinner) return;

    setHasConfirmedSelection(true);

    // Generate opponent choice secretly
    const choices: RPSChoice[] = ['rock', 'paper', 'scissors'];
    const oppPick = choices[Math.floor(Math.random() * choices.length)];
    setOpponentSelection(oppPick);

    // Start 3... 2... 1... Countdown
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          triggerReveal(mySelection, oppPick);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 750);
  };

  // Trigger clash reveal
  const triggerReveal = (pChoice: RPSChoice, oChoice: RPSChoice) => {
    setIsRevealing(true);

    // Determine round winner
    let rWinner: 'player' | 'opponent' | 'draw' = 'draw';

    if (pChoice === oChoice) {
      rWinner = 'draw';
    } else if (
      (pChoice === 'rock' && oChoice === 'scissors') ||
      (pChoice === 'paper' && oChoice === 'rock') ||
      (pChoice === 'scissors' && oChoice === 'paper')
    ) {
      rWinner = 'player';
    } else {
      rWinner = 'opponent';
    }

    if (rWinner === 'player') {
      const nextP = playerWins + 1;
      setPlayerWins(nextP);
      setRoundResultText('WYGRAŁEŚ RUNDĘ! 🎉');

      if (nextP >= 2) {
        // BO3 Match Win!
        finalizeMatch('player');
      }
    } else if (rWinner === 'opponent') {
      const nextO = opponentWins + 1;
      setOpponentWins(nextO);
      setRoundResultText(`${opponent.name.toUpperCase()} WYGRAŁ RUNDĘ!`);

      if (nextO >= 2) {
        // BO3 Match Loss!
        finalizeMatch('opponent');
      }
    } else {
      setRoundResultText('REMIS W RUNDZIE! 🤝');
    }
  };

  // Next Round setup
  const handleNextRound = () => {
    setMySelection(null);
    setOpponentSelection(null);
    setHasConfirmedSelection(false);
    setIsRevealing(false);
    setRoundResultText(null);
  };

  // Finalize BO3 Match and Update Elo
  const finalizeMatch = (winner: 'player' | 'opponent') => {
    setMatchWinner(winner);

    const delta = winner === 'player' ? Math.floor(Math.random() * 8) + 18 : -(Math.floor(Math.random() * 6) + 12);
    setEloDelta(delta);

    const updatedStats: RPSStats = {
      ...myStats,
      elo: Math.max(100, myStats.elo + delta),
      wins: winner === 'player' ? myStats.wins + 1 : myStats.wins,
      losses: winner === 'opponent' ? myStats.losses + 1 : myStats.losses
    };

    saveStats(updatedStats);
  };

  // Leaderboard sorted users
  const leaderboardUsers = usersList.map((u) => {
    const st = getRPSStatsForUser(u.id);
    return {
      user: u,
      stats: st
    };
  }).sort((a, b) => b.stats.elo - a.stats.elo);

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Cover Header Banner */}
      <div className="relative w-full h-36 sm:h-44 shrink-0 overflow-hidden border-b border-slate-800">
        <img
          src={rpsCoverImg}
          alt="Rock Paper Scissors Arena"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                PVP ARENA • BO3 • ELO RANKING
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                KAMIEŃ • PAPIER • NOŻYCE
              </h1>
            </div>

            {/* My ELO Badge */}
            <div className="bg-slate-900/90 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[9px] text-slate-400 font-bold block">TWÓJ RPS ELO</span>
                <span className="text-sm font-black text-amber-300 font-mono">{myStats.elo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('arena')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'arena'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Swords className="w-4 h-4" />
            ARENA POJEDYNKU
          </button>

          <button
            onClick={() => setActiveTab('matchmaking')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'matchmaking'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            MATCHMAKING & ZAPROSZENIA
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            RANKING RPS ELO
          </button>
        </div>
      </div>

      {/* TAB 1: ARENA POJEDYNKU */}
      {activeTab === 'arena' && (
        <div className="flex-1 app-scroll-container p-4 sm:p-6 max-w-4xl mx-auto w-full flex flex-col justify-between space-y-6">
          
          {/* Header Scoreboard */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 flex items-center justify-between gap-4 shadow-xl">
            
            {/* Player Info */}
            <div className="flex items-center gap-3">
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-cyan-400/80"
              />
              <div>
                <span className="text-xs font-black text-white block">{profile.name} (TY)</span>
                <span className="text-[10px] text-amber-300 font-mono block">{myStats.elo} ELO</span>
              </div>
            </div>

            {/* Score BO3 Center */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MECZ BO3</span>
              <div className="flex items-center gap-3 my-1">
                <span className="text-2xl font-black text-cyan-300 font-mono">{playerWins}</span>
                <span className="text-slate-600 font-black">:</span>
                <span className="text-2xl font-black text-rose-400 font-mono">{opponentWins}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">Pierwszy do 2 wygranych</span>
            </div>

            {/* Opponent Info */}
            <div className="flex items-center gap-3 text-right">
              <div>
                <span className="text-xs font-black text-white block">{opponent.name}</span>
                <span className="text-[10px] text-amber-300 font-mono block">{opponent.elo} ELO</span>
              </div>
              <img
                src={opponent.avatar}
                alt={opponent.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-rose-500/80"
              />
            </div>
          </div>

          {/* CLASH BATTLEFIELD */}
          <div className="relative min-h-[200px] bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 animate-in fade-in">
                <span className="text-6xl font-black text-amber-400 animate-bounce font-mono">{countdown}</span>
                <span className="text-xs font-bold text-slate-300 mt-2">STARCIE ZA CHWILĘ...</span>
              </div>
            )}

            {/* Duel Arena Hands */}
            <div className="w-full flex items-center justify-around gap-4">
              
              {/* Player Side Hand / Choice */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-xs font-extrabold text-cyan-300">TWÓJ WYBÓR</span>
                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-2 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl transition-all ${
                  mySelection ? 'bg-cyan-950/80 border-cyan-400 shadow-cyan-500/20' : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {!mySelection ? '❓' : isRevealing ? (
                    mySelection === 'rock' ? '🪨' : mySelection === 'paper' ? '📄' : '✂️'
                  ) : hasConfirmedSelection ? '🔒' : (
                    mySelection === 'rock' ? '🪨' : mySelection === 'paper' ? '📄' : '✂️'
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {!mySelection ? 'Wybierz poniżej' : hasConfirmedSelection && !isRevealing ? 'Zatwierdzono' : mySelection.toUpperCase()}
                </span>
              </div>

              <div className="text-xl font-black text-slate-600 font-serif">VS</div>

              {/* Opponent Side Hand / Choice */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-xs font-extrabold text-rose-300">{opponent.name.toUpperCase()}</span>
                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-2 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl transition-all ${
                  hasConfirmedSelection ? 'bg-rose-950/80 border-rose-500 shadow-rose-500/20' : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {!hasConfirmedSelection ? '❓' : !isRevealing ? '🔒' : (
                    opponentSelection === 'rock' ? '🪨' : opponentSelection === 'paper' ? '📄' : '✂️'
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {!hasConfirmedSelection ? 'Oczekiwanie...' : !isRevealing ? 'Gotowy' : opponentSelection?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Round Result Banner */}
            {roundResultText && !matchWinner && (
              <div className="mt-6 flex flex-col items-center space-y-2 animate-in fade-in zoom-in-95">
                <div className="px-5 py-2 rounded-2xl bg-slate-900 border border-amber-500/50 text-amber-300 font-black text-sm shadow-xl">
                  {roundResultText}
                </div>
                <button
                  onClick={handleNextRound}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md cursor-pointer transition-all"
                >
                  NASTĘPNA RUNDA ➔
                </button>
              </div>
            )}
          </div>

          {/* CHOICE SELECTION CONTROLS */}
          {!matchWinner && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { id: 'rock' as RPSChoice, label: 'KAMIEŃ', icon: '🪨', color: 'border-amber-500/60 bg-amber-950/20 hover:bg-amber-900/40 text-amber-300' },
                  { id: 'paper' as RPSChoice, label: 'PAPIER', icon: '📄', color: 'border-cyan-500/60 bg-cyan-950/20 hover:bg-cyan-900/40 text-cyan-300' },
                  { id: 'scissors' as RPSChoice, label: 'NOŻYCE', icon: '✂️', color: 'border-rose-500/60 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300' },
                ].map((item) => (
                  <button
                    key={item.id}
                    disabled={hasConfirmedSelection || isRevealing}
                    onClick={() => handleSelectChoice(item.id)}
                    className={`p-4 sm:p-5 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      mySelection === item.id
                        ? 'ring-4 ring-amber-400 border-amber-400 scale-105 bg-amber-500/20'
                        : item.color
                    } ${hasConfirmedSelection ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-3xl sm:text-4xl">{item.icon}</span>
                    <span className="text-xs font-black">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Confirm Turn Button */}
              {mySelection && !hasConfirmedSelection && (
                <button
                  onClick={handleConfirmTurn}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  ZATWIERDŹ WYBÓR I ZAGRAJ RUNDĘ ➔
                </button>
              )}
            </div>
          )}

          {/* END OF MATCH MODAL */}
          {matchWinner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
              <div className="relative w-full max-w-md bg-slate-950 border border-amber-500/50 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
                <div className="p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 w-16 h-16 mx-auto flex items-center justify-center">
                  <Trophy className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                    {matchWinner === 'player' ? 'ZWYCIĘSTWO!' : 'PRZEGRANA!'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Koniec pojedynku BO3 przeciwko <strong className="text-slate-200">{opponent.name}</strong>.
                  </p>
                </div>

                {/* ELO Changes */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">{profile.name}</span>
                    <span className="text-xs text-amber-300 font-mono font-bold">{myStats.elo} ELO</span>
                  </div>
                  <span className={`text-base font-black font-mono ${eloDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {eloDelta >= 0 ? `+${eloDelta}` : eloDelta} ELO
                  </span>
                </div>

                <button
                  onClick={() => handleStartNewMatch()}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  ZAGRAJ PONOWNIE ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MATCHMAKING & ZAPROSZENIA */}
      {activeTab === 'matchmaking' && (
        <div className="flex-1 app-scroll-container p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Szybki Matchmaking i Wyzwanie Gracza
            </h3>
            <p className="text-xs text-slate-400">
              Wybierz przeciwnika z zarejestrowanych użytkowników Portalu MaG lub zagraj sparing przeciwko AI.
            </p>

            <button
              onClick={() => handleStartNewMatch()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              SZYBKA GRA PRZECIWKO BOT RZABA (AI)
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Zarejestrowani Użytkownicy Portalu ({usersList.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {usersList.map((u) => {
                const uStats = getRPSStatsForUser(u.id);

                return (
                  <div
                    key={u.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">{u.name}</span>
                        <span className="text-[10px] text-amber-300 font-mono block">{uStats.elo} ELO</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartNewMatch(u)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      WYZWIJ
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEADERBOARD RANKING RPS ELO */}
      {activeTab === 'leaderboard' && (
        <div className="flex-1 app-scroll-container p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Oficjalny Ranking RPS Elo
            </h3>
            <span className="text-xs text-slate-400 font-medium">Tylko prawdziwi gracze</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800/80">
              {leaderboardUsers.map((item, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;

                return (
                  <div
                    key={item.user.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black font-mono shrink-0 ${
                          rank === 1
                            ? 'bg-amber-400 text-black shadow-md'
                            : rank === 2
                            ? 'bg-slate-300 text-black'
                            : rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{rank}
                      </span>

                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                      />

                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{item.user.name}</span>
                        <span className="text-[10px] text-slate-400 block">{item.user.role}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-amber-300 font-mono block">
                        {item.stats.elo} ELO
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {item.stats.wins} W / {item.stats.losses} L
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
