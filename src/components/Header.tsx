import React, { useState, useEffect } from 'react';
import { Bell, Settings, Volume2, VolumeX, LogOut, ShieldAlert, Megaphone, CheckCircle2, Sun, Moon, ArrowLeft, Palette, Sparkles, RotateCcw, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    profile,
    unreadNotificationsCount,
    notifications,
    markNotificationsRead,
    announcements,
    unreadAnnouncementsCount,
    setActiveAnnouncementModal,
    soundEnabled,
    setSoundEnabled,
    portalTheme,
    setPortalTheme,
    isAuthenticated,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifTab, setNotifTab] = useState<'announcements' | 'system'>('announcements');
  const [shaderQuality, setShaderQuality] = useState<'low' | 'medium' | 'high'>('high');

  const totalUnreadCount = unreadNotificationsCount + unreadAnnouncementsCount;

  // ESC key listener to close drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowSettings(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleNotifs = () => {
    setShowNotifications(!showNotifications);
    setShowSettings(false);
    if (!showNotifications) markNotificationsRead();
  };

  const toggleSetts = () => {
    setShowSettings(!showSettings);
    setShowNotifications(false);
  };

  const closeAllDrawers = () => {
    setShowNotifications(false);
    setShowSettings(false);
  };

  return (
    <>
      {/* Click Outside Transparent Backdrop */}
      {(showNotifications || showSettings) && (
        <div
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          onClick={closeAllDrawers}
        />
      )}

      <header className={`fixed top-0 left-0 right-0 z-50 h-14 px-2.5 sm:px-6 flex items-center justify-between border-b backdrop-blur-xl transition-all duration-300 ${
        portalTheme === 'komiksowy'
          ? 'bg-amber-300 border-b-3 border-slate-950 text-slate-950 shadow-[0_3px_0px_0px_rgba(15,23,42,1)]'
          : portalTheme === 'lustrzany'
          ? 'bg-white/95 border-slate-300/80 text-slate-950 shadow-sm'
          : 'bg-gradient-to-b from-black/95 via-slate-950/85 to-transparent border-slate-800/60 text-slate-100'
      }`}>
      
      {/* Left: MaG Brand & Compact Back Arrow */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <div
          onClick={() => isAuthenticated && setActiveView('home')}
          className="cursor-pointer group flex items-center gap-1.5 select-none"
        >
          <span
            className="text-xl sm:text-2xl font-black font-serif tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-sky-200 to-purple-200 group-hover:from-purple-300 group-hover:to-sky-300 transition-all drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
            style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
          >
            MaG
          </span>
        </div>

        {isAuthenticated && activeView !== 'home' && (
          <button
            onClick={() => setActiveView('home')}
            className="p-1.5 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-200 hover:text-white hover:border-slate-400 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Powrót do Portalu (ESC)"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 h-5 text-sky-400" />
          </button>
        )}
      </div>

      {/* Right Controls: Rendered when authenticated */}
      {isAuthenticated && (
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Admin Panel Quick Access Button (only for ADMIN) */}
          {profile.role === 'ADMIN' && (
            <button
              onClick={() => {
                setActiveView('admin');
                setShowSettings(false);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-mono font-bold tracking-wider transition-all backdrop-blur-md cursor-pointer shrink-0 ${
                activeView === 'admin'
                  ? 'bg-amber-500/90 text-black border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                  : 'bg-slate-950/80 border-slate-700/60 text-amber-300 hover:border-amber-400/60 hover:bg-slate-900/80'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="hidden xs:inline">ADMIN</span>
            </button>
          )}

          {/* User Profile Quick Badge */}
          <div
            onClick={() => setActiveView('profil')}
            className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/50 hover:border-amber-500/50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full cursor-pointer transition-all backdrop-blur-md group shrink-0"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-amber-400/50 group-hover:ring-amber-400"
            />
            <div className="hidden md:flex flex-col text-left">
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
              className={`p-2 rounded-full border transition-all relative cursor-pointer ${
                showNotifications
                  ? 'bg-purple-950 border-purple-500 text-purple-200'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              <Bell className="w-4 h-4" />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4 h-4 bg-rose-500 text-white font-black text-[9px] rounded-full ring-2 ring-black flex items-center justify-center animate-pulse">
                  {totalUnreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div className="fixed top-14 right-3 left-3 sm:left-auto sm:right-4 sm:w-96 max-w-[calc(100vw-24px)] rounded-2xl bg-slate-950/95 border border-purple-500/30 p-3.5 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                
                {/* Header & Tabs */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNotifTab('announcements')}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        notifTab === 'announcements'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Ogłoszenia</span>
                      {unreadAnnouncementsCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                          {unreadAnnouncementsCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setNotifTab('system')}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        notifTab === 'system'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Powiadomienia</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[9px] font-black">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Tab 1: Announcements List */}
                {notifTab === 'announcements' && (
                  <div className="space-y-2 mt-3 max-h-[60vh] sm:max-h-72 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
                    {announcements.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 font-medium">
                        Brak opublikowanych ogłoszeń
                      </div>
                    ) : (
                      announcements.map((ann) => {
                        const isRead = ann.confirmations?.some(c =>
                          (c.userId === profile.id || c.username === profile.name) && Boolean(c.confirmedAt)
                        );
                        return (
                          <div
                            key={ann.id}
                            onClick={() => {
                              setActiveAnnouncementModal(ann);
                              setShowNotifications(false);
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 min-w-0 ${
                              !isRead
                                ? 'bg-purple-950/40 border-purple-500/50 hover:bg-purple-900/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80'
                            }`}
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                                  {ann.category}
                                </span>
                                {!isRead && (
                                  <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1 rounded border border-rose-500/30">
                                    NIEPRZECZYTANE
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-slate-100 truncate">{ann.title}</h4>
                              <p className="text-[11px] text-slate-400 line-clamp-2 break-words">{ann.content}</p>
                            </div>

                            {isRead ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" title="Przeczytano" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-2 animate-ping" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Tab 2: System Notifications List */}
                {notifTab === 'system' && (
                  <div className="space-y-2 mt-3 max-h-[60vh] sm:max-h-72 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 font-medium">
                        Brak powiadomień
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-colors min-w-0"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-purple-200 truncate">{n.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.timeAgo}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 break-words">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
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
              <div className="fixed top-14 right-3 sm:right-4 sm:w-72 max-w-[calc(100vw-24px)] rounded-2xl bg-slate-950/95 border border-sky-500/30 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-4 overflow-hidden">
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

                {/* Portal Theme Toggle (Admin & User) */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-400" /> Motyw Portalu
                    </span>
                    {profile.role === 'ADMIN' && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">ADMIN</span>
                    )}
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setPortalTheme('mroczny')}
                      className={`py-1.5 px-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        portalTheme === 'mroczny'
                          ? 'bg-amber-500 text-black shadow-md font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Moon className="w-3 h-3 shrink-0" />
                      <span>Mroczny</span>
                    </button>
                    <button
                      onClick={() => setPortalTheme('lustrzany')}
                      className={`py-1.5 px-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        portalTheme === 'lustrzany'
                          ? 'bg-sky-500 text-white shadow-md font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sun className="w-3 h-3 shrink-0" />
                      <span>Lustrzany</span>
                    </button>
                    <button
                      onClick={() => setPortalTheme('komiksowy')}
                      className={`py-1.5 px-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        portalTheme === 'komiksowy'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md border border-slate-950'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Zap className="w-3 h-3 shrink-0 fill-amber-400" />
                      <span>Komiks!</span>
                    </button>
                  </div>
                </div>

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
  </>);
};
