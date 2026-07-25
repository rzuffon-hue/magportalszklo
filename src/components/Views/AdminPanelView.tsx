import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompactHeader } from '../CompactHeader';
import {
  Users,
  ShieldAlert,
  FolderPlus,
  Trash2,
  Lock,
  Unlock,
  Plus,
  X,
  FileText,
  Video,
  Calendar,
  AlertTriangle,
  Globe,
  UserCheck,
  Shield
} from 'lucide-react';
import { UserRole, GroupVisibility } from '../../types';

export const AdminPanelView: React.FC = () => {
  const {
    profile,
    usersList,
    updateUserRole,
    updateUserAccountStatus,
    groups,
    createGroup,
    deleteGroup,
    posts,
    reels,
    events
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'groups' | 'content' | 'reports' | 'reels' | 'events'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');

  // New Group Form Modal State
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupShortDesc, setGroupShortDesc] = useState('');
  const [groupFullDesc, setGroupFullDesc] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('');
  const [groupCover, setGroupCover] = useState('');
  const [groupCategory, setGroupCategory] = useState('Społeczność');
  const [groupVisibility, setGroupVisibility] = useState<GroupVisibility>('PUBLICZNA');
  const [groupRules, setGroupRules] = useState('Szanuj innych członków i przestrzegaj zasad Portalu MaG.');

  // Access check
  if (profile.role !== 'ADMIN') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-1">Brak uprawnień</h2>
        <p className="text-sm text-slate-400 max-w-md">
          Dostęp do Panelu Administracyjnego jest zastrzeżony wyłącznie dla Administratorów Portalu MaG.
        </p>
      </div>
    );
  }

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase()) ||
    g.category.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    createGroup({
      name: groupName.trim(),
      shortDescription: groupShortDesc.trim() || 'Oficjalna grupa Portalu MaG',
      description: groupFullDesc.trim() || groupShortDesc.trim() || 'Brak rozszerzonego opisu.',
      avatarImage: groupAvatar.trim() || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
      coverImage: groupCover.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
      category: groupCategory,
      visibility: groupVisibility,
      rules: groupRules
    });

    // Reset
    setGroupName('');
    setGroupShortDesc('');
    setGroupFullDesc('');
    setGroupAvatar('');
    setGroupCover('');
    setShowCreateGroupModal(false);
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Compact Header */}
      <CompactHeader
        title="Panel Administracyjny Portalu"
        badge="Uprawnienia Admina"
      />

      {/* Main Container */}
      <div className="flex-1 app-scroll-container p-3 sm:p-5 max-w-6xl mx-auto w-full space-y-4">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {[
            { id: 'users', label: 'Użytkownicy', icon: Users, count: usersList.length },
            { id: 'groups', label: 'Grupy', icon: FolderPlus, count: groups.length },
            { id: 'content', label: 'Treści', icon: FileText, count: posts.length },
            { id: 'reports', label: 'Zgłoszenia', icon: AlertTriangle, count: 0 },
            { id: 'reels', label: 'Reels', icon: Video, count: reels.length },
            { id: 'events', label: 'Wydarzenia', icon: Calendar, count: events.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/20 text-black' : 'bg-slate-800 text-amber-300'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: UŻYTKOWNICY ================= */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Szukaj kont użytkowników po nazwie lub roli..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full sm:w-80 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <span className="text-xs text-slate-400 font-medium">
                Znaleziono: <strong className="text-amber-300">{filteredUsers.length}</strong>
              </span>
            </div>

            <div className="space-y-2.5">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                  Brak kont spełniających kryteria wyszukiwania.
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* User info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{u.name}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              u.role === 'ADMIN'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                : u.role === 'MODERATOR'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                          {u.accountStatus === 'blocked' && (
                            <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                              ZABLOKOWANE
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Poziom {u.level} • Dołączono: {u.createdAt || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Role selector */}
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-200 font-bold focus:outline-none focus:border-amber-400"
                      >
                        <option value="USER">Role: USER</option>
                        <option value="MODERATOR">Role: MODERATOR</option>
                        <option value="ADMIN">Role: ADMIN</option>
                      </select>

                      {/* Block / Unblock Toggle */}
                      {u.accountStatus === 'blocked' ? (
                        <button
                          onClick={() => updateUserAccountStatus(u.id, 'active')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900 text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <Unlock className="w-3.5 h-3.5" /> Odblokuj
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserAccountStatus(u.id, 'blocked')}
                          disabled={u.id === profile.id}
                          className="px-3 py-1.5 rounded-xl bg-rose-950 border border-rose-500/50 text-rose-300 hover:bg-rose-900 text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Lock className="w-3.5 h-3.5" /> Zablokuj
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: GRUPY ================= */}
        {activeTab === 'groups' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Szukaj grupy..."
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                className="w-full sm:w-80 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />

              <button
                onClick={() => setShowCreateGroupModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> UTWÓRZ OFICJALNĄ GRUPĘ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredGroups.length === 0 ? (
                <div className="col-span-full p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                  Brak grup w portalu. Kliknij "+ UTWÓRZ OFICJALNĄ GRUPĘ", aby stworzyć pierwszą grupę.
                </div>
              ) : (
                filteredGroups.map((g) => (
                  <div
                    key={g.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={g.avatarImage}
                          alt={g.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500/30 shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{g.name}</h4>
                          <span className="text-[11px] text-amber-300 font-medium">
                            {g.category} • {g.membersCount} członków
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          g.visibility === 'PUBLICZNA'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                            : 'bg-purple-950 text-purple-300 border-purple-500/40'
                        }`}
                      >
                        {g.visibility}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{g.shortDescription}</p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Stworzono: {g.createdAt}</span>
                      <button
                        onClick={() => deleteGroup(g.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900 text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3 h-3" /> Usuń grupę
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= OTHER TABS SUMMARY ================= */}
        {activeTab === 'content' && (
          <div className="p-6 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2">
            <FileText className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="font-bold text-sm text-white">Moduł Zarządzania Treściami</p>
            <p className="text-slate-400">Łącznie {posts.length} postów w Portalu. Administrator może usuwać treści naruszające regulamin.</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2">
            <AlertTriangle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-bold text-sm text-white">Kolejka Zgłoszeń</p>
            <p className="text-slate-400">Brak aktywnych zgłoszeń naruszenia zasad. Portal funkcjonuje prawidłowo.</p>
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="p-6 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2">
            <Video className="w-8 h-8 text-purple-400 mx-auto" />
            <p className="font-bold text-sm text-white">Moduł Moderacji Reels</p>
            <p className="text-slate-400">Łącznie {reels.length} opublikowanych rolek w Portalu MaG.</p>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="p-6 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2">
            <Calendar className="w-8 h-8 text-sky-400 mx-auto" />
            <p className="font-bold text-sm text-white">Wydarzenia Społeczności</p>
            <p className="text-slate-400">Zarządzanie {events.length} aktywnymi wydarzeniami w Portalu.</p>
          </div>
        )}
      </div>

      {/* ================= MODAL: TWORZENIE GRUPY ================= */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-500/40 rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-400" /> Tworzenie Nowej Grupy Portalu
              </h3>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nazwa Grupy *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Gildia Poszukiwaczy Przygód"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Kategoria</label>
                  <select
                    value={groupCategory}
                    onChange={(e) => setGroupCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Społeczność">Społeczność</option>
                    <option value="Gry i E-sport">Gry i E-sport</option>
                    <option value="RPG i Fantastyka">RPG i Fantastyka</option>
                    <option value="Muzyka i Sztuka">Muzyka i Sztuka</option>
                    <option value="Technologia">Technologia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Widoczność</label>
                  <select
                    value={groupVisibility}
                    onChange={(e) => setGroupVisibility(e.target.value as GroupVisibility)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="PUBLICZNA">PUBLICZNA (Otwarta)</option>
                    <option value="PRYWATNA">PRYWATNA (Wymaga akceptacji)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Krótki opis</label>
                <input
                  type="text"
                  placeholder="Zwięzłe podsumowanie celu grupy..."
                  value={groupShortDesc}
                  onChange={(e) => setGroupShortDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Pełny opis</label>
                <textarea
                  rows={3}
                  placeholder="Szczegółowe informacje o grupie, społeczności, tematach dyskusji..."
                  value={groupFullDesc}
                  onChange={(e) => setGroupFullDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">URL Avatara (opcjonalnie)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={groupAvatar}
                    onChange={(e) => setGroupAvatar(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">URL Okładki (opcjonalnie)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={groupCover}
                    onChange={(e) => setGroupCover(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Zasady Grupy</label>
                <textarea
                  rows={2}
                  value={groupRules}
                  onChange={(e) => setGroupRules(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-500/20"
                >
                  Stwórz Grupę
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
