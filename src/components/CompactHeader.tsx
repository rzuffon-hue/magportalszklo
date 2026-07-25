import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
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
  const { setActiveView } = useApp();

  return (
    <div className="flex items-center justify-between h-14 px-3 sm:px-4 bg-slate-950/90 border-b border-sky-500/20 backdrop-blur-md sticky top-0 z-30 shrink-0 w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveView('home')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500/50 transition-all flex items-center justify-center active:scale-95 shrink-0"
          title="Powrót do Portalu"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-slate-100 tracking-wide truncate">
            {title}
          </h1>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0">
              {badge}
            </span>
          )}
        </div>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-sky-500/20 hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          {actionIcon}
          {actionLabel && <span>{actionLabel}</span>}
        </button>
      )}
    </div>
  );
};
