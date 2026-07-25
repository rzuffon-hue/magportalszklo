import React from 'react';
import { useApp } from '../../context/AppContext';
import { CompactHeader } from '../CompactHeader';
import { MiniWhiteoutCity, CITY_LEVELS } from '../MiniWhiteout/MiniWhiteoutCity';
import {
  Building2,
  Sparkles,
  Heart,
  MessageSquare,
  Flame,
  Crown,
  Shield,
  Award,
  ArrowRight,
  Info
} from 'lucide-react';

export const MiniWhiteoutView: React.FC = () => {
  const { profile, setProfile, setActiveView } = useApp();

  const handleUpgradeCity = (nextLevel: number) => {
    setProfile((prev) => {
      const currentStats = prev.cityData?.stats || {
        likesGiven: 35,
        commentsWritten: 15,
        likesReceived: 25
      };

      return {
        ...prev,
        cityData: {
          ...prev.cityData,
          level: nextLevel,
          stats: currentStats,
          lastUpgradedAt: new Date().toLocaleDateString('pl-PL')
        }
      };
    });
  };

  const currentLevel = profile.cityData?.level || 1;

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Compact Header */}
      <CompactHeader
        title="Mini Whiteout – Miasto Gracza"
        badge={`Osada MaG LVL ${currentLevel}`}
      />

      {/* Main Container */}
      <div className="flex-1 app-scroll-container p-3 sm:p-5 max-w-6xl mx-auto w-full space-y-6 pb-12">
        {/* Top Hero Explanation Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/80 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-black text-white font-serif uppercase tracking-wider">
                Rozwijaj własne miasto poprzez aktywność w Portalu
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Twoją walutą są prawdziwe interakcje ze społecznością Portalu MaG. Rozdawaj polubienia, pisz wartościowe komentarze i zdobywaj uznanie innych, aby rozbudować osadę od małego paleniska aż po potężną Stolicę MaG!
            </p>
          </div>

          <button
            onClick={() => setActiveView('sciana')}
            className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/30 cursor-pointer shrink-0"
          >
            <span>PRZEJDŹ DO ŚCIANY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* MAIN INTERACTIVE CITY BUILDER COMPONENT */}
        <MiniWhiteoutCity
          cityName={`OSADA ${profile.name.toUpperCase()}`}
          ownerName={profile.name}
          ownerRole={profile.role}
          cityLevel={currentLevel}
          onUpgrade={handleUpgradeCity}
        />

        {/* PROGRESSION ROADMAP (10 LEVELS OVERVIEW) */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white font-serif uppercase tracking-wide">
                Poziomy Rozwoju Miasta (1 – 10)
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-300 font-bold">
              Aktualnie: LVL {currentLevel} / 10
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CITY_LEVELS.map((lvl) => {
              const isCurrent = lvl.level === currentLevel;
              const isUnlocked = lvl.level <= currentLevel;

              return (
                <div
                  key={lvl.level}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                    isCurrent
                      ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border-amber-400 shadow-md shadow-amber-500/10'
                      : isUnlocked
                      ? 'bg-slate-900/90 border-cyan-500/40 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-black px-2 py-0.5 rounded-full border ${
                        isCurrent
                          ? 'bg-amber-400 text-black border-amber-300'
                          : isUnlocked
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      LVL {lvl.level}
                    </span>

                    {isCurrent ? (
                      <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        AKTUALNE MIASTO
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-bold text-emerald-400">
                        ✓ ODBLOKOWANE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500">
                        🔒 ZABLOKOWANE
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-white font-serif">
                      {lvl.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {lvl.desc}
                    </p>
                  </div>

                  {lvl.level < 10 && (
                    <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                      <span>Wymagania:</span>
                      <span className="text-amber-300 font-bold">
                        ♥{lvl.reqLikesGiven} | 💬{lvl.reqComments} | 🔥{lvl.reqLikesReceived}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
