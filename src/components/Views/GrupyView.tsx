import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompactHeader } from '../CompactHeader';
import { GroupDetailView } from './Grupy/GroupDetailView';
import {
  Users,
  UserCheck,
  Shield,
  Sparkles,
  Search,
  Plus,
  Lock,
  Globe,
  FolderPlus,
  MessageSquare
} from 'lucide-react';
import { Group } from '../../types';

export const GrupyView: React.FC = () => {
  const { groups, toggleGroupJoin, profile, setActiveView, portalTheme } = useApp();
  const isMirror = portalTheme === 'lustrzany';
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isPortalAdmin = profile.role === 'ADMIN';
  const joinedCount = groups.filter(g => g.members.some(m => m.userId === profile.id)).length;

  // Filter groups by name, category, or description
  const filteredGroups = groups.filter(g => {
    const q = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.shortDescription.toLowerCase().includes(q)
    );
  });

  // If a group is selected, render GroupDetailView
  if (selectedGroup) {
    // keep state fresh from global context
    const freshGroup = groups.find(g => g.id === selectedGroup.id) || selectedGroup;
    return (
      <div className={`h-full w-full flex flex-col overflow-hidden font-sans ${isMirror ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
        <CompactHeader
          title={freshGroup.name}
          badge={`${freshGroup.membersCount} członków`}
        />
        <div className="flex-1 app-scroll-container p-3 sm:p-5 max-w-5xl mx-auto w-full">
          <GroupDetailView
            group={freshGroup}
            onBack={() => setSelectedGroup(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full flex flex-col overflow-hidden font-sans ${isMirror ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* Compact Header */}
      <CompactHeader
        title="Grupy i Społeczności"
        badge={`${joinedCount} dołączonych`}
      />

      {/* Main Content Area */}
      <div className="flex-1 app-scroll-container p-3 sm:p-5 max-w-5xl mx-auto w-full space-y-4">
        
        {/* Search Bar & Admin Create Action */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border backdrop-blur-xl ${
          isMirror ? 'bg-white border-slate-300' : 'bg-slate-900/80 border-slate-800/90'
        }`}>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Szukaj grupy, kategorii lub tematu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none ${
                isMirror
                  ? 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-500 focus:border-emerald-500'
                  : 'bg-slate-950/90 border-slate-800 text-slate-100 focus:border-emerald-500'
              }`}
            />
          </div>

          {isPortalAdmin && (
            <button
              onClick={() => setActiveView('admin')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> PANEL ADMINA (UTWÓRZ GRUPĘ)
            </button>
          )}
        </div>

        {/* Group Cards Grid */}
        {filteredGroups.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border space-y-3 max-w-md mx-auto my-12 ${
            isMirror ? 'bg-white border-slate-300' : 'bg-slate-900/50 border-slate-800/80'
          }`}>
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${isMirror ? 'bg-emerald-100' : 'bg-slate-800'}`}>
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className={`text-sm font-bold ${isMirror ? 'text-slate-950' : 'text-slate-300'}`}>Brak grup</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {searchQuery
                ? 'Brak grup spełniających podane kryteria wyszukiwania.'
                : 'W tej chwili nie ma jeszcze stworzonych grup. Administratorzy mogą założyć pierwsze oficjalne grupy.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => {
              const isMember = group.members.some(m => m.userId === profile.id);

              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`rounded-2xl border backdrop-blur-xl overflow-hidden shadow-sm flex flex-col justify-between transition-all group/card cursor-pointer ${
                    isMirror
                      ? 'bg-white border-slate-300 hover:border-emerald-500'
                      : 'bg-slate-900/80 border-slate-800/90 hover:border-emerald-500/50 shadow-xl'
                  }`}
                >
                  <div>
                    {/* Cover Header */}
                    <div
                      className="h-28 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${group.coverImage})` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-t ${isMirror ? 'from-white/90 via-white/30 to-transparent' : 'from-slate-900 via-slate-900/40 to-black/20'}`} />
                      
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                        <span className={`text-[10px] border px-2 py-0.5 rounded-full font-bold backdrop-blur-md ${
                          isMirror ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300' : 'bg-slate-950/90 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {group.category}
                        </span>

                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold border backdrop-blur-md ${
                            group.visibility === 'PUBLICZNA'
                              ? isMirror
                                ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                                : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                              : isMirror
                                ? 'bg-purple-100/90 text-purple-900 border-purple-300'
                                : 'bg-purple-950/90 text-purple-300 border-purple-500/40'
                          }`}
                        >
                          {group.visibility === 'PUBLICZNA' ? (
                            <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" /> Otwarta</span>
                          ) : (
                            <span className="flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Prywatna</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Group Body */}
                    <div className="p-4 space-y-2.5 relative z-10">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={group.avatarImage}
                            alt={group.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/40"
                          />
                          <h3 className={`text-sm font-black truncate group-hover/card:text-emerald-600 transition-colors ${
                            isMirror ? 'text-slate-950' : 'text-white'
                          }`}>
                            {group.name}
                          </h3>
                        </div>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                          <Users className="w-3.5 h-3.5" /> {group.membersCount}
                        </span>
                      </div>

                      <p className={`text-xs line-clamp-2 leading-relaxed ${isMirror ? 'text-slate-600' : 'text-slate-300'}`}>
                        {group.shortDescription}
                      </p>

                      {/* Member Avatars */}
                      <div className={`pt-2 border-t flex items-center justify-between ${isMirror ? 'border-slate-200' : 'border-slate-800/80'}`}>
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {group.members.slice(0, 4).map((m, idx) => (
                            <img
                              key={idx}
                              src={m.userAvatar}
                              alt={m.username}
                              referrerPolicy="no-referrer"
                              className="inline-block h-5 w-5 rounded-full ring-1 ring-white dark:ring-slate-900 object-cover"
                            />
                          ))}
                        </div>
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${isMirror ? 'text-emerald-800' : 'text-emerald-300/80'}`}>
                          <MessageSquare className="w-3 h-3" /> {group.forumSections.length} działów forum
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Join / View Group Button */}
                  <div className="p-4 pt-0 relative z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroupJoin(group.id);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isMember
                          ? isMirror
                            ? 'bg-slate-100 border border-emerald-400 text-emerald-900 hover:bg-rose-100 hover:border-rose-400 hover:text-rose-900'
                            : 'bg-slate-950 border border-emerald-500/30 text-emerald-300 hover:bg-rose-950/80 hover:border-rose-500/50 hover:text-rose-200'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      {isMember ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" /> Dołączono (Otwórz)
                        </>
                      ) : (
                        <>
                          <Shield className="w-3.5 h-3.5" /> Dołącz do Grupy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
