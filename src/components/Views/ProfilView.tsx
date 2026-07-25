import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AvatarWithFrame } from '../AvatarWithFrame';
import { CITY_LEVELS } from '../MiniWhiteout/MiniWhiteoutCity';
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
  MessageSquare,
  Trophy,
  Dices,
  Building2,
  Lock
} from 'lucide-react';
import { AvatarFrameStyle, UserRole } from '../../types';

export const ProfilView: React.FC = () => {
  const {
    profile,
    setProfile,
    groups,
    setActiveView,
    posts,
    addPost,
    likePost,
    reels,
    usersList,
    portalTheme
  } = useApp();

  const isMirror = portalTheme === 'lustrzany';

  // Active Profile Tab: POSTY | MEDIA | OSIĄGNIĘCIA
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'achievements'>('posts');

  // New Post State inside POSTY tab
  const [newPostContent, setNewPostContent] = useState('');

  // Dice Poker Stats State
  const [pokerStats, setPokerStats] = useState({
    elo: 1000,
    wins: 0,
    losses: 0,
    played: 0,
    tournamentsPlayed: 0,
    tournamentWins: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem(`mag_dice_poker_stats_${profile.id}`);
    if (saved) {
      try {
        setPokerStats(JSON.parse(saved));
      } catch {
        // fallback
      }
    }
  }, [profile.id]);

  // Compute Ranking Position
  const sortedUsers = usersList.map((u) => {
    const saved = localStorage.getItem(`mag_dice_poker_stats_${u.id}`);
    const elo = saved ? JSON.parse(saved).elo || 1000 : 1000;
    return { id: u.id, elo };
  }).sort((a, b) => b.elo - a.elo);

  const pokerRank = sortedUsers.findIndex((u) => u.id === profile.id) + 1;

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

  const canEquipFrame = (fId: AvatarFrameStyle): boolean => {
    if (fId === 'admin_frame') return profile.role === 'ADMIN';
    if (fId === 'r4_frame') return profile.role === 'R4 MaG' || profile.role === 'ADMIN';
    if (fId === 'moderator_frame') return profile.role === 'MODERATOR' || profile.role === 'ADMIN';
    return true; // Cosmetic frames accessible to all
  };

  const handleOpenEditModal = () => {
    setEditName(profile.name);
    setEditAvatar(profile.avatar);
    setEditCover(profile.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200');
    setEditFrame(canEquipFrame(profile.avatarFrame || 'standard') ? profile.avatarFrame || 'standard' : 'standard');
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
    const validatedFrame = canEquipFrame(editFrame) ? editFrame : 'standard';

    setProfile(prev => ({
      ...prev,
      name: editName.trim() || prev.name,
      avatar: editAvatar,
      coverImage: editCover,
      avatarFrame: validatedFrame,
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

  const frameOptions: Array<{
    id: AvatarFrameStyle;
    name: string;
    color: string;
    desc: string;
    requiredRoleDesc?: string;
  }> = [
    { id: 'standard', name: 'Standard', color: 'border-slate-600', desc: 'Minimalistyczna ramka szkła' },
    { id: 'ice', name: 'Ice', color: 'border-cyan-400 text-cyan-300', desc: 'Mroźny krystaliczny lód' },
    { id: 'gold', name: 'Gold', color: 'border-amber-400 text-amber-300', desc: 'Luksusowe polerowane złoto' },
    { id: 'emerald', name: 'Emerald', color: 'border-emerald-400 text-emerald-300', desc: 'Głęboki szmaragd magii' },
    { id: 'crimson', name: 'Crimson', color: 'border-rose-500 text-rose-300', desc: 'Wulkaniczny kryształ' },
    { id: 'mag', name: 'MaG', color: 'border-purple-500 text-purple-300', desc: 'Portalowa korona obsidianu' },
    { id: 'r4_frame', name: 'R4 MaG', color: 'border-cyan-400 text-cyan-200', desc: 'Elitarny herb sojuszu MaG', requiredRoleDesc: 'Ranga R4 MaG' },
    { id: 'moderator_frame', name: 'Moderator', color: 'border-purple-400 text-purple-200', desc: 'Zimowa korona Moderatora', requiredRoleDesc: 'Ranga Moderator' },
    { id: 'admin_frame', name: 'Admin Frame', color: 'border-amber-400 text-amber-300', desc: 'Złota korona Administratora', requiredRoleDesc: 'Ranga Admin' },
  ];

  return (
    <div className={`h-full w-full flex flex-col overflow-hidden font-sans ${isMirror ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* Scrollable Container */}
      <div className="flex-1 app-scroll-container p-0 sm:p-4 max-w-5xl mx-auto w-full space-y-4 pb-12">
        
        {/* Cover Photo & Avatar Header Banner */}
        <div className={`relative rounded-none sm:rounded-3xl overflow-hidden ${isMirror ? 'bg-white border-b sm:border border-slate-300 shadow-md' : 'bg-slate-900 border-b sm:border border-slate-800 shadow-2xl'}`}>
          {/* Cover Image */}
          <div className="h-44 sm:h-64 w-full relative bg-slate-900">
            <img
              src={profile.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200'}
              alt="Cover"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${isMirror ? 'bg-gradient-to-t from-white via-white/30 to-transparent' : 'bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent'}`} />
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
                  <h1 className={`text-xl sm:text-2xl font-black ${isMirror ? 'text-slate-950' : 'text-white'}`}>{profile.name}</h1>
                  <span
                    className={`inline-block text-[11px] px-3 py-0.5 rounded-full font-black border ${
                      profile.role === 'ADMIN'
                        ? isMirror ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : profile.role === 'MODERATOR'
                        ? isMirror ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        : isMirror ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    ROLA: {profile.role}
                  </span>
                </div>

                <p className={`text-xs font-bold ${isMirror ? 'text-amber-800' : 'text-amber-300'}`}>{profile.title}</p>
                <p className={`text-xs max-w-md line-clamp-2 ${isMirror ? 'text-slate-800 font-semibold' : 'text-slate-200'}`}>{profile.bio}</p>
              </div>
            </div>

            {/* Action Edit Profile Button */}
            <button
              onClick={handleOpenEditModal}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> EDYTUJ PROFIL
            </button>
          </div>

          {/* XP Progress Bar */}
          <div className="px-4 sm:px-6 pb-4">
            <div className={`p-3 rounded-2xl border space-y-1.5 ${isMirror ? 'bg-slate-50 border-slate-300' : 'bg-slate-950/80 border-slate-800'}`}>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className={`flex items-center gap-1.5 ${isMirror ? 'text-amber-800' : 'text-amber-300'}`}>
                  <Crown className="w-3.5 h-3.5" /> Poziom Użytkownika {profile.level}
                </span>
                <span className={`font-mono ${isMirror ? 'text-slate-700' : 'text-slate-400'}`}>{profile.xp} / {profile.maxXp} XP ({xpPercent}%)</span>
              </div>
              <div className={`w-full h-2 rounded-full border overflow-hidden ${isMirror ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MOJE MIASTO (MINI WHITEOUT) CARD */}
        <div className={`mx-2 sm:mx-0 p-4 sm:p-5 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isMirror
            ? 'bg-gradient-to-r from-sky-50 via-white to-cyan-100 border-cyan-400 text-slate-950 shadow-sky-500/10'
            : 'bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/90 border-cyan-500/40 text-slate-100 shadow-2xl'
        }`}>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-800 flex items-center justify-center shadow-lg border border-cyan-400/50 shrink-0 text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-black font-serif uppercase tracking-wide ${isMirror ? 'text-slate-950' : 'text-white'}`}>
                  MOJE MIASTO (MINI WHITEOUT)
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono border ${
                  isMirror ? 'bg-cyan-100 text-cyan-900 border-cyan-300' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                }`}>
                  LVL {profile.cityData?.level || 1}
                </span>
              </div>
              <p className={`text-xs font-black mt-0.5 ${isMirror ? 'text-sky-800' : 'text-amber-300'}`}>
                {CITY_LEVELS.find((l) => l.level === (profile.cityData?.level || 1))?.title || 'Osada Ocalałych'}
              </p>
              <p className={`text-xs mt-1 line-clamp-1 font-semibold ${isMirror ? 'text-slate-800' : 'text-slate-300'}`}>
                {CITY_LEVELS.find((l) => l.level === (profile.cityData?.level || 1))?.desc}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('miasto')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/30 cursor-pointer shrink-0"
          >
            <span>ZOBACZ PEŁNE MIASTO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Tabs: POSTY | MEDIA | OSIĄGNIĘCIA */}
        <div className={`flex items-center gap-2 border-b px-2 sm:px-0 ${isMirror ? 'border-slate-300' : 'border-slate-800/80'}`}>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-3 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'posts'
                ? isMirror ? 'border-sky-600 text-sky-700' : 'border-amber-500 text-amber-300'
                : isMirror ? 'border-transparent text-slate-600 hover:text-slate-950' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> POSTY ({myPosts.length})
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-3 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'media'
                ? isMirror ? 'border-sky-600 text-sky-700' : 'border-amber-500 text-amber-300'
                : isMirror ? 'border-transparent text-slate-600 hover:text-slate-950' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" /> MEDIA ({myReels.length})
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-3 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'achievements'
                ? isMirror ? 'border-sky-600 text-sky-700' : 'border-amber-500 text-amber-300'
                : isMirror ? 'border-transparent text-slate-600 hover:text-slate-950' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" /> OSIĄGNIĘCIA I KARTA
          </button>
        </div>

        {/* TAB 1: POSTY */}
        {activeTab === 'posts' && (
          <div className="space-y-4 px-2 sm:px-0">
            {/* Create Post Form */}
            <form onSubmit={handleCreatePost} className={`p-4 rounded-2xl border space-y-3 ${isMirror ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}>
              <div className="flex items-center gap-3">
                <AvatarWithFrame src={profile.avatar} frame={profile.avatarFrame} size="sm" />
                <input
                  type="text"
                  placeholder="Napisz coś na swojej ścianie..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className={`flex-1 border rounded-xl px-3.5 py-2 text-xs focus:outline-none ${
                    isMirror
                      ? 'bg-slate-50 border-slate-300 text-slate-950 placeholder:text-slate-500 focus:border-sky-500'
                      : 'bg-slate-950 border-slate-800 text-white focus:border-amber-500'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className={`px-4 py-2 rounded-xl text-xs font-black disabled:opacity-40 cursor-pointer ${
                    isMirror ? 'bg-sky-600 text-white hover:bg-sky-500' : 'bg-amber-500 text-black'
                  }`}
                >
                  Opublikuj
                </button>
              </div>
            </form>

            {/* Posts List or Clean Empty State */}
            {myPosts.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border space-y-2 ${isMirror ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/40 border-slate-800/80'}`}>
                <Sparkles className="w-8 h-8 text-sky-500 mx-auto" />
                <p className={`text-sm font-black ${isMirror ? 'text-slate-950' : 'text-white'}`}>Brak wpisów użytkownika</p>
                <p className={`text-xs ${isMirror ? 'text-slate-600' : 'text-slate-400'}`}>Nie opublikowano jeszcze żadnych postów na Ścianie.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myPosts.map((post) => (
                  <div key={post.id} className={`p-4 rounded-2xl border space-y-3 ${isMirror ? 'bg-white border-slate-300 shadow-sm text-slate-950' : 'bg-slate-900/80 border-slate-800 text-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <AvatarWithFrame src={post.authorAvatar} frame={profile.avatarFrame} size="sm" />
                      <div>
                        <span className={`text-xs font-black block ${isMirror ? 'text-slate-950' : 'text-white'}`}>{post.authorName}</span>
                        <span className={`text-[10px] ${isMirror ? 'text-slate-500' : 'text-slate-400'}`}>{post.createdAt}</span>
                      </div>
                    </div>
                    <p className={`text-xs font-medium ${isMirror ? 'text-slate-800' : 'text-slate-200'}`}>{post.content}</p>
                    <div className={`flex items-center gap-4 text-xs pt-2 border-t ${isMirror ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'}`}>
                      <button
                        onClick={() => likePost(post.id)}
                        className={`flex items-center gap-1 font-bold ${post.isLiked ? 'text-rose-600' : 'hover:text-sky-600'}`}
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
              <div className={`p-8 text-center rounded-2xl border space-y-2 ${isMirror ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/40 border-slate-800/80'}`}>
                <Video className="w-8 h-8 text-sky-500 mx-auto" />
                <p className={`text-sm font-black ${isMirror ? 'text-slate-950' : 'text-white'}`}>Brak opublikowanych multimediów</p>
                <p className={`text-xs ${isMirror ? 'text-slate-600' : 'text-slate-400'}`}>Twórz i udostępniaj rolki w sekcji REELS!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {myReels.map((reel) => (
                  <div key={reel.id} className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 group shadow-sm">
                    <img src={reel.videoBg} alt={reel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                      <span className="text-xs font-bold text-white truncate drop-shadow">{reel.title}</span>
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
            {/* POKER KOŚCI STATS CARD */}
            <div className={`p-5 rounded-2xl border space-y-4 shadow-md ${
              isMirror
                ? 'bg-white border-cyan-300 text-slate-950 shadow-sky-500/10'
                : 'bg-gradient-to-r from-slate-900 via-cyan-950/30 to-purple-950/30 border-cyan-500/40 text-slate-100 shadow-xl'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-black flex items-center gap-2 ${isMirror ? 'text-cyan-900' : 'text-cyan-300'}`}>
                  <Dices className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> POKER KOŚCI – KARTA PORTALOWA
                </h3>
                <button
                  onClick={() => setActiveView('gry')}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-bold flex items-center gap-1"
                >
                  Zagraj Teraz <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block font-semibold">ELO</span>
                  <span className="text-sm font-black text-amber-400">{pokerStats.elo}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block font-semibold">RANKING</span>
                  <span className="text-sm font-black text-cyan-300">#{pokerRank}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block font-semibold">WYGRANE / PRZEGRANE</span>
                  <span className="text-sm font-black text-emerald-400">{pokerStats.wins}W <span className="text-slate-500">/</span> <span className="text-rose-400">{pokerStats.losses}L</span></span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block font-semibold">ROZEGRANE / TURNIEJE</span>
                  <span className="text-sm font-black text-purple-300">{pokerStats.played} <span className="text-slate-500">({pokerStats.tournamentWins} pucharów)</span></span>
                </div>
              </div>
            </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {frameOptions.map((f) => {
                    const isAllowed = canEquipFrame(f.id);

                    return (
                      <div
                        key={f.id}
                        onClick={() => {
                          if (isAllowed) {
                            setEditFrame(f.id);
                          } else {
                            alert(`Brak uprawnień do ramki ${f.name}! Wymaga rangi: ${f.requiredRoleDesc}.`);
                          }
                        }}
                        className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                          !isAllowed
                            ? 'bg-slate-950/60 border-slate-800/80 opacity-60 cursor-not-allowed'
                            : editFrame === f.id
                            ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50 cursor-pointer'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 cursor-pointer'
                        }`}
                      >
                        <AvatarWithFrame src={editAvatar} frame={f.id} size="sm" />
                        <div className="min-w-0 flex-1">
                          <span className={`text-xs font-black block ${f.color}`}>{f.name}</span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {isAllowed ? f.desc : `🔒 Wymaga: ${f.requiredRoleDesc}`}
                          </span>
                        </div>
                        {isAllowed && editFrame === f.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                        {!isAllowed && <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                      </div>
                    );
                  })}
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
