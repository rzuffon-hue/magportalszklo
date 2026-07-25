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
  Shield,
  Megaphone,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  Sparkles,
  ExternalLink,
  Trophy,
  Gamepad2,
  RefreshCw,
  Info,
  Check
} from 'lucide-react';
import {
  UserRole,
  GroupVisibility,
  AnnouncementCategory,
  AnnouncementRequirement,
  PortalAnnouncement,
  AppView
} from '../../types';

export const AdminPanelView: React.FC = () => {
  const {
    profile,
    usersList,
    updateUserRole,
    updateUserAccountStatus,
    updateUserPermissions,
    groups,
    createGroup,
    deleteGroup,
    posts,
    reels,
    events,
    announcements,
    createPortalAnnouncement,
    deletePortalAnnouncement,
    setPreviewAnnouncement
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'users' | 'groups' | 'content' | 'reports' | 'reels' | 'events' | 'announcements'
  >('announcements');

  const [userSearch, setUserSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [announcementFilterStatus, setAnnouncementFilterStatus] = useState<
    'all' | 'active' | 'scheduled' | 'completed'
  >('all');

  // New Group Form Modal State
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupShortDesc, setGroupShortDesc] = useState('');
  const [groupFullDesc, setGroupFullDesc] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('');
  const [groupCover, setGroupCover] = useState('');
  const [groupCategory, setGroupCategory] = useState('Społeczność');
  const [groupVisibility, setGroupVisibility] = useState<GroupVisibility>('PUBLICZNA');
  const [groupRules, setGroupRules] = useState(
    'Szanuj innych członków i przestrzegaj zasad Portalu MaG.'
  );

  // New Announcement Form State
  const [showCreateAnnModal, setShowCreateAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<AnnouncementCategory>('WAŻNE');
  const [annRequirement, setAnnRequirement] = useState<AnnouncementRequirement>('WYMAGA_POTWIERDZENIA');
  const [annEventDate, setAnnEventDate] = useState('');
  const [annEventTime, setAnnEventTime] = useState('');
  const [annLinkUrl, setAnnLinkUrl] = useState('');
  const [annImageUrl, setAnnImageUrl] = useState('');
  const [annPortalTarget, setAnnPortalTarget] = useState<AppView | ''>('');
  const [annCtaLabel, setAnnCtaLabel] = useState('');
  const [annPublishType, setAnnPublishType] = useState<'now' | 'scheduled'>('now');
  const [annScheduledAt, setAnnScheduledAt] = useState('');
  const [annExpiresAt, setAnnExpiresAt] = useState('');

  // Read Confirmation Detailed Tracking Modal State
  const [trackingAnnouncement, setTrackingAnnouncement] = useState<PortalAnnouncement | null>(null);
  const [trackingUserSearch, setTrackingUserSearch] = useState('');

  // Access check: ADMIN or MODERATOR with permissions
  const canCreateAnnouncements =
    profile.role === 'ADMIN' ||
    (profile.role === 'MODERATOR' && profile.permissions?.includes('create_announcements'));

  if (!canCreateAnnouncements) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-1">Brak uprawnień</h2>
        <p className="text-sm text-slate-400 max-w-md">
          Dostęp do Panelu Administracyjnego jest zastrzeżony dla Administratorów i Uprawnionych Moderatorów Portalu MaG.
        </p>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(groupSearch.toLowerCase()) ||
      g.category.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(announcementSearch.toLowerCase()) ||
      ann.content.toLowerCase().includes(announcementSearch.toLowerCase()) ||
      ann.category.toLowerCase().includes(announcementSearch.toLowerCase());

    if (announcementFilterStatus === 'all') return matchesSearch;
    return matchesSearch && ann.status === announcementFilterStatus;
  });

  // Handle Create Group
  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    createGroup({
      name: groupName.trim(),
      shortDescription: groupShortDesc.trim() || 'Oficjalna grupa Portalu MaG',
      description: groupFullDesc.trim() || groupShortDesc.trim() || 'Brak rozszerzonego opisu.',
      avatarImage:
        groupAvatar.trim() ||
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
      coverImage:
        groupCover.trim() ||
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
      category: groupCategory,
      visibility: groupVisibility,
      rules: groupRules
    });

    setGroupName('');
    setGroupShortDesc('');
    setGroupFullDesc('');
    setGroupAvatar('');
    setGroupCover('');
    setShowCreateGroupModal(false);
  };

  // Build temporary object for live preview
  const buildCurrentFormAnnouncement = (): PortalAnnouncement => ({
    id: 'preview_temp',
    title: annTitle.trim() || 'PODGLĄD TYTUŁU OGŁOSZENIA',
    content:
      annContent.trim() ||
      'Tutaj znajduje się treść Twojego ogłoszenia. Ogłoszenie ma wygląd kolorowej, oszronionej szklanej tafli dostosowanej do wybranej kategorii.',
    category: annCategory,
    requirement: annRequirement,
    eventDate: annEventDate.trim() || undefined,
    eventTime: annEventTime.trim() || undefined,
    linkUrl: annLinkUrl.trim() || undefined,
    imageUrl: annImageUrl.trim() || undefined,
    portalTargetView: annPortalTarget ? annPortalTarget : undefined,
    ctaLabel: annCtaLabel.trim() || undefined,
    publishType: annPublishType,
    scheduledPublishAt: annScheduledAt.trim() || undefined,
    expiresAt: annExpiresAt.trim() || undefined,
    createdByUserId: profile.id,
    createdByName: profile.name,
    createdByAvatar: profile.avatar,
    createdAt: 'Dzisiaj, teraz',
    status: annPublishType === 'now' ? 'active' : 'scheduled',
    confirmations: []
  });

  // Handle Preview Click
  const handleTriggerPreview = () => {
    const annPreview = buildCurrentFormAnnouncement();
    setPreviewAnnouncement(annPreview);
  };

  // Handle Create Announcement Submit
  const handleCreateAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    createPortalAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      category: annCategory,
      requirement: annRequirement,
      eventDate: annEventDate.trim() || undefined,
      eventTime: annEventTime.trim() || undefined,
      linkUrl: annLinkUrl.trim() || undefined,
      imageUrl: annImageUrl.trim() || undefined,
      portalTargetView: annPortalTarget ? annPortalTarget : undefined,
      ctaLabel: annCtaLabel.trim() || undefined,
      publishType: annPublishType,
      scheduledPublishAt: annScheduledAt.trim() || undefined,
      expiresAt: annExpiresAt.trim() || undefined,
      status: annPublishType === 'now' ? 'active' : 'scheduled'
    });

    // Reset Form
    setAnnTitle('');
    setAnnContent('');
    setAnnCategory('WAŻNE');
    setAnnRequirement('WYMAGA_POTWIERDZENIA');
    setAnnEventDate('');
    setAnnEventTime('');
    setAnnLinkUrl('');
    setAnnImageUrl('');
    setAnnPortalTarget('');
    setAnnCtaLabel('');
    setAnnPublishType('now');
    setAnnScheduledAt('');
    setAnnExpiresAt('');
    setShowCreateAnnModal(false);
  };

  const activeAnnouncementsCount = announcements.filter((a) => a.status === 'active').length;

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Compact Header */}
      <CompactHeader title="Panel Zarządzania Portalu" badge="Uprawnienia Administracyjne" />

      {/* Main Container */}
      <div className="flex-1 app-scroll-container p-3 sm:p-5 max-w-6xl mx-auto w-full space-y-4">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {[
            { id: 'announcements', label: 'Ogłoszenia', icon: Megaphone, count: activeAnnouncementsCount },
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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

        {/* ================= TAB 0: OGŁOSZENIA ================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {/* Header controls & create button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white font-serif">
                    System Ogłoszeń Administracyjnych
                  </h3>
                  <p className="text-xs text-slate-400">
                    Twórz i publikuj kolorowe szklane tafle ogłoszeń z wymogiem potwierdzenia przeczytania.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateAnnModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ UTWÓRZ OGŁOSZENIE</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Szukaj ogłoszenia po tytule, treści lub kategorii..."
                  value={announcementSearch}
                  onChange={(e) => setAnnouncementSearch(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['all', 'active', 'scheduled', 'completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setAnnouncementFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${
                      announcementFilterStatus === st
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st === 'all'
                      ? 'WSZYSTKIE'
                      : st === 'active'
                      ? 'AKTYWNE'
                      : st === 'scheduled'
                      ? 'ZAPLANOWANE'
                      : 'ZAKOŃCZONE'}
                  </button>
                ))}
              </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-3">
              {filteredAnnouncements.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                  Brak ogłoszeń spełniających wybrane kryteria.
                </div>
              ) : (
                filteredAnnouncements.map((ann) => {
                  const totalUsers = usersList.length || 1;
                  const confirmedCount = ann.confirmations?.filter((c) => Boolean(c.confirmedAt)).length || 0;
                  const confirmPct = Math.round((confirmedCount / totalUsers) * 100);

                  return (
                    <div
                      key={ann.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                    >
                      {/* Info & Category */}
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                            {ann.category}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              ann.requirement === 'WYMAGA_POTWIERDZENIA'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {ann.requirement === 'WYMAGA_POTWIERDZENIA'
                              ? 'WYMAGA POTWIERDZENIA'
                              : 'ZWYKŁE'}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              ann.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : ann.status === 'scheduled'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {ann.status === 'active'
                              ? 'AKTYWNE'
                              : ann.status === 'scheduled'
                              ? 'ZAPLANOWANE'
                              : 'ZAKOŃCZONE'}
                          </span>

                          <span className="text-[11px] text-slate-500 font-mono ml-auto sm:ml-0">
                            {ann.createdAt}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white font-serif tracking-tight truncate">
                          {ann.title}
                        </h4>

                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {ann.content}
                        </p>

                        {/* Read confirmation progress bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-400">
                              Potwierdziło przeczytanie:
                            </span>
                            <span className="text-amber-300 font-mono">
                              {confirmedCount} / {totalUsers} ({confirmPct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                              style={{ width: `${Math.min(100, confirmPct)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 sm:flex-col shrink-0 justify-end">
                        <button
                          onClick={() => setPreviewAnnouncement(ann)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Podgląd</span>
                        </button>

                        <button
                          onClick={() => setTrackingAnnouncement(ann)}
                          className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Kto Przeczytał</span>
                        </button>

                        <button
                          onClick={() => deletePortalAnnouncement(ann.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Usuń</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

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
                filteredUsers.map((u) => {
                  const hasAnnPermission = u.permissions?.includes('create_announcements');

                  return (
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
                          <span className="text-xs text-slate-400">{u.title}</span>
                        </div>
                      </div>

                      {/* Controls & Moderator Permissions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Moderator Announcement Permission Toggle */}
                        {u.role === 'MODERATOR' && (
                          <button
                            onClick={() => {
                              const updated = hasAnnPermission
                                ? (u.permissions || []).filter((p) => p !== 'create_announcements')
                                : [...(u.permissions || []), 'create_announcements'];
                              updateUserPermissions(u.id, updated);
                            }}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                              hasAnnPermission
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            <Megaphone className="w-3 h-3" />
                            <span>Tworzenie Ogłoszeń: {hasAnnPermission ? 'TAK' : 'NIE'}</span>
                          </button>
                        )}

                        {/* Role selector */}
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                          className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-amber-500"
                        >
                          <option value="USER">Użytkownik</option>
                          <option value="MODERATOR">Moderator</option>
                          <option value="ADMIN">Administrator</option>
                        </select>

                        {/* Block/Unblock */}
                        <button
                          onClick={() =>
                            updateUserAccountStatus(
                              u.id,
                              u.accountStatus === 'active' ? 'blocked' : 'active'
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            u.accountStatus === 'active'
                              ? 'bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300'
                              : 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300'
                          }`}
                        >
                          {u.accountStatus === 'active' ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>Zablokuj</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Odblokuj</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
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
                placeholder="Szukaj grup społecznościowych..."
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                className="w-full sm:w-80 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => setShowCreateGroupModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
              >
                <FolderPlus className="w-4 h-4" />
                <span>UTWÓRZ NOWĄ GRUPĘ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredGroups.map((g) => (
                <div
                  key={g.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={g.avatarImage}
                      alt={g.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-amber-500/30"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{g.name}</h4>
                      <p className="text-xs text-slate-400">{g.shortDescription}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteGroup(g.id)}
                    className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900 transition-all cursor-pointer shrink-0"
                    title="Usuń grupę"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {(activeTab === 'content' ||
          activeTab === 'reports' ||
          activeTab === 'reels' ||
          activeTab === 'events') && (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            Sekcja zarządzania w przygotowaniu.
          </div>
        )}
      </div>

      {/* ================= MODAL 1: CREATE ANNOUNCEMENT FORM ================= */}
      {showCreateAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden">
          <div className="relative w-full max-w-2xl max-h-[calc(100dvh-2rem)] flex flex-col rounded-3xl bg-slate-950 border border-amber-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-serif">
                  Nowe Ogłoszenie Administracyjne
                </h3>
              </div>
              <button
                onClick={() => setShowCreateAnnModal(false)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form
              onSubmit={handleCreateAnnouncementSubmit}
              className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4 custom-scrollbar text-xs"
            >
              {/* Title */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">TYTUŁ OGŁOSZENIA *</label>
                <input
                  type="text"
                  required
                  placeholder="np. PUŁAPKA NA NIEDŹWIEDZIA - ZBIÓRKA SOJUSZU"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">TREŚĆ OGŁOSZENIA *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Wpisz pełną treść ogłoszenia przekazywaną użytkownikom..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Category & Requirement Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">KATEGORIA</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as AnnouncementCategory)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="WAŻNE">🔴 WAŻNE</option>
                    <option value="TURNIEJ">🏆 TURNIEJ</option>
                    <option value="WYDARZENIE">📅 WYDARZENIE</option>
                    <option value="GRY">🎮 GRY</option>
                    <option value="SOJUSZ">🛡️ SOJUSZ</option>
                    <option value="AKTUALIZACJA">🔄 AKTUALIZACJA</option>
                    <option value="OSTRZEŻENIE">⚠️ OSTRZEŻENIE</option>
                    <option value="INFORMACJA">ℹ️ INFORMACJA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">WYMÓG POTWIERDZENIA</label>
                  <select
                    value={annRequirement}
                    onChange={(e) =>
                      setAnnRequirement(e.target.value as AnnouncementRequirement)
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="WYMAGA_POTWIERDZENIA">
                      ✅ WYMAGA POTWIERDZENIA (Obowiązkowe)
                    </option>
                    <option value="ZWYKŁE">ℹ️ ZWYKŁE (Można zamknąć)</option>
                  </select>
                </div>
              </div>

              {/* Event Date & Time */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="block font-bold text-amber-300">
                  📅 Opcjonalnie: Termin Wydarzenia
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Data (np. Dzisiaj, 2026-07-28)</label>
                    <input
                      type="text"
                      placeholder="Dzisiaj"
                      value={annEventDate}
                      onChange={(e) => setAnnEventDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Godzina (np. 20:00)</label>
                    <input
                      type="text"
                      placeholder="20:00"
                      value={annEventTime}
                      onChange={(e) => setAnnEventTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Graphic Image & Link */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="block font-bold text-cyan-300">
                  🖼️ Opcjonalnie: Nagłówek Graficzny & Link
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="URL grafiki (https://...)"
                    value={annImageUrl}
                    onChange={(e) => setAnnImageUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Załączony Link (https://...)"
                    value={annLinkUrl}
                    onChange={(e) => setAnnLinkUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              {/* Portal Navigation CTA Link */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="block font-bold text-purple-300">
                  🔗 Opcjonalnie: Przycisk Nawigacji w Portalu
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Cel nawigacji</label>
                    <select
                      value={annPortalTarget}
                      onChange={(e) => setAnnPortalTarget(e.target.value as AppView | '')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    >
                      <option value="">Brak nawigacji</option>
                      <option value="wydarzenia">Wydarzenia</option>
                      <option value="gry">Gry / Turnieje</option>
                      <option value="czaty">Czaty / Komunikator</option>
                      <option value="grupy">Grupy</option>
                      <option value="sciana">Ściana</option>
                      <option value="reels">Reels</option>
                      <option value="profil">Profil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Etykieta Przycisku</label>
                    <input
                      type="text"
                      placeholder="np. ZOBACZ TURNIEJ"
                      value={annCtaLabel}
                      onChange={(e) => setAnnCtaLabel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Publish Type */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="block font-bold text-emerald-300">
                  ⏱️ Czas Publikacji & Wygasanie
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Publikacja</label>
                    <select
                      value={annPublishType}
                      onChange={(e) => setAnnPublishType(e.target.value as 'now' | 'scheduled')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    >
                      <option value="now">Opublikuj Teraz</option>
                      <option value="scheduled">Zaplanuj na później</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Wygasa (opcjonalnie)</label>
                    <input
                      type="text"
                      placeholder="np. 2026-08-01 23:59"
                      value={annExpiresAt}
                      onChange={(e) => setAnnExpiresAt(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons Row */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleTriggerPreview}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
                >
                  <Eye className="w-4 h-4" />
                  <span>[ PODGLĄD ]</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>OPUBLIKUJ OGŁOSZENIE</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: READ TRACKING DETAILED MODAL ================= */}
      {trackingAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden">
          <div className="relative w-full max-w-2xl max-h-[calc(100dvh-2rem)] flex flex-col rounded-3xl bg-slate-950 border border-purple-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-2 min-w-0">
                <UserCheck className="w-5 h-5 text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white font-serif truncate">
                    Status Przeczytania: {trackingAnnouncement.title}
                  </h3>
                  <span className="text-xs text-purple-300 font-bold uppercase">
                    Kategoria: {trackingAnnouncement.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setTrackingAnnouncement(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
              {/* Overall Progress Banner */}
              {(() => {
                const total = usersList.length || 1;
                const confirmedList =
                  trackingAnnouncement.confirmations?.filter((c) => Boolean(c.confirmedAt)) || [];
                const confirmedUserIds = new Set(confirmedList.map((c) => c.userId));
                const confirmedPct = Math.round((confirmedList.length / total) * 100);

                const confirmedUsers = usersList.filter(
                  (u) =>
                    confirmedUserIds.has(u.id) ||
                    confirmedList.some((c) => c.username === u.name)
                );
                const unconfirmedUsers = usersList.filter(
                  (u) => !confirmedUsers.some((cu) => cu.id === u.id)
                );

                const filterText = trackingUserSearch.toLowerCase();
                const filteredConfirmed = confirmedUsers.filter((u) =>
                  u.name.toLowerCase().includes(filterText)
                );
                const filteredUnconfirmed = unconfirmedUsers.filter((u) =>
                  u.name.toLowerCase().includes(filterText)
                );

                return (
                  <>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-300">Postęp Potwierdzeń:</span>
                        <span className="text-emerald-400 font-mono text-sm">
                          {confirmedList.length} / {total} ({confirmedPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, confirmedPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Search */}
                    <input
                      type="text"
                      placeholder="Filtruj użytkowników..."
                      value={trackingUserSearch}
                      onChange={(e) => setTrackingUserSearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                    />

                    {/* 1. CONFIRMED USERS SECTION */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                        <CheckCircle2 className="w-4 h-4" /> PRZECZYTALI I POTWIERDZILI (
                        {filteredConfirmed.length})
                      </h4>

                      <div className="space-y-1.5">
                        {filteredConfirmed.length === 0 ? (
                          <div className="p-3 text-slate-500 text-[11px] bg-slate-900/40 rounded-xl">
                            Brak potwierdzeń
                          </div>
                        ) : (
                          filteredConfirmed.map((u) => {
                            const confData = confirmedList.find(
                              (c) => c.userId === u.id || c.username === u.name
                            );
                            return (
                              <div
                                key={u.id}
                                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={u.avatar}
                                    alt={u.name}
                                    referrerPolicy="no-referrer"
                                    className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/50"
                                  />
                                  <span className="font-bold text-slate-100">{u.name}</span>
                                </div>
                                <span className="text-[11px] font-mono text-emerald-400/90 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                  ✓ {confData?.confirmedAt || 'Potwierdzono'}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* 2. UNCONFIRMED USERS SECTION */}
                    <div className="space-y-2 pt-2">
                      <h4 className="font-bold text-rose-400 flex items-center gap-1.5 uppercase">
                        <Clock className="w-4 h-4" /> NIE POTWIERDZILI JEŚZCZE (
                        {filteredUnconfirmed.length})
                      </h4>

                      <div className="space-y-1.5">
                        {filteredUnconfirmed.length === 0 ? (
                          <div className="p-3 text-slate-500 text-[11px] bg-slate-900/40 rounded-xl">
                            Wszyscy użytkownicy potwierdzili!
                          </div>
                        ) : (
                          filteredUnconfirmed.map((u) => (
                            <div
                              key={u.id}
                              className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center justify-between opacity-70"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                                />
                                <span className="font-bold text-slate-300">{u.name}</span>
                              </div>
                              <span className="text-[10px] font-bold text-rose-400/80 bg-rose-950/40 border border-rose-500/20 px-2 py-0.5 rounded-full">
                                Brak potwierdzenia
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CREATE GROUP ================= */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-amber-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-serif">Utwórz nową Grupę</h3>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
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
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Krótki opis *</label>
                <input
                  type="text"
                  required
                  value={groupShortDesc}
                  onChange={(e) => setGroupShortDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold"
                >
                  Utwórz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
