import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Group,
  ForumSection,
  ForumTopic
} from '../../../types';
import { ForumSectionView } from './ForumSectionView';
import { TopicDetailView } from './TopicDetailView';
import {
  ArrowLeft,
  Users,
  Shield,
  UserCheck,
  MessageSquare,
  FileText,
  Info,
  Plus,
  X,
  Lock,
  Globe,
  FolderPlus,
  Send,
  Heart,
  MessageCircle,
  Megaphone,
  Pin,
  Trash2,
  CheckCircle,
  XCircle,
  UserPlus
} from 'lucide-react';

interface GroupDetailViewProps {
  group: Group;
  onBack: () => void;
}

export const GroupDetailView: React.FC<GroupDetailViewProps> = ({ group, onBack }) => {
  const {
    profile,
    toggleGroupJoin,
    handleJoinRequest,
    addForumSection,
    addWallPost,
    addWallPostComment,
    likeWallPost,
    addAnnouncement,
    deleteAnnouncement,
    updateGroup,
    portalTheme
  } = useApp();
  const isMirror = portalTheme === 'lustrzany';

  const [activeTab, setActiveTab] = useState<'forum' | 'tablica' | 'members' | 'info'>('forum');

  // Forum navigation state
  const [selectedSection, setSelectedSection] = useState<ForumSection | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);

  // New Forum Section Modal
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [sectionDesc, setSectionDesc] = useState('');

  // Wall post state
  const [wallContent, setWallContent] = useState('');
  const [wallImage, setWallImage] = useState('');
  const [showWallMedia, setShowWallMedia] = useState(false);

  // Announcement state
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  const isPortalAdmin = profile.role === 'ADMIN';
  const isGroupOwner = group.ownerId === profile.id;
  const currentUserMember = group.members.find(m => m.userId === profile.id);
  const isGroupMod = currentUserMember?.role === 'MODERATOR' || currentUserMember?.role === 'OWNER';
  const canModerate = isPortalAdmin || isGroupMod;

  const isMember = Boolean(currentUserMember);
  const isPendingRequest = group.joinRequests.some(r => r.userId === profile.id);

  // Handle nested topic view
  if (selectedTopic && selectedSection) {
    // Keep topic reference fresh from global context
    const currentGroup = group;
    const freshTopic = currentGroup.forumTopics.find(t => t.id === selectedTopic.id) || selectedTopic;
    const freshSection = currentGroup.forumSections.find(s => s.id === selectedSection.id) || selectedSection;

    return (
      <TopicDetailView
        group={currentGroup}
        section={freshSection}
        topic={freshTopic}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  // Handle nested section view
  if (selectedSection) {
    const freshSection = group.forumSections.find(s => s.id === selectedSection.id) || selectedSection;

    return (
      <ForumSectionView
        group={group}
        section={freshSection}
        onBack={() => setSelectedSection(null)}
        onSelectTopic={(topic) => setSelectedTopic(topic)}
      />
    );
  }

  const handleCreateSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName.trim()) return;

    addForumSection(group.id, {
      name: sectionName.trim(),
      description: sectionDesc.trim() || 'Dział dyskusyjny'
    });

    setSectionName('');
    setSectionDesc('');
    setShowAddSectionModal(false);
  };

  const handleWallPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallContent.trim()) return;

    addWallPost(group.id, {
      content: wallContent.trim(),
      image: wallImage.trim() || undefined
    });

    setWallContent('');
    setWallImage('');
    setShowWallMedia(false);
  };

  const handleAddAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement(group.id, annTitle.trim(), annContent.trim(), true);

    setAnnTitle('');
    setAnnContent('');
    setShowAddAnnouncementModal(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Group Header & Cover Banner */}
      <div className={`rounded-3xl border overflow-hidden shadow-md relative ${
        isMirror ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800 shadow-2xl'
      }`}>
        {/* Cover */}
        <div
          className="h-36 sm:h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${group.coverImage})` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-t ${
            isMirror ? 'from-white/95 via-white/40 to-black/20' : 'from-slate-950 via-slate-950/40 to-black/30'
          }`} />

          {/* Top navigation overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <button
              onClick={onBack}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold backdrop-blur-md transition-all cursor-pointer ${
                isMirror
                  ? 'bg-white/90 border-slate-300 text-slate-900 hover:bg-slate-100'
                  : 'bg-slate-950/80 border-slate-700/60 text-slate-100 hover:bg-slate-900'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Wróć do spisu grup
            </button>

            <span
              className={`text-[10px] px-2.5 py-1 rounded-full font-bold border backdrop-blur-md ${
                group.visibility === 'PUBLICZNA'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : 'bg-purple-950/80 text-purple-300 border-purple-500/50'
              }`}
            >
              {group.visibility === 'PUBLICZNA' ? (
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> PUBLICZNA</span>
              ) : (
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> PRYWATNA</span>
              )}
            </span>
          </div>
        </div>

        {/* Group Identity Card */}
        <div className="p-4 sm:p-5 relative -mt-10 sm:-mt-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-3.5">
            <img
              src={group.avatarImage}
              alt={group.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-slate-950 shadow-2xl shrink-0"
            />
            <div className="space-y-1">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                {group.category}
              </span>
              <h1 className="text-lg sm:text-xl font-black text-white font-serif">{group.name}</h1>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <Users className="w-3.5 h-3.5" /> {group.membersCount} członków
                </span>
                • Stworzono: {group.createdAt}
              </p>
            </div>
          </div>

          {/* Join / Leave Action Button */}
          <div className="w-full sm:w-auto shrink-0">
            <button
              onClick={() => toggleGroupJoin(group.id)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                isMember
                  ? 'bg-slate-950 border border-emerald-500/40 text-emerald-300 hover:bg-rose-950/80 hover:border-rose-500/50 hover:text-rose-200'
                  : isPendingRequest
                  ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
              }`}
            >
              {isMember ? (
                <>
                  <UserCheck className="w-4 h-4" /> Jesteś członkiem (Opuść)
                </>
              ) : isPendingRequest ? (
                <>
                  <UserPlus className="w-4 h-4" /> Prośba wysłana (Anuluj)
                </>
              ) : group.visibility === 'PUBLICZNA' ? (
                <>
                  <Shield className="w-4 h-4" /> Dołącz do Grupy
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Wyślij prośbę o dołączenie
                </>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-5 pb-3 border-t border-slate-800/80 pt-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'forum', label: 'FORUM', icon: MessageSquare, count: group.forumSections.length },
            { id: 'tablica', label: 'TABLICA', icon: FileText, count: group.wallPosts.length },
            { id: 'members', label: 'CZŁONKOWIE', icon: Users, count: group.members.length },
            { id: 'info', label: 'INFO I ZASADY', icon: Info, count: group.announcements.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/30 text-white' : 'bg-slate-900 text-emerald-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: FORUM ================= */}
      {activeTab === 'forum' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Działy Forum Grupy
            </h2>

            {canModerate && (
              <button
                onClick={() => setShowAddSectionModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Plus className="w-4 h-4" /> DODAJ DZIAŁ FORUM
              </button>
            )}
          </div>

          {/* Forum Sections Grid */}
          <div className="space-y-3">
            {group.forumSections.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl text-slate-400 text-xs space-y-2">
                <FolderPlus className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-300">Forum tej grupy jest puste</p>
                <p className="text-slate-500">
                  {canModerate
                    ? 'Jako Administrator / Moderator grupy możesz stworzyć pierwszy Dział Forum klikając "+ DODAJ DZIAŁ FORUM".'
                    : 'Brak stworzonych działów forum.'}
                </p>
              </div>
            ) : (
              group.forumSections.map((sec) => {
                const topicsInSec = group.forumTopics.filter(t => t.sectionId === sec.id);

                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSection(sec)}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {sec.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">{sec.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                        {topicsInSec.length} tematów
                      </span>
                      <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                        Otwórz →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: TABLICA (WALL) ================= */}
      {activeTab === 'tablica' && (
        <div className="space-y-4">
          {/* Post box */}
          {isMember || canModerate ? (
            <form onSubmit={handleWallPostSubmit} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" /> Napisz coś na tablicy grupy
                </span>
                <button
                  type="button"
                  onClick={() => setShowWallMedia(!showWallMedia)}
                  className="text-[11px] text-emerald-400 font-semibold"
                >
                  {showWallMedia ? 'Ukryj multimedia' : '+ Dodaj zdjęcie'}
                </button>
              </div>

              <textarea
                rows={3}
                placeholder="Podziel się czymś z resztą grupy..."
                value={wallContent}
                onChange={(e) => setWallContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />

              {showWallMedia && (
                <input
                  type="url"
                  placeholder="URL zdjęcia..."
                  value={wallImage}
                  onChange={(e) => setWallImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!wallContent.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Opublikuj post
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
              Musisz dołączyć do grupy, aby móc publikować wpisy na tablicy.
            </div>
          )}

          {/* Wall Posts Stream */}
          <div className="space-y-3">
            {group.wallPosts.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                Tablica tej grupy jest pusta. Bądź pierwszy i opublikuj post!
              </div>
            ) : (
              group.wallPosts.map((wp) => {
                const hasLiked = wp.likes.includes(profile.id);

                return (
                  <div
                    key={wp.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={wp.authorAvatar}
                        alt={wp.authorName}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <span className="text-xs font-bold text-white">{wp.authorName}</span>
                        <span className="text-[10px] text-slate-500 block">{wp.createdAt}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {wp.content}
                    </p>

                    {wp.image && (
                      <img
                        src={wp.image}
                        alt="Media"
                        referrerPolicy="no-referrer"
                        className="max-h-72 rounded-xl object-cover border border-slate-800 w-full"
                      />
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => likeWallPost(group.id, wp.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                          hasLiked
                            ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                        <span>{wp.likes.length} polubień</span>
                      </button>

                      <span className="text-slate-400 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> {wp.comments.length} komentarzy
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: CZŁONKOWIE (MEMBERS & REQUESTS) ================= */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          {/* Pending Join Requests section if Private group and user is owner/mod/admin */}
          {canModerate && group.joinRequests.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
              <h3 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Oczekujące prośby o dołączenie ({group.joinRequests.length})
              </h3>

              <div className="space-y-2">
                {group.joinRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={req.userAvatar}
                        alt={req.username}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="text-xs font-bold text-white">{req.username}</span>
                        <span className="text-[10px] text-slate-500 block">Wysłano: {req.requestedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleJoinRequest(group.id, req.id, true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Akceptuj
                      </button>
                      <button
                        onClick={() => handleJoinRequest(group.id, req.id, false)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-bold flex items-center gap-1 transition-all border border-rose-500/40"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Odrzuć
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member List */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-white font-serif">Lista członków ({group.members.length})</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.members.map((mem) => (
                <div
                  key={mem.userId}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={mem.userAvatar}
                      alt={mem.username}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {mem.username}
                        {mem.role === 'OWNER' && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 rounded font-mono">
                            WŁAŚCICIEL
                          </span>
                        )}
                        {mem.role === 'MODERATOR' && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1.5 rounded font-mono">
                            MODERATOR
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Dołączono: {mem.joinedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: INFO & ANNOUNCEMENTS ================= */}
      {activeTab === 'info' && (
        <div className="space-y-4">
          {/* Rules & Details Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Pełny Opis Grupy</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{group.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Zasady Grupy
              </h3>
              <p className="text-xs text-slate-300 whitespace-pre-wrap bg-slate-950 p-3 rounded-xl border border-slate-800">
                {group.rules}
              </p>
            </div>
          </div>

          {/* Group Announcements Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                <Megaphone className="w-4 h-4 text-amber-400" /> Ogłoszenia Grupy ({group.announcements.length})
              </h3>

              {canModerate && (
                <button
                  onClick={() => setShowAddAnnouncementModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> DODAJ OGŁOSZENIE
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {group.announcements.length === 0 ? (
                <div className="p-6 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-xs text-slate-400">
                  Brak przypiętych ogłoszeń.
                </div>
              ) : (
                group.announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                        <Pin className="w-3.5 h-3.5 text-amber-400" /> {ann.title}
                      </span>
                      {canModerate && (
                        <button
                          onClick={() => deleteAnnouncement(group.id, ann.id)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300"
                          title="Usuń"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{ann.content}</p>
                    <span className="text-[10px] text-slate-500 block">Autor: {ann.authorName} • {ann.createdAt}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DODAWANIE DZIAŁU FORUM ================= */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-emerald-400" /> Tworzenie Nowego Działu Forum
              </h3>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nazwa Działu *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Hydepark, Poradniki, Dyskusje..."
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Opis Działu</label>
                <textarea
                  rows={2}
                  placeholder="Krótka informacja o czym jest ten dział..."
                  value={sectionDesc}
                  onChange={(e) => setSectionDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-500/20"
                >
                  Stwórz Dział
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DODAWANIE OGŁOSZENIA ================= */}
      {showAddAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-500/40 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" /> Nowe Ogłoszenie Grupy
              </h3>
              <button
                onClick={() => setShowAddAnnouncementModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAnnouncementSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tytuł ogłoszenia *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Ważny komunikat, Zmiana zasad..."
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Treść ogłoszenia *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Treść komunikatu..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAnnouncementModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 font-bold"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-500/20"
                >
                  Opublikuj Ogłoszenie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
