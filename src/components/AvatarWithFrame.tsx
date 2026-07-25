import React from 'react';
import { AvatarFrameStyle } from '../types';

interface AvatarWithFrameProps {
  src: string;
  alt?: string;
  frame?: AvatarFrameStyle;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const AvatarWithFrame: React.FC<AvatarWithFrameProps> = ({
  src,
  alt = 'Avatar',
  frame = 'standard',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28'
  }[size];

  const paddingClasses = {
    xs: 'p-0.5',
    sm: 'p-0.5',
    md: 'p-1',
    lg: 'p-1',
    xl: 'p-1.5',
    '2xl': 'p-2'
  }[size];

  const getFrameStyles = () => {
    switch (frame) {
      case 'ice':
        return {
          container: 'ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] bg-cyan-950/60',
          image: 'ring-1 ring-cyan-200/50'
        };
      case 'gold':
        return {
          container: 'ring-2 ring-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.6)] bg-gradient-to-tr from-amber-800/80 via-yellow-600/40 to-amber-300/80',
          image: 'ring-1 ring-amber-100/60'
        };
      case 'emerald':
        return {
          container: 'ring-2 ring-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)] bg-emerald-950/60',
          image: 'ring-1 ring-emerald-200/50'
        };
      case 'crimson':
        return {
          container: 'ring-2 ring-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)] bg-rose-950/60',
          image: 'ring-1 ring-rose-200/50'
        };
      case 'mag':
        return {
          container: 'ring-2 ring-purple-500 border border-amber-400/90 shadow-[0_0_16px_rgba(168,85,247,0.7)] bg-slate-950',
          image: 'ring-1 ring-purple-300/60'
        };
      case 'standard':
      default:
        return {
          container: 'ring-1 ring-slate-700/80 bg-slate-900/60 shadow-md',
          image: 'ring-1 ring-slate-800'
        };
    }
  };

  const frameStyle = getFrameStyles();

  return (
    <div className={`relative rounded-full shrink-0 flex items-center justify-center transition-all ${sizeClasses} ${paddingClasses} ${frameStyle.container} ${className}`}>
      <img
        src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`w-full h-full rounded-full object-cover ${frameStyle.image}`}
      />
    </div>
  );
};
