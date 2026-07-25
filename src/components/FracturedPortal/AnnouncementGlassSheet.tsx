import React, { useState, useEffect } from 'react';
import {
  PortalAnnouncement,
  AnnouncementCategory,
  AppView
} from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Megaphone,
  Trophy,
  Calendar,
  Gamepad2,
  Shield,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckSquare,
  Square,
  Check,
  X,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CategoryStyleConfig {
  name: AnnouncementCategory;
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  gradientText: string;
  glassBorder: string;
  glowColor: string;
  radialBg: string;
  btnBg: string;
  btnHover: string;
  btnShadow: string;
  accentRgb: string;
}

const CATEGORY_STYLES: Record<AnnouncementCategory, CategoryStyleConfig> = {
  TURNIEJ: {
    name: 'TURNIEJ',
    icon: Trophy,
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/50',
    gradientText: 'from-cyan-200 via-sky-300 to-blue-400',
    glassBorder: 'border-cyan-500/40 hover:border-cyan-400/60',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    radialBg: 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.22) 0%, rgba(15, 23, 42, 0.85) 70%, rgba(3, 7, 18, 0.95) 100%)',
    btnBg: 'bg-cyan-500 text-black font-black',
    btnHover: 'hover:bg-cyan-400',
    btnShadow: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]',
    accentRgb: '6, 182, 212'
  },
  GRY: {
    name: 'GRY',
    icon: Gamepad2,
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/50',
    gradientText: 'from-cyan-200 via-sky-300 to-blue-400',
    glassBorder: 'border-cyan-500/40 hover:border-cyan-400/60',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    radialBg: 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.22) 0%, rgba(15, 23, 42, 0.85) 70%, rgba(3, 7, 18, 0.95) 100%)',
    btnBg: 'bg-cyan-500 text-black font-black',
    btnHover: 'hover:bg-cyan-400',
    btnShadow: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]',
    accentRgb: '6, 182, 212'
  },
  WYDARZENIE: {
    name: 'WYDARZENIE',
    icon: Calendar,
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/50',
    gradientText: 'from-amber-200 via-yellow-300 to-amber-500',
    glassBorder: 'border-amber-500/40 hover:border-amber-400/60',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    radialBg: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.22) 0%, rgba(24, 18, 12, 0.85) 70%, rgba(3, 7, 18, 0.95) 100%)',
    btnBg: 'bg-amber-500 text-black font-black',
    btnHover: 'hover:bg-amber-400',
    btnShadow: 'shadow-[0_0_25px_rgba(245,158,11,0.4)]',
    accentRgb: '245, 158, 11'
  },
  WAŻNE: {
    name: 'WAŻNE',
    icon: Megaphone,
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/50',
    gradientText: 'from-rose-200 via-red-300 to-rose-500',
    glassBorder: 'border-rose-500/40 hover:border-rose-400/60',
    glowColor: 'rgba(225, 29, 72, 0.35)',
    radialBg: 'radial-gradient(circle at 50% 30%, rgba(225, 29, 72, 0.22) 0%, rgba(28, 12, 18, 0.85) 70%, rgba(3, 7, 18, 0.95) 100%)',
    btnBg: 'bg-rose-500 text-white font-black',
    btnHover: 'hover:bg-rose-400',
    btnShadow: 'shadow-[0_0_25px_rgba(225,29,72,0.4)]',
    accentRgb: '225, 29, 72'
  },
  OSTRZEŻENIE: {
    name: 'OSTRZEŻENIE',
    icon: AlertTriangle,
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-500/50',
    gradientText: 'from-orange-200 via-amber-300 to-orange-500',
    glassBorder: 'border-orange-500/40 hover:border-orange-400/60',
    glowColor: 'rgba(249, 115, 22, 0.35)',
    radialBg: 'radial-gradient(circle at 50% 30%, rgba(249, 115, 22, 0.22) 0%, rgba(28, 18, 12, 0.85) 70%, rgba(3, 7, 18, 0.95) 100%)',
    btnBg: 'bg-orange-500 text-black font-black',
    btnHover: 'hover:bg-orange-400',
    btnShadow: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]',
    accentRgb: '249, 115, 22'
  },
  SOJUSZ: {
    name: 'SOJUSZ',
    icon: Shield,
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/50',
    gradientText: 'from-emerald-200 via-teal-300 to-emerald-500',
    glassBorder: 'border-emerald-500/40 hover:border-emerald-400/60',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    radialBg: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.22) 0%, rgba(12, 28, 20, 0.85) 70%, rgba(3, 7, 18, 0.95) 100%)',
    btnBg: 'bg-emerald-500 text-black font-black',
    btnHover: 'hover:bg-emerald-400',
    btnShadow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
    accentRgb: '16, 185, 129'
  },
  AKTUALIZACJA: {
    name: 'AKTUALIZACJA',
    icon: RefreshCw,
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/50',
    gradientText: 'from-purple-200 via-fuchsia-300 to-purple-500',
    glassBorder: 'border-purple-500/40 hover:border-purple-400/60',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    radialBg: 'radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.22) 0%, rgba(22, 12, 32, 0.85) 70%, rgba(3, 7, 18, 0.95) 100%)',
    btnBg: 'bg-purple-500 text-white font-black',
    btnHover: 'hover:bg-purple-400',
    btnShadow: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]',
    accentRgb: '168, 85, 247'
  },
  INFORMACJA: {
    name: 'INFORMACJA',
    icon: Info,
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/50',
    gradientText: 'from-blue-200 via-sky-300 to-blue-500',
    glassBorder: 'border-blue-500/40 hover:border-blue-400/60',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    radialBg: 'radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.22) 0%, rgba(12, 18, 32, 0.85) 70%, rgba(3, 7, 18, 0.95) 100%)',
    btnBg: 'bg-blue-500 text-white font-black',
    btnHover: 'hover:bg-blue-400',
    btnShadow: 'shadow-[0_0_25px_rgba(59,130,246,0.4)]',
    accentRgb: '59, 130, 246'
  }
};

