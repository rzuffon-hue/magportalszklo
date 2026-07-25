import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { DicePokerRanking, UserDicePokerStats } from './DicePokerRanking';
import { DicePokerTournaments, DicePokerTournament, TournamentMatch } from './DicePokerTournaments';
import { DicePokerHistory, DicePokerHistoryRecord } from './DicePokerHistory';
import { DicePokerTable } from './DicePokerTable';
import { Swords, Trophy, History, Users, Dices, RotateCw, X, Play, ShieldAlert, Award, Sparkles, ArrowLeft } from 'lucide-react';

interface DicePokerHubProps {
  currentUser: UserProfile;
  usersList: UserProfile[];
  onBackToHub?: () => void;
}

export const DicePokerHub: React.FC<DicePokerHubProps> = ({
  currentUser,
  usersList,
  onBackToHub,
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'matchmaking' | 'vs' | 'playing' | 'tournaments' | 'ranking' | 'history'>('main');

  // Matchmaking State
  const [searchTimeSeconds, setSearchTimeSeconds] = useState(0);
  const [opponent, setOpponent] = useState<UserProfile | null>(null);
  const [isMatchRanked, setIsMatchRanked] = useState<boolean>(true);
  const [activeTournamentName, setActiveTournamentName] = useState<string | undefined>(undefined);

  // Stats State
  const [userStats, setUserStats] = useState<UserDicePokerStats>({
    elo: 1000,
    wins: 0,
    losses: 0,
    played: 0,
    tournamentsPlayed: 0,
    tournamentWins: 0,
  });

  // History State
  const [historyList, setHistoryList] = useState<DicePokerHistoryRecord[]>([]);

  // Tournaments State
  const [tournamentsList, setTournamentsList] = useState<DicePokerTournament[]>([]);

  // Load persistence for user stats, history, and tournaments
  useEffect(() => {
    // 1. Load Stats
    const savedStats = localStorage.getItem(`mag_dice_poker_stats_${currentUser.id}`);
    if (savedStats) {
      try {
        setUserStats(JSON.parse(savedStats));
      } catch {
        // fallback
      }
    }

    // 2. Load History
    const savedHistory = localStorage.getItem(`mag_dice_poker_history_${currentUser.id}`);
    if (savedHistory) {
      try {
        setHistoryList(JSON.parse(savedHistory));
      } catch {
        // fallback
      }
    }

    // 3. Load Tournaments
    const savedTourneys = localStorage.getItem('mag_dice_poker_tournaments_db');
    if (savedTourneys) {
      try {
        setTournamentsList(JSON.parse(savedTourneys));
      } catch {
        // fallback
      }
    }
  }, [currentUser.id]);

  // Timer for Matchmaking Queue
  useEffect(() => {
    let timer: any;
    if (activeTab === 'matchmaking') {
      setSearchTimeSeconds(0);
      timer = setInterval(() => {
        setSearchTimeSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab]);

  // Helper to fetch any user's stats
  const getUserStats = (userId: string): UserDicePokerStats => {
    if (userId === currentUser.id) return userStats;
    const saved = localStorage.getItem(`mag_dice_poker_stats_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { elo: 1000, wins: 0, losses: 0, played: 0, tournamentsPlayed: 0, tournamentWins: 0 };
  };

  // Compute Global Rank
  const sortedAll = usersList
    .map((u) => ({ id: u.id, elo: getUserStats(u.id).elo }))
    .sort((a, b) => b.elo - a.elo);
  const globalRank = sortedAll.findIndex((u) => u.id === currentUser.id) + 1;

  // Start Matchmaking Queue
  const handleStartMatchmaking = () => {
    setActiveTab('matchmaking');
  };

  // Cancel Matchmaking Queue
  const handleCancelMatchmaking = () => {
    setActiveTab('main');
  };

  // Pair up with an opponent
  const handleFoundOpponent = (opUser: UserProfile, isRankedMatch: boolean = true, tourneyTitle?: string) => {
    setOpponent(opUser);
    setIsMatchRanked(isRankedMatch);
    setActiveTournamentName(tourneyTitle);
    setActiveTab('vs');

    // VS Screen transition to table
    setTimeout(() => {
      setActiveTab('playing');
    }, 2800);
  };

  // Finish Match Handler
  const handleFinishMatch = (
    winnerId: string,
    p1Wins: number,
    p2Wins: number,
    eloChangeP1: number,
    ranked: boolean
  ) => {
    if (!opponent) return;

    const isWin = winnerId === currentUser.id;
    const isTie = winnerId === 'tie';
    const newElo = userStats.elo + (ranked ? eloChangeP1 : 0);

    // 1. Update Current User Stats
    const updatedStats: UserDicePokerStats = {
      ...userStats,
      elo: newElo,
      wins: userStats.wins + (isWin ? 1 : 0),
      losses: userStats.losses + (!isWin && !isTie ? 1 : 0),
      played: userStats.played + 1,
    };
    setUserStats(updatedStats);
    localStorage.setItem(`mag_dice_poker_stats_${currentUser.id}`, JSON.stringify(updatedStats));

    // 2. Record Match History
    const newRecord: DicePokerHistoryRecord = {
      id: `m_${Date.now()}`,
      opponentId: opponent.id,
      opponentName: opponent.name,
      opponentAvatar: opponent.avatar,
      p1Score: p1Wins,
      p2Score: p2Wins,
      isWin,
      isTie,
      ranked,
      eloChange: ranked ? eloChangeP1 : 0,
      newElo,
      timestamp: new Date().toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      tournamentName: activeTournamentName,
    };

    const updatedHistory = [newRecord, ...historyList];
    setHistoryList(updatedHistory);
    localStorage.setItem(`mag_dice_poker_history_${currentUser.id}`, JSON.stringify(updatedHistory));
  };

  // Tournaments Handlers
  const handleCreateTournament = (data: Omit<DicePokerTournament, 'id' | 'createdAt' | 'registeredUserIds' | 'status' | 'bracketMatches'>) => {
    const newT: DicePokerTournament = {
      ...data,
      id: `tourney_${Date.now()}`,
      createdAt: new Date().toISOString(),
      registeredUserIds: [currentUser.id],
      status: 'registration',
      bracketMatches: [],
    };

    const updated = [newT, ...tournamentsList];
    setTournamentsList(updated);
    localStorage.setItem('mag_dice_poker_tournaments_db', JSON.stringify(updated));
  };

  const handleRegisterToggle = (tourneyId: string) => {
    const updated = tournamentsList.map((t) => {
      if (t.id === tourneyId) {
        const isReg = t.registeredUserIds.includes(currentUser.id);
        const newIds = isReg
          ? t.registeredUserIds.filter((id) => id !== currentUser.id)
          : [...t.registeredUserIds, currentUser.id];
        return { ...t, registeredUserIds: newIds };
      }
      return t;
    });
    setTournamentsList(updated);
    localStorage.setItem('mag_dice_poker_tournaments_db', JSON.stringify(updated));
  };

  const handleStartTournamentMatch = (tourneyId: string, match: TournamentMatch) => {
    const opId = match.player1Id === currentUser.id ? match.player2Id : match.player1Id;
    const opUser = usersList.find((u) => u.id === opId) || {
      id: 'op_tourney',
      name: match.player1Id === currentUser.id ? match.player2Name || 'Przeciwnik' : match.player1Name || 'Przeciwnik',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: 'USER',
      accountStatus: 'active',
      level: 1,
      xp: 0,
      maxXp: 100,
      title: 'Gracz Turniejowy',
      status: 'online',
      bio: '',
      badges: [],
      stats: { postsCount: 0, friendsCount: 0, eventsAttended: 0, gamesPlayed: 0 },
    };

    // Launch tournament match with ranked = false
    handleFoundOpponent(opUser, false, 'Turniej MaG');
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* 1. PLAYING VIEW */}
      {activeTab === 'playing' && opponent && (
        <DicePokerTable
          currentUser={currentUser}
          p2User={opponent}
          ranked={isMatchRanked}
          tournamentName={activeTournamentName}
          onFinishMatch={handleFinishMatch}
          onLeaveMatch={() => {
            setActiveTab('main');
            setOpponent(null);
          }}
        />
      )}

      {/* 2. MATCHMAKING VS TRANSITION SCREEN */}
      {activeTab === 'vs' && opponent && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
              ZNALEZIONO PRZECIWNIKA!
            </span>
            <h2 className="text-2xl font-black font-serif text-white">POJEDYNEK 1v1</h2>
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-12 w-full max-w-lg">
            {/* Player 1 */}
            <div className="text-center space-y-2 animate-in slide-in-from-left-10 duration-500">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] mx-auto"
              />
              <h3 className="text-sm sm:text-base font-bold text-white">{currentUser.name}</h3>
              <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                {userStats.elo} ELO
              </span>
            </div>

            {/* VS Emblem */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-xl italic shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse">
              VS
            </div>

            {/* Player 2 */}
            <div className="text-center space-y-2 animate-in slide-in-from-right-10 duration-500">
              <img
                src={opponent.avatar}
                alt={opponent.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.6)] mx-auto"
              />
              <h3 className="text-sm sm:text-base font-bold text-white">{opponent.name}</h3>
              <span className="text-xs font-mono font-bold text-purple-300 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                {getUserStats(opponent.id).elo} ELO
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono animate-bounce">
            Wchodzenie do strefy gry...
          </div>
        </div>
      )}

      {/* 3. MATCHMAKING WAITING SCREEN */}
      {activeTab === 'matchmaking' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 space-y-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Pulse Radar Rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/40 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-purple-500/30 animate-pulse" />
            
            {/* Player Avatar */}
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-cyan-400 z-10"
            />
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-white font-serif tracking-wide">
              SZUKAMY PRZECIWNIKA 1v1...
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Czas oczekiwania: <strong className="text-cyan-300">{searchTimeSeconds}s</strong>
            </p>
          </div>

          {/* Available Registered Users Quick Launch Option */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 max-w-sm w-full text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              REJESTROWANI GRACZE W PORTALU
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {usersList
                .filter((u) => u.id !== currentUser.id)
                .slice(0, 3)
                .map((registeredUser) => (
                  <button
                    key={registeredUser.id}
                    onClick={() => handleFoundOpponent(registeredUser, true)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 flex items-center gap-2 transition-all"
                  >
                    <img src={registeredUser.avatar} alt={registeredUser.name} className="w-6 h-6 rounded-lg object-cover" />
                    <span className="text-xs font-bold text-white">{registeredUser.name}</span>
                  </button>
                ))}
            </div>
          </div>

          <button
            onClick={handleCancelMatchmaking}
            className="px-6 py-2.5 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <X className="w-4 h-4" />
            ANULUJ POSZUKIWANIE
          </button>
        </div>
      )}

      {/* 4. MAIN HUB / SUB-TABS VIEW */}
      {activeTab !== 'playing' && activeTab !== 'vs' && activeTab !== 'matchmaking' && (
        <div className="flex-1 app-scroll-container p-3 sm:p-5 max-w-4xl mx-auto w-full space-y-5">
          {/* Top Bar Navigation */}
          {activeTab !== 'main' && (
            <button
              onClick={() => setActiveTab('main')}
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Powrót do Hubu Pokera Kości
            </button>
          )}

          {/* PLAYER CARD HEADER */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900/90 via-purple-950/40 to-slate-950 border border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                />
                <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-black px-2 py-0.5 rounded-full border border-amber-300 shadow">
                  #{globalRank}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">{currentUser.name}</h2>
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded-full">
                    POKER KOŚCI
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-1 font-mono text-xs">
                  <span className="text-amber-400 font-extrabold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> {userStats.elo} ELO
                  </span>
                  <span className="text-slate-400">
                    Mecze: <strong className="text-white">{userStats.played}</strong> ({userStats.wins}W / {userStats.losses}L)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Header Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('ranking')}
                className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'ranking'
                    ? 'bg-cyan-500 text-black border-cyan-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Trophy className="w-4 h-4" /> Ranking
              </button>
              <button
                onClick={() => setActiveTab('tournaments')}
                className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'tournaments'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Award className="w-4 h-4" /> Turnieje
              </button>
            </div>
          </div>

          {/* MAIN MENU TAB */}
          {activeTab === 'main' && (
            <div className="space-y-4">
              {/* BIG PROMINENT CTA: SZUKAJ PRZECIWNIKA */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/80 via-slate-900/90 to-purple-950/80 border border-cyan-400/80 shadow-[0_15px_40px_rgba(6,182,212,0.2)] text-center space-y-4 relative overflow-hidden group">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
                  <Swords className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black font-serif text-white tracking-wide">
                    SZUKAJ PRZECIWNIKA 1v1
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Znajdź rywala w lidze rankingowej Portalu MaG. Rozgrywka Best of 5 na punkty ELO.
                  </p>
                </div>

                <button
                  onClick={handleStartMatchmaking}
                  className="w-full max-w-md py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/30 ring-2 ring-cyan-300/50 hover:scale-102 active:scale-98"
                >
                  SZUKAJ PRZECIWNIKA
                </button>
              </div>

              {/* 3 SECONDARY HUB OPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. TURNIEJE */}
                <div
                  onClick={() => setActiveTab('tournaments')}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer shadow-lg space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    TURNIEJE
                  </h4>
                  <p className="text-xs text-slate-400">
                    Oficjalne puchary i drabinki knockout bez zmian ELO.
                  </p>
                </div>

                {/* 2. RANKING */}
                <div
                  onClick={() => setActiveTab('ranking')}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer shadow-lg space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    RANKING
                  </h4>
                  <p className="text-xs text-slate-400">
                    Tabela liderów ELO portalu. Sprawdź czołówkę graczy.
                  </p>
                </div>

                {/* 3. HISTORIA */}
                <div
                  onClick={() => setActiveTab('history')}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer shadow-lg space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                    <History className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    HISTORIA
                  </h4>
                  <p className="text-xs text-slate-400">
                    Przebieg ostatnich pojedynków i statystyki gier.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* RANKING TAB */}
          {activeTab === 'ranking' && (
            <DicePokerRanking
              currentUserId={currentUser.id}
              usersList={usersList}
              getUserStats={getUserStats}
            />
          )}

          {/* TOURNAMENTS TAB */}
          {activeTab === 'tournaments' && (
            <DicePokerTournaments
              currentUser={currentUser}
              usersList={usersList}
              tournaments={tournamentsList}
              onCreateTournament={handleCreateTournament}
              onRegisterToggle={handleRegisterToggle}
              onStartMatch={handleStartTournamentMatch}
            />
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <DicePokerHistory history={historyList} />
          )}
        </div>
      )}
    </div>
  );
};
