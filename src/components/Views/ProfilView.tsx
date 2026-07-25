import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AvatarWithFrame } from '../AvatarWithFrame';
import {
  Crown,
  Award,
  Edit3,
  Save,
  Users,
  Shield,
  ArrowRight,
  Camera,
  X,
  FileText,
  Video,
  Globe,
  Sparkles,
  Link as LinkIcon,
  Gamepad2,
  Check,
  Plus,
  Send,
  Heart,
  MessageSquare
} from 'lucide-react';
import { AvatarFrameStyle } from '../../types';

export const ProfilView: React.FC = () => {
  const {
    profile,
    setProfile,
    groups,
    setActiveView,
    posts,
    addPost,
    likePost,
    reels
  } = useApp();

  // Active Profile Tab: POSTY | MEDIA | OSIĄGNIĘCIA
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'achievements'>('posts');

  // New Post State inside POSTY tab
  const [newPostContent, setNewPostContent] = useState('');

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [editCover, setEditCover] = useState(profile.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200');
  const [editFrame, setEditFrame] = useState<AvatarFrameStyle>(profile.avatarFrame || 'standard');
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAlliance, setEditAlliance] = useState(profile.alliance || 'Sojusz MaG');
  const [editWosNick, setEditWosNick] = useState(profile.wosNick || '');
  const [editWosPlayerId, setEditWosPlayerId] = useState(profile.wosPlayerId || '');
  const [editStateCountry, setEditStateCountry] = useState(profile.stateCountry || 'State #142');
  const [editDiscord, setEditDiscord] = useState(profile.socialLinks?.discord || '');
  const [editYoutube, setEditYoutube] = useState(profile.socialLinks?.youtube || '');
  const [editFacebook, setEditFacebook] = useState(profile.socialLinks?.facebook || '');

  const myJoinedGroups = groups.filter(g => g.members.some(m => m.userId === profile.id));
  const myPosts = posts.filter(p => p.authorName === profile.name || p.authorId === profile.id);
  const myReels = reels.filter(r => r.authorName === profile.name);
  const xpPercent = Math.round((profile.xp / profile.maxXp) * 100);

  const handleOpenEditModal = () => {
    setEditName(profile.name);
    setEditAvatar(profile.avatar);
    setEditCover(profile.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200');
    setEditFrame(profile.avatarFrame || 'standard');
    setEditBio(profile.bio);
    setEditAlliance(profile.alliance || 'Sojusz MaG');
    setEditWosNick(profile.wosNick || '');
    setEditWosPlayerId(profile.wosPlayerId || '');
    setEditStateCountry(profile.stateCountry || 'State #142');
    setEditDiscord(profile.socialLinks?.discord || '');
    setEditYoutube(profile.socialLinks?.youtube || '');
    setEditFacebook(profile.socialLinks?.facebook || '');
    setShowEditModal(true);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditCover(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name: editName.trim() || prev.name,
      avatar: editAvatar,
      coverImage: editCover,
      avatarFrame: editFrame,
      bio: editBio,
      alliance: editAlliance,
      wosNick: editWosNick,
      wosPlayerId: editWosPlayerId,
      stateCountry: editStateCountry,
      socialLinks: {
        discord: editDiscord,
        youtube: editYoutube,
        facebook: editFacebook
      }
    }));
    setShowEditModal(false);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addPost(newPostContent.trim());
    setNewPostContent('');
  };

  const frameOptions: Array<{ id: AvatarFrameStyle; name: string; color: string; desc: string }> = [
    { id: 'standard', name: 'Standard', color: 'border-slate-600', desc: 'Minimalistyczna ramka szkła' },
    { id: 'ice', name: 'Ice', color: 'border-cyan-400 text-cyan-300', desc: 'Mroźny krystaliczny lód' },
    { id: 'gold', name: 'Gold', color: 'border-amber-400 text-amber-300', desc: 'Luksusowe polerowane złoto' },
    { id: 'emerald', name: 'Emerald', color: 'border-emerald-400 text-emerald-300', desc: 'Głęboki szmaragd magii' },
    { id: 'crimson', name: 'Crimson', color: 'border-rose-500 text-rose-300', desc: 'Wulkaniczny kryształ' },
    { id: 'mag', name: 'MaG', color: 'border-purple-500 text-purple-300', desc: 'Portalowa korona obsidianu' }
  ];

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 app-scroll-container p-0 sm:p-4 max-w-5xl mx-auto w-full space-y-4 pb-12">
        
        {/* Cover Photo & Avatar Header Banner */}
        <div className="relative rounded-none sm:rounded-3xl bg-slate-900 border-b sm:border border-slate-800 overflow-hidden shadow-2xl">
          {/* Cover Image */}
          <div className="h-44 sm:h-64 w-full relative bg-slate-950">
            <img
              src={profile.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200'}
              alt="Cover"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          {/* Overlapping Profile Info Bar */}
          <div className="px-4 sm:px-6 pb-5 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
            
            {/* Avatar & Main Titles */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative shrink-0">
                <AvatarWithFrame
                  src={profile.avatar}
                  alt={profile.name}
                  frame={profile.avatarFrame}
                  size="2xl"
                  className="shadow-2xl"
                />
              </div>

              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h1>
                  <span
                    className={`inline-block text-[11px] px-3 py-0.5 rounded-full font-black border ${
                      profile.role === 'ADMIN'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : profile.role === 'MODERATOR'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    ROLA: {profile.role}
                  </span>
                </div>

                <p className="text-xs text-amber-300 font-semibold">{profile.title}</p>
                <p className="text-xs text-slate-300 max-w-md line-clamp-2">{profile.bio}</p>
              </div>
            </div>

            {/* Action Edit Profile Button */}
            <button
              onClick={handleOpenEditModal}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
            >
              <Edit3 className="w-4 h-4" /> EDYTUJ PROFIL
            </button>
          </div>

          {/* XP Progress Bar */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" /> Poziom Użytkownika {profile.level}
                </span>
                <span className="text-slate-400 font-mono">{profile.xp} / {profile.maxXp} XP ({xpPercent}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs: POSTY | MEDIA | OSIĄGNIĘCIA */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 px-2 sm:px-0">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'posts'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> POSTY ({myPosts.length})
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'media'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" /> MEDIA ({myReels.length})
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'achievements'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" /> OSIĄGNIĘCIA I KARTA
          </button>
        </div>

        {/* TAB 1: POSTY */}
        {activeTab === 'posts' && (
          <div className="space-y-4 px-2 sm:px-0">
            {/* Create Post Form */}
            <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <AvatarWithFrame src={profile.avatar} frame={profile.avatarFrame} size="sm" />
                <input
                  type="text"
                  placeholder="Napisz coś na swojej ścianie..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs disabled:opacity-40"
                >
                  Opublikuj
                </button>
              </div>
            </form>

            {/* Posts List or Clean Empty State */}
            {myPosts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-white">Brak wpisów użytkownika</p>
                <p className="text-xs text-slate-400">Nie opublikowano jeszcze żadnych postów na Ścianie.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myPosts.map((post) => (
                  <div key={post.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <AvatarWithFrame src={post.authorAvatar} frame={profile.avatarFrame} size="sm" />
                      <div>
                        <span className="text-xs font-bold text-white block">{post.authorName}</span>
                        <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-200">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => likePost(post.id)}
                        className={`flex items-center gap-1 font-bold ${post.isLiked ? 'text-rose-400' : 'hover:text-white'}`}
                      >
                        <Heart className="w-3.5 h-3.5" /> {post.likes}
                      </button>
                      <span className="flex items-center gap-1 font-bold">
                        <MessageSquare className="w-3.5 h-3.5" /> {post.comments.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MEDIA */}
        {activeTab === 'media' && (
          <div className="px-2 sm:px-0">
            {myReels.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <Video className="w-8 h-8 text-purple-400 mx-auto" />
                <p className="text-sm font-bold text-white">Brak opublikowanych multimediów</p>
                <p className="text-xs text-slate-400">Twórz i udostępniaj rolki w sekcji REELS!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {myReels.map((reel) => (
                  <div key={reel.id} className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 group">
                    <img src={reel.videoBg} alt={reel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                      <span className="text-xs font-bold text-white truncate">{reel.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: OSIĄGNIĘCIA I KARTA GRACZA */}
        {activeTab === 'achievements' && (
          <div className="space-y-4 px-2 sm:px-0">
            {/* Whiteout Survival Player Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-amber-400" /> Karta Gracza Whiteout Survival
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Sojusz</span>
                  <span className="text-sm font-black text-amber-300">{profile.alliance || 'Sojusz MaG'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Nick w WOS</span>
                  <span className="text-sm font-black text-white">{profile.wosNick || 'Nie podano'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">ID Gracza WOS</span>
                  <span className="text-sm font-mono font-bold text-amber-200">{profile.wosPlayerId || 'Nie podano'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Państwo / State</span>
                  <span className="text-sm font-black text-emerald-300">{profile.stateCountry || 'State #142'}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-400" /> Linki:
                </span>
                {profile.socialLinks?.discord && (
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/40 font-bold">
                    Discord: {profile.socialLinks.discord}
                  </span>
                )}
                {profile.socialLinks?.youtube && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
                    YouTube: {profile.socialLinks.youtube}
                  </span>
                )}
                {profile.socialLinks?.facebook && (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-500/40 font-bold">
                    Facebook: {profile.socialLinks.facebook}
                  </span>
                )}
              </div>
            </div>

            {/* Badges & Achievements */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Odznaczenia i Osiągnięcia ({profile.badges.length})
              </h3>
              {profile.badges.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">Brak odznaczeń. Bądź aktywny w Portalu, aby je zdobywać!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {profile.badges.map((badge) => (
                    <div key={badge.id} className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-amber-500/10 text-amber-400 shrink-0">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-100 block">{badge.name}</span>
                        <span className="text-[10px] text-amber-400/80">Odznaczenie Portalu MaG</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Joined Groups */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> Moje Grupy ({myJoinedGroups.length})
                </h3>
                <button
                  onClick={() => setActiveView('grupy')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  Przeglądaj <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {myJoinedGroups.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">Nie dołączono do żadnej grupy.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {myJoinedGroups.map((grp) => (
                    <div
                      key={grp.id}
                      onClick={() => setActiveView('grupy')}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 cursor-pointer flex items-center gap-3 transition-all"
                    >
                      <img src={grp.avatarImage} alt={grp.name} className="w-9 h-9 rounded-lg object-cover ring-1 ring-emerald-500/40" />
                      <div className="overflow-hidden flex-1">
                        <span className="text-xs font-bold text-white block truncate">{grp.name}</span>
                        <span className="text-[10px] text-emerald-300/80">{grp.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: EDYTUJ PROFIL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl w-full max-w-2xl p-5 sm:p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" /> Edytuj Profil Użytkownika
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              
              {/* 1. System Avatar Frame Selection */}
              <div>
                <label className="block text-slate-200 font-extrabold mb-2">Systemowa Ramka Avatara</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {frameOptions.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setEditFrame(f.id)}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                        editFrame === f.id
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <AvatarWithFrame src={editAvatar} frame={f.id} size="sm" />
                      <div className="min-w-0 flex-1">
                        <span className={`text-xs font-black block ${f.color}`}>{f.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{f.desc}</span>
                      </div>
                      {editFrame === f.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Avatar & Cover Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Avatar (Plik lub URL)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                    <label className="cursor-pointer bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-slate-200 font-bold flex items-center gap-1 shrink-0">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tło / Cover (Plik lub URL)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editCover}
                      onChange={(e) => setEditCover(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                    <label className="cursor-pointer bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-slate-200 font-bold flex items-center gap-1 shrink-0">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <input type="file" accept="image/*" onChange={handleCoverFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. Display Name & Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nazwa Wyświetlana</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Sojusz</label>
                  <input
                    type="text"
                    value={editAlliance}
                    onChange={(e) => setEditAlliance(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">O mnie (Bio)</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 4. Whiteout Survival Data */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-amber-400" /> Dane Gracza Whiteout Survival
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Nick w WOS</label>
                    <input
                      type="text"
                      placeholder="np. Rzaba_MaG"
                      value={editWosNick}
                      onChange={(e) => setEditWosNick(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">ID Gracza WOS</label>
                    <input
                      type="text"
                      placeholder="np. 8941235"
                      value={editWosPlayerId}
                      onChange={(e) => setEditWosPlayerId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Państwo / State</label>
                    <input
                      type="text"
                      placeholder="np. State #142"
                      value={editStateCountry}
                      onChange={(e) => setEditStateCountry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Social Links */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-200">Social Media & Discord</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Discord nick"
                    value={editDiscord}
                    onChange={(e) => setEditDiscord(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="YouTube channel"
                    value={editYoutube}
                    onChange={(e) => setEditYoutube(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Facebook link"
                    value={editFacebook}
                    onChange={(e) => setEditFacebook(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-500/20"
                >
                  Zapisz Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
