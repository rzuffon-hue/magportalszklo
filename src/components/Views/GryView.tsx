import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompactHeader } from '../CompactHeader';
import { Gamepad2, Star, Play, Users, Sparkles } from 'lucide-react';

export const GryView: React.FC = () => {
  const { games, addXp } = useApp();
  const [activePlayingGame, setActivePlayingGame] = useState<string | null>(null);

  const handleLaunchGame = (gameTitle: string) => {
    setActivePlayingGame(gameTitle);
    addXp(30);
    setTimeout(() => {
      setActivePlayingGame(null);
    }, 4000);
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Compact Header */}
      <CompactHeader
        title="Centrum Gier"
        badge={`${games.length} gier`}
      />

      {/* Main Content Area */}
      <div className="flex-1 app-scroll-container p-3 sm:p-5 max-w-5xl mx-auto w-full space-y-4">
        {/* Active Game Session Notification Banner */}
        {activePlayingGame && (
          <div className="p-3.5 rounded-2xl bg-cyan-950/90 border border-cyan-400/80 text-cyan-100 flex items-center justify-between shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold animate-spin">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Uruchamianie {activePlayingGame}...</h4>
                <p className="text-xs text-cyan-200/80">Łączenie z serwerem gry (+30 XP)</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300 animate-pulse">ŁĄCZENIE...</span>
          </div>
        )}

        {/* Games Catalog Grid */}
        {games.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2 max-w-md mx-auto my-12">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Brak gier</p>
            <p className="text-xs text-slate-500">W tej chwili nie ma dostępnych gier.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 backdrop-blur-xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group/card"
              >
                <div>
                  <div
                    className="h-36 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${game.coverImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 text-[10px] bg-slate-950/90 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                      {game.genre}
                    </span>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded-full text-amber-400 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{game.rating}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <h3 className="text-base font-bold text-white">{game.title}</h3>

                    {/* Friends Playing List */}
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {game.friendsPlaying.map((friend) => (
                          <img
                            key={friend.id}
                            src={friend.avatar}
                            alt={friend.name}
                            referrerPolicy="no-referrer"
                            className="inline-block h-5 w-5 rounded-full ring-1 ring-slate-900 object-cover"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-cyan-300 font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3" /> {game.friendsPlaying.length} znajomych
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleLaunchGame(game.title)}
                    className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> ZAGRAJ TERAZ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