interface AnnouncementGlassSheetProps {
  announcement: PortalAnnouncement;
  currentIndex?: number;
  totalCount?: number;
  onConfirm?: (announcementId: string) => void;
  onDismiss?: () => void;
  isPreview?: boolean;
}

export const AnnouncementGlassSheet: React.FC<AnnouncementGlassSheetProps> = ({
  announcement,
  currentIndex = 1,
  totalCount = 1,
  onConfirm,
  onDismiss,
  isPreview = false
}) => {
  const { setActiveView, portalTheme } = useApp();
  const isMirror = portalTheme === 'lustrzany';
  const [isChecked, setIsChecked] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmedDone, setIsConfirmedDone] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const styleConfig = CATEGORY_STYLES[announcement.category] || CATEGORY_STYLES.INFORMACJA;
  const CategoryIcon = styleConfig.icon;

  useEffect(() => {
    // Reset state when announcement changes
    setIsChecked(false);
    setIsConfirming(false);
    setIsConfirmedDone(false);
    setIsExiting(false);

    // Trigger smooth enter animation
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [announcement.id]);

  const handleConfirmClick = () => {
    if (announcement.requirement === 'WYMAGA_POTWIERDZENIA' && !isChecked) return;

    setIsConfirming(true);

    setTimeout(() => {
      setIsConfirmedDone(true);

      setTimeout(() => {
        setIsExiting(true);

        setTimeout(() => {
          if (onConfirm) {
            onConfirm(announcement.id);
          } else if (onDismiss) {
            onDismiss();
          }
        }, 400);
      }, 500);
    }, 250);
  };

  const handleNavigateCTA = () => {
    if (announcement.portalTargetView) {
      if (onConfirm) onConfirm(announcement.id);
      setActiveView(announcement.portalTargetView);
      if (onDismiss) onDismiss();
    }
  };

  const isMandatory = announcement.requirement === 'WYMAGA_POTWIERDZENIA';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none overflow-hidden h-[100dvh] max-h-[100dvh] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isMounted && !isExiting
          ? isMirror ? 'opacity-100 backdrop-blur-md bg-slate-900/40' : 'opacity-100 backdrop-blur-md bg-black/80'
          : 'opacity-0 backdrop-blur-none bg-black/0 pointer-events-none'
      }`}
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)'
      }}
    >
      {/* Category Ambient Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: isMirror
            ? `radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, rgba(241, 245, 249, 0.6) 80%)`
            : `radial-gradient(circle at 50% 50%, ${styleConfig.glowColor} 0%, rgba(3, 5, 12, 0.8) 80%)`,
          opacity: isMounted && !isExiting ? 0.85 : 0
        }}
      />

      {/* Main Glass Sheet Container */}
      <div
        className={`relative w-full max-w-2xl max-h-[calc(100dvh-2rem)] flex flex-col rounded-3xl border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          isMirror
            ? 'border-sky-300 shadow-[0_25px_70px_rgba(2,132,199,0.2)] bg-white text-slate-950'
            : `${styleConfig.glassBorder} shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-slate-100`
        } ${
          isMounted && !isExiting
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-12 scale-95 opacity-0'
        }`}
        style={{
          background: isMirror ? '#ffffff' : styleConfig.radialBg,
          boxShadow: isMirror
            ? `0 20px 60px rgba(2, 132, 199, 0.2), inset 0 1px 1px rgba(255,255,255,1)`
            : `0 20px 80px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), 0 0 30px ${styleConfig.glowColor}`
        }}
      >
        {/* Subtle Glass Rim Refraction Edge */}
        <div className={`absolute inset-0 rounded-3xl pointer-events-none border ${isMirror ? 'border-sky-200/50' : 'border-white/10'}`} />

        {/* Category Light Refraction Beam */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{ backgroundColor: `rgb(${styleConfig.accentRgb})` }}
        />

        {/* 1. GLASS SHEET HEADER BAR */}
        <div className={`relative z-20 flex items-center justify-between px-5 sm:px-7 py-4 border-b shrink-0 ${
          isMirror ? 'bg-sky-50/80 border-sky-100' : 'bg-slate-950/40 border-white/10 backdrop-blur-xl'
        }`}>
          <div className="flex items-center gap-2.5">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border shadow-sm ${
                isMirror
                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                  : `${styleConfig.badgeBg} ${styleConfig.badgeText} ${styleConfig.badgeBorder}`
              }`}
            >
              <CategoryIcon className="w-3.5 h-3.5" />
              {styleConfig.name}
            </span>

            {isMandatory && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isMirror ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                OBOWIĄZKOWE
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Queue Counter if multiple announcements */}
            {totalCount > 1 && (
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full shadow-inner ${
                isMirror ? 'bg-slate-100 text-slate-800 border border-slate-300' : 'bg-slate-900/90 text-slate-300 border border-slate-700/80'
              }`}>
                {currentIndex} / {totalCount}
              </span>
            )}

            {/* Close Button: Rendered for ZWYKŁE OR when in preview/review mode */}
            {(!isMandatory || isPreview || !onConfirm) && (
              <button
                onClick={onDismiss || (() => setIsExiting(true))}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  isMirror ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
                title="Zamknij"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2. SCROLLABLE CONTENT BODY */}
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-5 custom-scrollbar">
          {/* Optional Graphic Image Header */}
          {announcement.imageUrl && (
            <div className={`relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border group shadow-lg ${
              isMirror ? 'border-slate-200' : 'border-white/10'
            }`}>
              <img
                src={announcement.imageUrl}
                alt={announcement.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className={`absolute inset-0 ${
                isMirror ? 'bg-gradient-to-t from-white/80 via-transparent to-transparent' : 'bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent'
              }`} />
            </div>
          )}

          {/* Event Time & Date Highlight Banner */}
          {(announcement.eventDate || announcement.eventTime) && (
            <div
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
                isMirror ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-slate-900/70 border-white/10 text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
              <div className="text-xs font-bold">
                <span className={isMirror ? 'text-slate-700' : 'text-slate-400'}>Termin Wydarzenia: </span>
                <span className={`font-mono px-2 py-0.5 rounded ml-1 ${
                  isMirror ? 'bg-amber-100 text-amber-900 font-black' : 'bg-white/10 text-white'
                }`}>
                  {announcement.eventDate || 'Dzisiaj'} {announcement.eventTime ? `• ${announcement.eventTime}` : ''}
                </span>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <h2
              className={`text-xl sm:text-2xl font-black tracking-tight leading-tight uppercase font-serif ${
                isMirror ? 'text-slate-950 drop-shadow-none' : `bg-clip-text text-transparent bg-gradient-to-r ${styleConfig.gradientText} drop-shadow-md`
              }`}
            >
              {announcement.title}
            </h2>

            {/* Author info & publication timestamp */}
            <div className={`flex items-center gap-2 mt-2 text-[11px] font-medium ${
              isMirror ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <img
                src={announcement.createdByAvatar}
                alt={announcement.createdByName}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
              />
              <span className="font-bold">{announcement.createdByName}</span>
              <span>•</span>
              <span className={`font-mono ${isMirror ? 'text-slate-500' : 'text-slate-500'}`}>{announcement.createdAt}</span>
            </div>
          </div>

          {/* Body Text */}
          <div className={`text-sm leading-relaxed font-sans space-y-3 whitespace-pre-wrap p-4 rounded-2xl border font-medium ${
            isMirror
              ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-inner'
              : 'bg-slate-950/40 border-white/5 text-slate-200'
          }`}>
            {announcement.content}
          </div>

          {/* External Link or CTA Button inside content if present */}
          {announcement.linkUrl && (
            <a
              href={announcement.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                isMirror ? 'bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100' : 'bg-slate-900 border-slate-700 text-cyan-300 hover:text-white hover:border-cyan-400'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Otwórz załączony link
            </a>
          )}
        </div>

        {/* 3. STICKY BOTTOM CONFIRMATION & ACTION BAR */}
        <div className={`relative z-20 p-4 sm:p-6 border-t shrink-0 space-y-3 ${
          isMirror ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/90 border-white/10 backdrop-blur-2xl'
        }`}>
          
          {/* Glass Flash Overlay when Confirming */}
          {isConfirming && (
            <div className="absolute inset-0 bg-sky-500/20 animate-pulse pointer-events-none z-30" />
          )}

          {/* Mandatory Checkbox */}
          {isMandatory && !isConfirmedDone && (
            <div
              onClick={() => setIsChecked(!isChecked)}
              className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                isMirror ? 'bg-white border-slate-300 hover:border-sky-400' : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <button type="button" className="text-amber-500 shrink-0 cursor-pointer">
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Square className={`w-5 h-5 ${isMirror ? 'text-slate-400' : 'text-slate-500'}`} />
                )}
              </button>
              <span className={`text-xs font-bold ${isMirror ? 'text-slate-900' : 'text-slate-200'}`}>
                Przeczytałem/am i rozumiem treść powyższego ogłoszenia
              </span>
            </div>
          )}

          {/* Optional CTA Navigation Button (e.g. [ ZOBACZ TURNIEJ ]) */}
          {announcement.portalTargetView && (
            <button
              onClick={handleNavigateCTA}
              className={`w-full py-2.5 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                isMirror ? 'bg-sky-600 hover:bg-sky-500 text-white border-sky-600' : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{announcement.ctaLabel || 'PRZEJDŹ DO SEKCJI PORTALU'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Confirmation Button */}
          <button
            disabled={isMandatory && !isChecked && !isConfirmedDone}
            onClick={handleConfirmClick}
            className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isConfirmedDone
                ? 'bg-emerald-500 text-white shadow-lg scale-102'
                : isMandatory && !isChecked
                ? isMirror ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : isMirror
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md active:scale-98'
                : `${styleConfig.btnBg} ${styleConfig.btnHover} ${styleConfig.btnShadow} active:scale-98`
            }`}
          >
            {isConfirmedDone ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                <span>POTWIERDZONO</span>
              </>
            ) : (
              <span>POTWIERDZAM</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
