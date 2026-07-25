import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { Dice3D } from './Dice3D';
import { evaluateDiceHand, compareDiceHands, calculateEloChange, DiceHandEvaluation } from '../../services/dicePokerService';
import { Swords, RotateCw, CheckCircle, Sparkles, Trophy, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export interface DicePokerPlayerState {
  userId: string;
  name: string;
  avatar: string;
  elo: number;
  roundWins: number;
}

interface DicePokerTableProps {
  currentUser: UserProfile;
  p2User: UserProfile;
  ranked: boolean; // CRITICAL: true for 1v1 normal matches, false for tournament matches
  tournamentName?: string;
  onFinishMatch: (winnerId: string, p1Score: number, p2Score: number, eloChangeP1: number, ranked: boolean) => void;
  onLeaveMatch: () => void;
}

export const DicePokerTable: React.FC<DicePokerTableProps> = ({
  currentUser,
  p2User,
  ranked,
  tournamentName,
  onFinishMatch,
  onLeaveMatch,
}) => {
  // Players
  const [p1, setP1] = useState<DicePokerPlayerState>({
    userId: currentUser.id,
    name: currentUser.name,
    avatar: currentUser.avatar,
    elo: 1000, // Will be set from stats
    roundWins: 0,
  });

  const [p2, setP2] = useState<DicePokerPlayerState>({
    userId: p2User.id,
    name: p2User.name,
    avatar: p2User.avatar,
    elo: 1000,
    roundWins: 0,
  });

  // Match State
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [activeTurnUserId, setActiveTurnUserId] = useState<string>(currentUser.id);
  const [rollsLeft, setRollsLeft] = useState<number>(3);
  const [rollIndex, setRollIndex] = useState<number>(0);
  const [isRollingAnimation, setIsRollingAnimation] = useState<boolean>(false);

  // Dice State
  const [dice, setDice] = useState<number[]>([1, 1, 1, 1, 1]);
  const [heldDice, setHeldDice] = useState<boolean[]>([false, false, false, false, false]);

  // Round Hand Evaluated
  const [p1RoundHand, setP1RoundHand] = useState<DiceHandEvaluation | null>(null);
  const [p2RoundHand, setP2RoundHand] = useState<DiceHandEvaluation | null>(null);

  // Round Resolution Overlay
  const [roundWinnerBanner, setRoundWinnerBanner] = useState<{
    text: string;
    subText: string;
    isTie?: boolean;
  } | null>(null);

  // Match Finished
  const [matchFinished, setMatchFinished] = useState<boolean>(false);
  const [matchResultData, setMatchResultData] = useState<{
    winnerId: string;
    eloChange: number;
    newElo: number;
    isWin: boolean;
  } | null>(null);

  // Sync initial ELO ratings from localStorage
  useEffect(() => {
    const p1Stats = localStorage.getItem(`mag_dice_poker_stats_${currentUser.id}`);
    const p2Stats = localStorage.getItem(`mag_dice_poker_stats_${p2User.id}`);

    const elo1 = p1Stats ? JSON.parse(p1Stats).elo || 1000 : 1000;
    const elo2 = p2Stats ? JSON.parse(p2Stats).elo || 1000 : 1000;

    setP1((prev) => ({ ...prev, elo: elo1 }));
    setP2((prev) => ({ ...prev, elo: elo2 }));
  }, [currentUser.id, p2User.id]);

  // Current Hand Evaluation (live during turn)
  const currentEvaluation = evaluateDiceHand(dice);

  // Roll Dice Action
  const handleRollDice = () => {
    if (rollsLeft <= 0 || isRollingAnimation) return;

    setIsRollingAnimation(true);
    setRollIndex((prev) => prev + 1);

    // Generate deterministic 5 dice backend/client roll
    const newDice = dice.map((d, idx) => {
      if (heldDice[idx]) return d; // Kept
      return Math.floor(Math.random() * 6) + 1; // New random roll
    });

    setDice(newDice);
    const newRollsLeft = rollsLeft - 1;
    setRollsLeft(newRollsLeft);

    // Wait for 3D physics animation duration
    setTimeout(() => {
      setIsRollingAnimation(false);
    }, 1300);
  };

  // Toggle Lock/Hold on die
  const handleToggleLock = (index: number) => {
    if (rollsLeft === 3 || isRollingAnimation) return; // Cannot lock before 1st roll
    setHeldDice((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  // Lock In / Finish Turn Early or when rolls depleted
  const handleLockInTurn = () => {
    if (isRollingAnimation) return;

    const finalHand = evaluateDiceHand(dice);

    if (activeTurnUserId === p1.userId) {
      setP1RoundHand(finalHand);

      // Now it is Player 2's turn in the round
      setActiveTurnUserId(p2.userId);
      setRollsLeft(3);
      setDice([1, 1, 1, 1, 1]);
      setHeldDice([false, false, false, false, false]);

      // If playing against simulated/other registered user locally, execute P2 turn automatically
      setTimeout(() => {
        executeP2Turn(finalHand);
      }, 500);
    }
  };

  // Execute P2 turn (Simulated registered user roll sequence or 2nd player)
  const executeP2Turn = (p1Hand: DiceHandEvaluation) => {
    setIsRollingAnimation(true);
    // Simulate P2 rolls
    const p2Dice1 = [1, 2, 3, 4, 5].map(() => Math.floor(Math.random() * 6) + 1);
    
    // Smart keep strategy for P2
    const p2Counts: Record<number, number> = {};
    p2Dice1.forEach(v => p2Counts[v] = (p2Counts[v] || 0) + 1);
    
    // 2nd roll
    const p2Dice2 = p2Dice1.map(v => p2Counts[v] >= 2 ? v : Math.floor(Math.random() * 6) + 1);
    // 3rd roll
    const p2Dice3 = p2Dice2.map(v => p2Counts[v] >= 2 ? v : Math.floor(Math.random() * 6) + 1);

    setTimeout(() => {
      setIsRollingAnimation(false);
      const p2FinalHand = evaluateDiceHand(p2Dice3);
      setP2RoundHand(p2FinalHand);

      // Resolve Round
      resolveRound(p1Hand, p2FinalHand);
    }, 1500);
  };

  // Resolve Round Winner
  const resolveRound = (p1Hand: DiceHandEvaluation, p2Hand: DiceHandEvaluation) => {
    const comp = compareDiceHands(p1Hand, p2Hand);

    let nextP1Wins = p1.roundWins;
    let nextP2Wins = p2.roundWins;
    let bannerText = '';
    let bannerSubText = `${p1Hand.handNamePl} vs ${p2Hand.handNamePl}`;

    if (comp > 0) {
      nextP1Wins += 1;
      setP1((prev) => ({ ...prev, roundWins: nextP1Wins }));
      bannerText = `WYGRYWASZ RUNDĘ ${currentRound}!`;
    } else if (comp < 0) {
      nextP2Wins += 1;
      setP2((prev) => ({ ...prev, roundWins: nextP2Wins }));
      bannerText = `${p2.name} WYGRYWA RUNDĘ ${currentRound}`;
    } else {
      bannerText = `REMIS W RUNDZIE ${currentRound}`;
    }

    setRoundWinnerBanner({ text: bannerText, subText: bannerSubText, isTie: comp === 0 });

    // Check if match is finished (First to 3 wins or 5 rounds complete)
    if (nextP1Wins >= 3 || nextP2Wins >= 3 || currentRound >= 5) {
      setTimeout(() => {
        setRoundWinnerBanner(null);
        finishMatch(nextP1Wins, nextP2Wins);
      }, 2500);
    } else {
      // Advance to next round
      setTimeout(() => {
        setRoundWinnerBanner(null);
        setCurrentRound((prev) => prev + 1);
        setActiveTurnUserId(p1.userId);
        setRollsLeft(3);
        setDice([1, 1, 1, 1, 1]);
        setHeldDice([false, false, false, false, false]);
        setP1RoundHand(null);
        setP2RoundHand(null);
      }, 2500);
    }
  };

  // Finish Match & Calculate ELO
  const finishMatch = (finalP1Wins: number, finalP2Wins: number) => {
    setMatchFinished(true);
    const isWin = finalP1Wins > finalP2Wins;
    const isTie = finalP1Wins === finalP2Wins;
    const winnerId = isWin ? p1.userId : isTie ? 'tie' : p2.userId;

    let eloChange = 0;
    let newElo = p1.elo;

    // CRITICAL MANDATE:
    // Tournaments MUST NOT alter ELO! (ranked === false -> eloChange = 0)
    if (ranked) {
      const scoreA = isWin ? 1 : isTie ? 0.5 : 0;
      const { changeA } = calculateEloChange(p1.elo, p2.elo, scoreA);
      eloChange = changeA;
      newElo = p1.elo + eloChange;
    }

    setMatchResultData({
      winnerId,
      eloChange,
      newElo,
      isWin,
    });

    // Notify parent to update storage atomically
    onFinishMatch(winnerId, finalP1Wins, finalP2Wins, eloChange, ranked);
  };

  return (
    <div className="h-full w-full flex flex-col justify-between bg-slate-950 text-slate-100 overflow-hidden relative select-none">
      {/* Background Obsidian Glass Glow Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/80 via-slate-950 to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HUD: Players & Score */}
      <div className="relative z-10 p-3 sm:p-4 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-2xl flex items-center justify-between shadow-xl">
        {/* Player 1 (Me) */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={p1.avatar}
              alt={p1.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            />
            <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-cyan-500 text-black px-1.5 py-0.2 rounded-full uppercase">
              TY
            </span>
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px] sm:max-w-[140px]">
              {p1.name}
            </h4>
            <span className="text-[10px] font-mono font-extrabold text-cyan-300 block">
              {p1.elo} ELO
            </span>
          </div>
        </div>

        {/* Match HUD Center Score */}
        <div className="text-center font-mono">
          <div className="text-[10px] uppercase tracking-widest font-black text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full inline-block mb-1 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            RUNDA {currentRound}/5
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-wider text-white flex items-center justify-center gap-2">
            <span className="text-cyan-400">{p1.roundWins}</span>
            <span className="text-slate-600">:</span>
            <span className="text-purple-400">{p2.roundWins}</span>
          </div>
          {tournamentName && (
            <span className="text-[9px] text-purple-300 block mt-0.5 truncate max-w-[120px]">
              {tournamentName}
            </span>
          )}
        </div>

        {/* Player 2 (Opponent) */}
        <div className="flex items-center gap-2.5 text-right">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px] sm:max-w-[140px]">
              {p2.name}
            </h4>
            <span className="text-[10px] font-mono font-extrabold text-purple-300 block">
              {p2.elo} ELO
            </span>
          </div>
          <img
            src={p2.avatar}
            alt={p2.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover ring-2 ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          />
        </div>
      </div>

      {/* MAIN DICE GAME TABLE AREA */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 sm:p-6 space-y-6 max-w-xl mx-auto w-full">
        {/* Turn Status Badge */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-200 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>
              {activeTurnUserId === p1.userId ? 'TWOJA TURA' : `TURA GRACZA: ${p2.name}`}
            </span>
          </div>

          <div className="text-xs font-bold font-mono text-cyan-300">
            Pozostałe rzuty: <strong className="text-amber-400 text-sm">{rollsLeft} / 3</strong>
          </div>
        </div>

        {/* Live Hand Evaluation Badge */}
        <div className="w-full max-w-md p-3 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 border border-cyan-500/40 text-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">
            AKTUALNY UKŁAD KOŚCI
          </span>
          <h3 className="text-sm sm:text-base font-black text-cyan-300 tracking-wide">
            {rollsLeft === 3 ? 'RZUĆ KOŚĆMI, ABY ROZPOCZĄĆ' : currentEvaluation.handNamePl}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{currentEvaluation.description}</p>
        </div>

        {/* 5 DICE CONTAINER (Fits on screen without scrolling on mobile) */}
        <div className="w-full p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-black/90 border border-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl relative">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 items-center justify-items-center">
            {dice.map((val, idx) => (
              <Dice3D
                key={idx}
                value={val}
                isLocked={heldDice[idx]}
                isRolling={isRollingAnimation}
                rollIndex={rollIndex}
                staggerMs={idx * 80}
                onToggleLock={() => handleToggleLock(idx)}
                disabled={rollsLeft === 3 || isRollingAnimation || activeTurnUserId !== p1.userId}
              />
            ))}
          </div>

          <p className="text-[10px] text-center text-slate-400 mt-4 font-medium">
            💡 Dotknij kości po rzucie, aby ją zablokować przed kolejnym rzutem
          </p>
        </div>

        {/* ROLL & LOCK-IN ACTION BUTTONS */}
        {activeTurnUserId === p1.userId && (
          <div className="w-full max-w-md flex gap-3">
            <button
              onClick={handleRollDice}
              disabled={rollsLeft <= 0 || isRollingAnimation}
              className={`flex-1 py-3 sm:py-3.5 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xl ${
                rollsLeft <= 0 || isRollingAnimation
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-500/30 ring-2 ring-cyan-400/50 active:scale-95'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isRollingAnimation ? 'animate-spin' : ''}`} />
              {rollsLeft === 3 ? 'PIERWSZY RZUT (5 KOŚCI)' : `RZUĆ (${rollsLeft} POZOSTAŁO)`}
            </button>

            {rollsLeft < 3 && (
              <button
                onClick={handleLockInTurn}
                disabled={isRollingAnimation}
                className="px-4 py-3 sm:py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                ZATWIERDŹ
              </button>
            )}
          </div>
        )}
      </div>

      {/* ROUND WINNER OVERLAY */}
      {roundWinnerBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-950 border border-cyan-500/50 text-center space-y-3 max-w-sm w-full shadow-[0_0_50px_rgba(6,182,212,0.4)] animate-in zoom-in-95 duration-300">
            <Flame className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-white font-serif">{roundWinnerBanner.text}</h3>
            <p className="text-xs text-cyan-300 font-mono">{roundWinnerBanner.subText}</p>
          </div>
        </div>
      )}

      {/* MATCH FINISHED SUMMARY MODAL */}
      {matchFinished && matchResultData && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-3xl bg-slate-950 border border-cyan-500/50 p-6 text-center space-y-5 shadow-[0_0_60px_rgba(6,182,212,0.5)] animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.5)]">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h2 className={`text-2xl font-black font-serif ${matchResultData.isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                {matchResultData.isWin ? 'ZWYCIĘSTWO!' : 'PORAŻKA'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Koniec pojedynku – Wynik rund: {p1.roundWins} : {p2.roundWins}
              </p>
            </div>

            {/* ELO Delta Result Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 block uppercase">
                {ranked ? 'ZMIANA PUNKTACJI ELO' : 'TRYB TURNIEJOWY'}
              </span>

              {ranked ? (
                <div className="flex items-center justify-center gap-3">
                  <span
                    className={`text-xl font-black font-mono ${
                      matchResultData.eloChange > 0
                        ? 'text-emerald-400'
                        : matchResultData.eloChange < 0
                        ? 'text-rose-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {matchResultData.eloChange > 0 ? `+${matchResultData.eloChange}` : matchResultData.eloChange} ELO
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({p1.elo} → {matchResultData.newElo})
                  </span>
                </div>
              ) : (
                <span className="text-xs font-black text-purple-300 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/40 inline-block">
                  PUNKTY ELO BEZ ZMIAN (MECZ TURNIEJOWY)
                </span>
              )}
            </div>

            <button
              onClick={onLeaveMatch}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/30"
            >
              POWRÓT DO HUBU
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
