import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CompactHeaderProps {
  title: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  actionLabel?: string;
  badge?: string;
}

export const CompactHeader: React.FC<CompactHeaderProps> = ({
  title,
  onAction,
  actionIcon = <Plus className="w-4 h-4" />,
  actionLabel,
  badge,
}) => {
  const { portalTheme } = useApp();

  return (
    <div className={`flex items-center justify-between h-12 sm:h-14 px-3 sm:px-6 border-b backdrop-blur-md sticky top-0 z-30 shrink-0 w-full transition-colors duration-300 ${
      portalTheme === 'lustrzany'
        ? 'bg-white/90 border-slate-300/80 text-slate-950'
        : 'bg-slate-950/90 border-sky-500/20 text-slate-100'
    }`}>
      <div className="flex items-center gap-2 min-w-0">
        <h1 className={`text-sm sm:text-base font-extrabold tracking-wider uppercase font-serif truncate ${
          portalTheme === 'lustrzany' ? 'text-slate-950' : 'text-slate-100'
        }`}>
          {title}
        </h1>
        {badge && (
          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full font-bold shrink-0 ${
            portalTheme === 'lustrzany'
              ? 'bg-sky-100 text-sky-800 border border-sky-300'
              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
          }`}>
            {badge}
          </span>
        )}
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          {actionIcon}
          {actionLabel && <span>{actionLabel}</span>}
        </button>
      )}
    </div>
  );
};

