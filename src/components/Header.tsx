import React, { useState } from 'react';
import { Bell, Settings, Sparkles, Volume2, VolumeX, RotateCcw, LogOut, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    profile,
    unreadNotificationsCount,
    notifications,
    markNotificationsRead,
    soundEnabled,
    setSoundEnabled,
    shaderQuality,
    setShaderQuality,
    isAuthenticated,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleNotifs = () => {
    setShowNotifications(!showNotifications);
    setShowSettings(false);
    if (!showNotifications) markNotificationsRead();
  };

  const toggleSetts = () => {
    setShowSettings(!showSettings);
    setShowNotifications(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 px-4 sm:px-8 flex items-center justify-between bg-gradient-to-b from-black/90 via-slate-950/70 to-transparent backdrop-blur-md border-b border-slate-800/40">
      
      {/* Left: MaG Carved Brand Logo */}
      <div
        onClick={() => isAuthenticated && setActiveView('home')}
        className="cursor-pointer group flex items-center gap-2 select-none"
      >
        <span
          className="text-2xl font-black font-serif tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-sky-200 to-purple-200 group-hover:from-purple-300 group-hover:to-sky-300 transition-all drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
          style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
        >
          MaG
        </span>
        {isAuthenticated && activeView !== 'home' && (
          <span className="text-xs text-slate-400 bg-slate-900/80 border border-slate-700/60 px-2 py-0.5 rounded-full font-medium">
            ← Wróć do Portalu
          </span>
        )}
      </div>

      {/* Right Controls: Rendered when authenticated */}
      {isAuthenticated && (
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin Panel Quick Access Button (only for ADMIN) */}
          {profile.role === 'ADMIN' && (
            <button
              onClick={() => {
                setActiveView('admin');
                setShowSettings(false);
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-wider transition-all backdrop-blur-md opacity-85 hover:opacity-100 ${
                activeView === 'admin'
                  ? 'bg-amber-500/90 text-black border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                  : 'bg-slate-950/80 border-slate-700/60 text-amber-300/80 hover:border-amber-400/60 hover:text-amber-200 hover:bg-slate-900/80'
              }`}
            >
              <ShieldAlert className="w-2.5 h-2.5 text-amber-400 shrink-0" />
              <span>ADMIN</span>
            </button>
          )}

          {/* User Profile Quick Badge */}
          <div
            onClick={() => setActiveView('profil')}
            className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/50 hover:border-amber-500/50 px-2.5 py-1 rounded-full cursor-pointer transition-all backdrop-blur-md group"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/50 group-hover:ring-amber-400"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-100 group-hover:text-amber-200 transition-colors flex items-center gap-1">
                {profile.name}
                {profile.role === 'ADMIN' && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded font-mono">
                    ADMIN
                  </span>
                )}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-amber-400 font-semibold">Poziom {profile.level}</span>
                <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(profile.xp / profile.maxXp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={toggleNotifs}
              className={`p-2 rounded-full border transition-all relative ${
                showNotifications
                  ? 'bg-purple-950 border-purple-500 text-purple-200'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-black animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950/95 border border-purple-500/30 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                    <Bell className="w-4 h-4 text-purple-400" /> Powiadomienia
                  </h3>
                  <span className="text-xs text-purple-300 font-semibold">{notifications.length} ogółem</span>
                </div>

                <div className="space-y-2 mt-3 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                      Brak nowych powiadomień
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-200">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.timeAgo}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings Gear */}
          <div className="relative">
            <button
              onClick={toggleSetts}
              className={`p-2 rounded-full border transition-all ${
                showSettings
                  ? 'bg-sky-950 border-sky-500 text-sky-200'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Settings Dropdown Drawer */}
            {showSettings && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-950/95 border border-sky-500/30 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                    <Settings className="w-4 h-4 text-sky-400" /> Ustawienia Portalu
                  </h3>
                </div>

                {/* Admin Panel button inside settings for quick toggle if ADMIN */}
                {profile.role === 'ADMIN' && (
                  <button
                    onClick={() => {
                      setActiveView('admin');
                      setShowSettings(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" /> Otwórz Panel Admina
                  </button>
                )}

                {/* Sound Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />} Efekty Dźwiękowe
                  </span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      soundEnabled ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {soundEnabled ? 'Włączone' : 'Wyłączone'}
                  </button>
                </div>

                {/* Shader Quality */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Jakość Shaderów Szczelin
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {(['low', 'medium', 'high'] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setShaderQuality(q)}
                        className={`py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                          shaderQuality === q ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {q === 'low' ? 'Niska' : q === 'medium' ? 'Średnia' : 'Wysoka'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset View */}
                <button
                  onClick={() => {
                    setActiveView('home');
                    setShowSettings(false);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-sky-950 border border-slate-800 hover:border-sky-500/40 text-xs font-bold text-sky-300 flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Wyśrodkuj Portal MaG
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setShowSettings(false);
                    logout();
                  }}
                  className="w-full py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-xs font-bold text-rose-300 flex items-center justify-center gap-2 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" /> Wyloguj się
                </button>
              </div>
            )}
          </div>

          {/* Quick Logout Icon Button */}
          <button
            onClick={logout}
            title="Wyloguj się"
            className="p-2 rounded-full border bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-rose-400 hover:border-rose-500/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
