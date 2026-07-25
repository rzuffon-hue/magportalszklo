import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AvatarWithFrame } from './AvatarWithFrame';
import { MiniWhiteoutCity } from './MiniWhiteout/MiniWhiteoutCity';
import {
  X,
  Crown,
  Award,
  Gamepad2,
  MessageSquare,
  Shield,
  Link as LinkIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface UserProfileModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onStartChat?: (user: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  onStartChat
}) => {
  const { profile: currentProfile } = useApp();
  const [showCityViewer, setShowCityViewer] = useState(false);

  if (!user) return null;

  const isMe = user.id === currentProfile.id || user.name.toLowerCase() === currentProfile.name.toLowerCase();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-purple-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Banner with Cover and Close Button */}
        <div className="relative h-32 sm:h-40 shrink-0 bg-slate-900">
          <img
            src={user.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000'}
            alt="Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/90 backdrop-blur-md transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header Profile Info */}
        <div className="px-5 pb-4 relative -mt-12 flex flex-col items-center text-center space-y-2 border-b border-slate-800 shrink-0">
          <AvatarWithFrame
            src={user.avatar}
            alt={user.name}
            frame={user.avatarFrame}
            size="2xl"
            className="shadow-2xl"
          />

          <div>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-lg font-black text-white">{user.name}</h2>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  user.role === 'ADMIN'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : user.role === 'MODERATOR'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {user.role}
              </span>
            </div>

            <p className="text-xs text-amber-300 font-semibold mt-0.5">{user.title || 'Członek Portalu MaG'}</p>
            {user.bio && (
              <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed italic">
                "{user.bio}"
              </p>
            )}
          </div>

          {/* Chat Action Button */}
          {!isMe && onStartChat && (
            <button
              onClick={() => {
                onStartChat(user);
                onClose();
              }}
              className="mt-2 w-full max-w-xs py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" /> NAPISZ WIADOMOŚĆ
            </button>
          )}
        </div>

        {/* Scrollable Profile Details */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Level & XP */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center font-bold">
              <span className="text-amber-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" /> Poziom {user.level || 1}
              </span>
              <span className="text-slate-400 font-mono">{user.xp || 0} XP</span>
            </div>
          </div>

          {/* Whiteout Survival Player Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/20 space-y-3">
            <h4 className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-amber-400" /> Karta Gracza WOS
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Sojusz</span>
                <span className="text-xs font-bold text-amber-200">{user.alliance || 'Sojusz MaG'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Nick w WOS</span>
                <span className="text-xs font-bold text-white">{user.wosNick || 'Brak danych'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ID Gracza</span>
                <span className="text-xs font-mono font-bold text-amber-300">{user.wosPlayerId || 'Brak danych'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Państwo / State</span>
                <span className="text-xs font-bold text-emerald-300">{user.stateCountry || 'State #104'}</span>
              </div>
            </div>
          </div>

          {/* Mini Whiteout City Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/80 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏰</span>
                <div>
                  <h4 className="text-xs font-extrabold text-white font-serif">MIASTO GRACZA (MINI WHITEOUT)</h4>
                  <p className="text-[10px] text-cyan-300 font-bold">Poziom {user.cityData?.level || 1}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCityViewer(true)}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition-all cursor-pointer"
              >
                ZOBACZ MIASTO
              </button>
            </div>
          </div>

          {/* Badges */}
          {user.badges && user.badges.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Odznaczenia ({user.badges.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <span
                    key={badge.id}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1"
                  >
                    <Crown className="w-3 h-3 text-amber-400" /> {badge.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Read-Only City Viewer Modal */}
      {showCityViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-cyan-500/50 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90">
              <h3 className="text-sm font-black text-white font-serif uppercase tracking-wider">
                MIASTO GRACZA: {user.name} (LVL {user.cityData?.level || 1})
              </h3>
              <button
                onClick={() => setShowCityViewer(false)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <MiniWhiteoutCity
                cityName={`OSADA ${user.name.toUpperCase()}`}
                ownerName={user.name}
                ownerRole={user.role}
                cityLevel={user.cityData?.level || 1}
                cityStats={user.cityData?.stats}
                isReadOnly={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
