import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppView,
  UserProfile,
  UserRole,
  UserAccountStatus,
  UserAccountData,
  Post,
  ChatConversation,
  ChatMessage,
  ChatMessageType,
  ChatMessageReplyTo,
  ChatMember,
  AvatarFrameStyle,
  SocialEvent,
  EventType,
  SocialEventAttendee,
  Group,
  GroupVisibility,
  GroupMemberRole,
  ForumSection,
  ForumTopic,
  ForumReply,
  GroupWallPost,
  GroupAnnouncement,
  GameItem,
  Reel,
  NotificationItem,
  PortalAnnouncement,
  AnnouncementConfirmation,
  AnnouncementCategory,
  AnnouncementRequirement,
  PortalTheme
} from '../types';
import {
  initialProfile,
  initialPosts,
  initialChats,
  initialEvents,
  initialGames,
  initialReels,
  initialNotifications,
  initialAnnouncements
} from '../data/initialData';
import {
  seedUsersDatabase,
  loadConversationsFromStorage,
  saveConversationsToStorage
} from '../services/chatService';

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export type AnimationState = 'logged_out' | 'shattering' | 'logged_in' | 'healing';
export type { PortalTheme } from '../types';

interface AppContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  usersList: UserProfile[];
  posts: Post[];
  chats: ChatConversation[];
  events: SocialEvent[];
  groups: Group[];
  games: GameItem[];
  reels: Reel[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  totalUnreadMessages: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  shaderQuality: 'high' | 'medium' | 'low';
  setShaderQuality: (quality: 'high' | 'medium' | 'low') => void;
  portalTheme: PortalTheme;
  setPortalTheme: (theme: PortalTheme) => void;

  // Authentication & Animation State
  isAuthenticated: boolean;
  animationState: AnimationState;
  login: (loginName: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Global Actions
  addPost: (content: string, image?: string, linkUrl?: string, youtubeId?: string) => void;
  addReel: (title: string, videoBg: string, type?: 'image' | 'youtube', youtubeId?: string, tags?: string[]) => void;
  likePost: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  sendMessage: (chatId: string, text: string) => void;

  // Real Messenger Actions
  getOrCreateDirectChat: (targetUser: UserProfile | { id: string; name: string; avatar: string; avatarFrame?: AvatarFrameStyle; role?: UserRole; title?: string }) => string;
  createGroupChat: (groupName: string, selectedUserIds: string[], avatarUrl?: string) => string;
  sendChatMessage: (chatId: string, content: string, type?: ChatMessageType, mediaUrl?: string, replyTo?: ChatMessageReplyTo) => void;
  toggleMessageReaction: (chatId: string, messageId: string, emoji: string) => void;
  markChatAsRead: (chatId: string) => void;
  updateGroupChatInfo: (chatId: string, updates: { name?: string; avatar?: string }) => void;
  addGroupChatMember: (chatId: string, userId: string) => void;
  removeGroupChatMember: (chatId: string, userId: string) => void;
  updateGroupMemberRole: (chatId: string, userId: string, role: 'admin' | 'member') => void;
  leaveGroupChat: (chatId: string) => void;

  toggleEventRSVP: (eventId: string, status: 'attending' | 'interested' | 'none') => void;
  addEvent: (eventData: {
    title: string;
    description: string;
    dateStr: string;
    timeStr: string;
    location?: string;
    eventType: EventType;
    coverImage?: string;
    organizer?: string;
    isHighlighted?: boolean;
    hasReminder?: boolean;
    participantLimit?: number;
  }) => void;
  updateEvent: (eventId: string, updatedData: Partial<SocialEvent>) => void;
  deleteEvent: (eventId: string) => void;
  toggleReelLike: (reelId: string) => void;
  addReelComment: (reelId: string, content: string, parentId?: string, replyToUser?: string) => void;
  likeReelComment: (reelId: string, commentId: string) => void;
  deleteReelComment: (reelId: string, commentId: string) => void;
  markNotificationsRead: () => void;
  addXp: (amount: number) => void;
  playShardSound: (color: string) => void;

  // Admin User Management
  updateUserRole: (userId: string, newRole: UserRole) => void;
  updateUserAccountStatus: (userId: string, newStatus: UserAccountStatus) => void;

  // Group & Forum Actions
  createGroup: (groupData: {
    name: string;
    shortDescription: string;
    description: string;
    avatarImage: string;
    coverImage: string;
    category: string;
    visibility: GroupVisibility;
    rules: string;
  }) => void;
  updateGroup: (groupId: string, updatedData: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  toggleGroupJoin: (groupId: string) => void;
  handleJoinRequest: (groupId: string, requestId: string, accept: boolean) => void;
  
  // Forum Section Actions
  addForumSection: (groupId: string, sectionData: { name: string; description: string; iconName?: string }) => void;
  updateForumSection: (groupId: string, sectionId: string, sectionData: { name: string; description: string; iconName?: string }) => void;
  deleteForumSection: (groupId: string, sectionId: string) => void;
  reorderForumSections: (groupId: string, orderedSectionIds: string[]) => void;

  // Forum Topic Actions
  addForumTopic: (groupId: string, sectionId: string, topicData: {
    title: string;
    content: string;
    image?: string;
    linkUrl?: string;
    youtubeId?: string;
  }) => void;
  updateForumTopic: (groupId: string, topicId: string, topicData: { title: string; content: string }) => void;
  deleteForumTopic: (groupId: string, topicId: string) => void;
  togglePinTopic: (groupId: string, topicId: string) => void;
  toggleLockTopic: (groupId: string, topicId: string) => void;

  // Forum Reply Actions
  addForumReply: (groupId: string, topicId: string, replyData: {
    content: string;
    image?: string;
    linkUrl?: string;
    youtubeId?: string;
  }) => void;
  updateForumReply: (groupId: string, topicId: string, replyId: string, content: string) => void;
  deleteForumReply: (groupId: string, topicId: string, replyId: string) => void;
  likeForumReply: (groupId: string, topicId: string, replyId: string) => void;

  // Group Wall Actions
  addWallPost: (groupId: string, postData: { content: string; image?: string; linkUrl?: string; youtubeId?: string }) => void;
  addWallPostComment: (groupId: string, postId: string, content: string) => void;
  likeWallPost: (groupId: string, postId: string) => void;

  // Announcement Actions
  addAnnouncement: (groupId: string, title: string, content: string, isPinned?: boolean) => void;
  deleteAnnouncement: (groupId: string, announcementId: string) => void;

  // Portal Global Announcements System
  announcements: PortalAnnouncement[];
  unreadAnnouncementsCount: number;
  previewAnnouncement: PortalAnnouncement | null;
  setPreviewAnnouncement: (announcement: PortalAnnouncement | null) => void;
  activeAnnouncementModal: PortalAnnouncement | null;
  setActiveAnnouncementModal: (announcement: PortalAnnouncement | null) => void;
  createPortalAnnouncement: (data: Omit<PortalAnnouncement, 'id' | 'confirmations' | 'createdAt' | 'createdByUserId' | 'createdByName' | 'createdByAvatar'>) => void;
  updatePortalAnnouncement: (id: string, updates: Partial<PortalAnnouncement>) => void;
  deletePortalAnnouncement: (id: string) => void;
  confirmAnnouncementRead: (announcementId: string) => void;
  updateUserPermissions: (userId: string, permissions: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Authentication & Animation state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('mag_session_user'));
  });
  const [animationState, setAnimationState] = useState<AnimationState>(() => {
    return localStorage.getItem('mag_session_user') ? 'logged_in' : 'logged_out';
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('mag_session_user');
    if (savedUser) {
      const storedUsers: Record<string, UserAccountData> = JSON.parse(localStorage.getItem('mag_users_db') || '{}');
      const userKey = savedUser.toLowerCase();
      const userData = storedUsers[userKey];
      if (userData && userData.profile) {
        if (userKey === 'admin' || userKey === 'rzaba' || userKey === 'kamil') {
          userData.profile.role = 'ADMIN';
          userData.profile.title = 'Administrator Portalu MaG';
        }
        return userData.profile;
      }
      // Default fallback
      const isAdminRole = userKey === 'admin' || userKey === 'rzaba' || userKey === 'kamil';
      return {
        ...initialProfile,
        id: `usr_${userKey}`,
        name: savedUser,
        role: isAdminRole ? 'ADMIN' : 'USER',
        title: isAdminRole ? 'Administrator Portalu MaG' : 'Członek Portalu MaG',
        accountStatus: 'active',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
      };
    }
    return {
      ...initialProfile,
      role: 'USER',
      accountStatus: 'active'
    };
  });

  // User Accounts List for Admin and Messenger
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    const seeded = seedUsersDatabase();
    return Object.values(seeded).map(u => u.profile);
  });

  // Raw Conversations database
  const [rawConversations, setRawConversations] = useState<ChatConversation[]>(() => {
    return loadConversationsFromStorage();
  });

  // Global app entities
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [events, setEvents] = useState<SocialEvent[]>(initialEvents);
  const [groups, setGroups] = useState<Group[]>(() => {
    const savedGroups = localStorage.getItem('mag_groups_db');
    if (savedGroups) {
      try {
        return JSON.parse(savedGroups);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [games, setGames] = useState<GameItem[]>(initialGames);
  const [reels, setReels] = useState<Reel[]>(initialReels);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [shaderQuality, setShaderQuality] = useState<'high' | 'medium' | 'low'>('high');

  // Portal Graphic Theme State (Mroczny vs Jasne Lustro vs MaG Comic)
  const [portalTheme, setPortalThemeState] = useState<PortalTheme>(() => {
    const saved = localStorage.getItem('mag_portal_theme');
    return saved === 'lustrzany' || saved === 'mroczny' || saved === 'komiksowy' ? (saved as PortalTheme) : 'mroczny';
  });

  const setPortalTheme = (theme: PortalTheme) => {
    setPortalThemeState(theme);
    localStorage.setItem('mag_portal_theme', theme);
  };

  useEffect(() => {
    if (portalTheme === 'lustrzany') {
      document.documentElement.classList.add('theme-lustrzany');
      document.documentElement.classList.remove('theme-mroczny', 'theme-komiksowy');
    } else if (portalTheme === 'komiksowy') {
      document.documentElement.classList.add('theme-komiksowy');
      document.documentElement.classList.remove('theme-mroczny', 'theme-lustrzany');
    } else {
      document.documentElement.classList.add('theme-mroczny');
      document.documentElement.classList.remove('theme-lustrzany', 'theme-komiksowy');
    }
  }, [portalTheme]);

  // Portal Global Announcements State
  const [announcements, setAnnouncements] = useState<PortalAnnouncement[]>(() => {
    const saved = localStorage.getItem('mag_portal_announcements_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return initialAnnouncements;
      }
    }
    return initialAnnouncements;
  });

  const [previewAnnouncement, setPreviewAnnouncement] = useState<PortalAnnouncement | null>(null);
  const [activeAnnouncementModal, setActiveAnnouncementModal] = useState<PortalAnnouncement | null>(null);

  useEffect(() => {
    localStorage.setItem('mag_portal_announcements_v2', JSON.stringify(announcements));
  }, [announcements]);

  const unreadAnnouncementsCount = React.useMemo(() => {
    if (!profile || !profile.id) return 0;
    return announcements.filter(ann => {
      if (ann.status !== 'active') return false;
      if (ann.expiresAt && ann.expiresAt.trim() !== '') {
        const exp = new Date(ann.expiresAt).getTime();
        if (!isNaN(exp) && exp < Date.now()) return false;
      }
      const confirmed = ann.confirmations?.some(c =>
        (c.userId === profile.id || c.username === profile.name) && Boolean(c.confirmedAt)
      );
      return !confirmed;
    }).length;
  }, [announcements, profile]);

  const createPortalAnnouncement = (data: Omit<PortalAnnouncement, 'id' | 'confirmations' | 'createdAt' | 'createdByUserId' | 'createdByName' | 'createdByAvatar'>) => {
    const newAnn: PortalAnnouncement = {
      ...data,
      id: `ann_${Date.now()}`,
      createdByUserId: profile.id,
      createdByName: `${profile.name} (${profile.role === 'ADMIN' ? 'Admin' : 'Moderator'})`,
      createdByAvatar: profile.avatar,
      createdAt: new Date().toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' }),
      confirmations: []
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const updatePortalAnnouncement = (id: string, updates: Partial<PortalAnnouncement>) => {
    setAnnouncements(prev =>
      prev.map(ann => (ann.id === id ? { ...ann, ...updates } : ann))
    );
  };

  const deletePortalAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  const confirmAnnouncementRead = (announcementId: string) => {
    if (!profile || !profile.id) return;
    const now = new Date().toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' });

    setAnnouncements(prev =>
      prev.map(ann => {
        if (ann.id !== announcementId) return ann;
        const existingConf = ann.confirmations?.find(c => c.userId === profile.id || c.username === profile.name);
        if (existingConf) {
          return {
            ...ann,
            confirmations: ann.confirmations.map(c =>
              c.userId === profile.id || c.username === profile.name
                ? { ...c, confirmedAt: now }
                : c
            )
          };
        } else {
          return {
            ...ann,
            confirmations: [
              ...(ann.confirmations || []),
              {
                userId: profile.id,
                username: profile.name,
                userAvatar: profile.avatar,
                readAt: now,
                confirmedAt: now
              }
            ]
          };
        }
      })
    );
  };

  const updateUserPermissions = (userId: string, permissions: string[]) => {
    setUsersList(prev =>
      prev.map(u => (u.id === userId ? { ...u, permissions } : u))
    );
  };

  // Auto-sync conversations from localStorage across tabs/sessions
  useEffect(() => {
    const syncConvs = () => {
      const convs = loadConversationsFromStorage();
      setRawConversations(convs);
    };

    window.addEventListener('storage', syncConvs);
    const interval = setInterval(syncConvs, 2000);
    return () => {
      window.removeEventListener('storage', syncConvs);
      clearInterval(interval);
    };
  }, []);

  // Compute active user's formatted chats list
  const chats: ChatConversation[] = React.useMemo(() => {
    if (!profile || !profile.id) return [];

    const userConvs = rawConversations.filter(c =>
      c.members?.some(m => m.userId === profile.id || m.username?.toLowerCase() === profile.name?.toLowerCase())
    );

    return userConvs.map(conv => {
      const currentMember = conv.members?.find(m => m.userId === profile.id || m.username?.toLowerCase() === profile.name?.toLowerCase());
      const lastReadTime = currentMember?.lastReadAt ? new Date(currentMember.lastReadAt).getTime() : 0;

      // Calculate unread count for current user
      const unreadCount = conv.messages?.filter(msg => {
        if (msg.senderId === profile.id) return false;
        const msgTime = new Date(msg.createdAt).getTime();
        const isRead = msg.readBy?.includes(profile.id);
        return !isRead && msgTime > lastReadTime;
      }).length || 0;

      let targetUser = conv.user;
      if (conv.type === 'direct') {
        const otherMember = conv.members?.find(m => m.userId !== profile.id && m.username?.toLowerCase() !== profile.name?.toLowerCase());
        if (otherMember) {
          const liveProfile = usersList.find(u => u.id === otherMember.userId || u.name.toLowerCase() === otherMember.username.toLowerCase());
          targetUser = {
            id: otherMember.userId,
            name: liveProfile?.name || otherMember.username,
            avatar: liveProfile?.avatar || otherMember.userAvatar,
            frame: liveProfile?.avatarFrame || otherMember.userFrame || 'standard',
            status: liveProfile?.status || 'online',
            title: liveProfile?.title || 'Członek Portalu MaG',
            role: liveProfile?.role || 'USER'
          };
        }
      }

      // Format messages with isMe flag
      const formattedMessages = (conv.messages || []).map(msg => ({
        ...msg,
        isMe: msg.senderId === profile.id || msg.senderName.toLowerCase() === profile.name.toLowerCase()
      }));

      return {
        ...conv,
        unreadCount,
        user: targetUser,
        messages: formattedMessages
      };
    }).sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  }, [rawConversations, profile, usersList]);

  // Load user specific data from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('mag_session_user');
    if (savedUser) {
      const userKey = `mag_data_${savedUser.toLowerCase()}`;
      const savedDataRaw = localStorage.getItem(userKey);
      if (savedDataRaw) {
        try {
          const parsed = JSON.parse(savedDataRaw);
          if (parsed.posts) setPosts(parsed.posts);
          if (parsed.events) setEvents(parsed.events);
          if (parsed.games) setGames(parsed.games);
          if (parsed.reels) setReels(parsed.reels);
          if (parsed.notifications) setNotifications(parsed.notifications);
        } catch {
          // ignore parsing error
        }
      }
    }
  }, [isAuthenticated]);

  // Persist user data changes
  useEffect(() => {
    const savedUser = localStorage.getItem('mag_session_user');
    if (savedUser && isAuthenticated) {
      const userKey = `mag_data_${savedUser.toLowerCase()}`;
      localStorage.setItem(userKey, JSON.stringify({ posts, events, games, reels, notifications }));
    }
  }, [posts, events, games, reels, notifications, isAuthenticated]);

  // Persist Groups database across sessions
  useEffect(() => {
    localStorage.setItem('mag_groups_db', JSON.stringify(groups));
  }, [groups]);

  // Sync current user profile changes to mag_users_db
  useEffect(() => {
    if (profile && profile.name) {
      const storedUsers: Record<string, UserAccountData> = JSON.parse(localStorage.getItem('mag_users_db') || '{}');
      const userKey = profile.name.toLowerCase();
      if (storedUsers[userKey]) {
        storedUsers[userKey].profile = profile;
        localStorage.setItem('mag_users_db', JSON.stringify(storedUsers));
        setUsersList(Object.values(storedUsers).map(u => u.profile));
      }
    }
  }, [profile]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const totalUnreadMessages = chats.reduce((acc, chat) => acc + chat.unreadCount, 0);

  // Audio synthesizer for crystal/magical stone shard feedback
  const playShardSound = (type: string) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      let freq = 440;
      if (type === 'czaty') freq = 523.25;
      else if (type === 'sciana') freq = 587.33;
      else if (type === 'reels') freq = 659.25;
      else if (type === 'grupy') freq = 698.46;
      else if (type === 'gry') freq = 783.99;
      else if (type === 'wydarzenia') freq = 880.00;
      else if (type === 'profil') freq = 987.77;
      else if (type === 'shatter') freq = 120.00;

      if (type === 'shatter') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + (type === 'shatter' ? 0.6 : 0.3));
    } catch {
      // Audio context might be restricted
    }
  };

  const login = async (loginName: string, pin: string): Promise<{ success: boolean; message?: string }> => {
    const trimmedLogin = loginName.trim();
    if (!trimmedLogin) {
      return { success: false, message: 'Wprowadź login' };
    }
    if (!pin || pin.length < 3) {
      return { success: false, message: 'Nieprawidłowy login lub PIN' };
    }

    const hashed = await hashPin(pin);
    const storedUsers: Record<string, UserAccountData> = JSON.parse(localStorage.getItem('mag_users_db') || '{}');
    const userKey = trimmedLogin.toLowerCase();
    const existingUser = storedUsers[userKey];

    if (existingUser) {
      if (existingUser.pinHash !== hashed) {
        return { success: false, message: 'Nieprawidłowy login lub PIN' };
      }
      if (existingUser.profile.accountStatus === 'blocked') {
        return { success: false, message: 'Twoje konto zostało zablokowane przez Administratora Portalu' };
      }
      if (userKey === 'admin' || userKey === 'rzaba' || userKey === 'kamil') {
        existingUser.profile.role = 'ADMIN';
        existingUser.profile.title = 'Administrator Portalu MaG';
      }
    } else {
      // Determine initial role: if user logs in with 'admin', 'rzaba', 'kamil' or if it's the very first user created, give ADMIN role
      const isFirstOrAdmin = userKey === 'admin' || userKey === 'rzaba' || userKey === 'kamil' || Object.keys(storedUsers).length === 0;
      const initialUserRole: UserRole = isFirstOrAdmin ? 'ADMIN' : 'USER';

      const newProfile: UserProfile = {
        id: `usr_${userKey}_${Date.now()}`,
        name: trimmedLogin,
        role: initialUserRole,
        accountStatus: 'active',
        createdAt: new Date().toLocaleDateString('pl-PL'),
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        level: 1,
        xp: 0,
        maxXp: 1000,
        title: initialUserRole === 'ADMIN' ? 'Administrator Portalu MaG' : 'Członek Portalu MaG',
        status: 'online',
        bio: `Witaj w Portalu MaG, ${trimmedLogin}!`,
        badges: [
          { id: 'b1', name: 'Inicjacja MaG', icon: 'Zap', color: '#a855f7' }
        ],
        stats: {
          postsCount: 0,
          friendsCount: 0,
          eventsAttended: 0,
          gamesPlayed: 0
        }
      };
      storedUsers[userKey] = {
        username: trimmedLogin,
        pinHash: hashed,
        profile: newProfile,
        createdAt: new Date().toLocaleDateString('pl-PL')
      };
      localStorage.setItem('mag_users_db', JSON.stringify(storedUsers));
    }

    const currentData = storedUsers[userKey];
    setProfile(currentData.profile);
    setUsersList(Object.values(storedUsers).map(u => u.profile));
    localStorage.setItem('mag_session_user', trimmedLogin);

    // Trigger shatter animation
    setAnimationState('shattering');
    playShardSound('shatter');

    setTimeout(() => {
      setIsAuthenticated(true);
      setAnimationState('logged_in');
      setActiveView('home');
    }, 1750);

    return { success: true };
  };

  const logout = () => {
    setAnimationState('healing');
    playShardSound('shatter');

    setTimeout(() => {
      localStorage.removeItem('mag_session_user');
      setIsAuthenticated(false);
      setAnimationState('logged_out');
      setActiveView('home');
    }, 1000);
  };

  const addXp = (amount: number) => {
    setProfile(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newMax = prev.maxXp;
      if (newXp >= prev.maxXp) {
        newLevel += 1;
        newXp = newXp - prev.maxXp;
        newMax = Math.round(prev.maxXp * 1.15);
      }
      return { ...prev, level: newLevel, xp: newXp, maxXp: newMax };
    });
  };

  const addPost = (content: string, image?: string, linkUrl?: string, youtubeId?: string) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorName: profile.name,
      authorAvatar: profile.avatar,
      timeAgo: 'Przed chwilą',
      content,
      likes: 0,
      commentsCount: 0,
      isLiked: false,
      image,
      linkUrl,
      youtubeId,
      badge: 'Portal MaG',
      comments: []
    };
    setPosts([newPost, ...posts]);
    addXp(50);
  };

  const addReel = (
    title: string,
    videoBg: string,
    type: 'image' | 'youtube' = 'image',
    youtubeId?: string,
    tags: string[] = ['#MaG']
  ) => {
    const newReel: Reel = {
      id: `reel_${Date.now()}`,
      authorName: profile.name,
      authorAvatar: profile.avatar,
      title,
      videoBg,
      type,
      youtubeId,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      tags
    };
    setReels([newReel, ...reels]);
    addXp(60);
  };

  const likePost = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likes: nextLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  const addPostComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const newComm = {
          id: `c_${Date.now()}`,
          authorName: profile.name,
          authorAvatar: profile.avatar,
          content: text,
          timestamp: 'Przed chwilą',
          likes: 0
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComm]
        };
      }
      return p;
    }));
    addXp(15);
  };

  const sendChatMessage = (
    chatId: string,
    content: string,
    type: ChatMessageType = 'text',
    mediaUrl?: string,
    replyTo?: ChatMessageReplyTo
  ) => {
    if (!content.trim() && !mediaUrl) return;

    const currentUserId = profile.id;
    const nowIso = new Date().toISOString();
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;

    const newMsg: ChatMessage = {
      id: msgId,
      conversationId: chatId,
      senderId: currentUserId,
      senderName: profile.name,
      senderAvatar: profile.avatar,
      senderFrame: profile.avatarFrame,
      content: content.trim(),
      type,
      mediaUrl,
      replyTo,
      reactions: {},
      createdAt: nowIso,
      timeAgo: 'Przed chwilą',
      status: 'sent',
      readBy: [currentUserId]
    };

    const allConvs = loadConversationsFromStorage();
    const updatedConvs = allConvs.map(conv => {
      if (conv.id !== chatId) return conv;

      const updatedMembers = (conv.members || []).map(m =>
        m.userId === currentUserId || m.username?.toLowerCase() === profile.name.toLowerCase()
          ? { ...m, lastReadAt: nowIso }
          : m
      );

      return {
        ...conv,
        updatedAt: nowIso,
        members: updatedMembers,
        messages: [...(conv.messages || []), newMsg],
        lastMessage: content.trim() || (type === 'image' ? '📷 Zdjęcie' : '👾 GIF'),
        lastMessageTime: 'Przed chwilą',
        lastMessageSenderId: currentUserId,
        lastMessageStatus: 'sent' as const
      };
    });

    saveConversationsToStorage(updatedConvs);
    setRawConversations(updatedConvs);
    addXp(10);
  };

  const sendMessage = (chatId: string, text: string) => {
    sendChatMessage(chatId, text, 'text');
  };

  const getOrCreateDirectChat = (targetUser: UserProfile | { id: string; name: string; avatar: string; avatarFrame?: AvatarFrameStyle; role?: UserRole; title?: string }): string => {
    const currentUserId = profile.id;
    const currentUserName = profile.name;
    const targetId = targetUser.id || `usr_${targetUser.name.toLowerCase()}`;

    const allConvs = loadConversationsFromStorage();

    // Check if direct conversation already exists between currentUserId and targetId
    const existingConv = allConvs.find(c => {
      if (c.type !== 'direct') return false;
      const memberIds = c.members?.map(m => m.userId) || [];
      const memberNames = c.members?.map(m => m.username?.toLowerCase()) || [];
      return (memberIds.includes(currentUserId) || memberNames.includes(currentUserName.toLowerCase())) &&
             (memberIds.includes(targetId) || memberNames.includes(targetUser.name.toLowerCase()));
    });

    if (existingConv) {
      setSelectedChatId(existingConv.id);
      return existingConv.id;
    }

    // Create new direct conversation
    const newId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    const newConv: ChatConversation = {
      id: newId,
      type: 'direct',
      createdBy: currentUserId,
      createdAt: nowIso,
      updatedAt: nowIso,
      members: [
        {
          userId: currentUserId,
          username: currentUserName,
          userAvatar: profile.avatar,
          userFrame: profile.avatarFrame || 'standard',
          role: 'admin',
          joinedAt: nowIso,
          lastReadAt: nowIso
        },
        {
          userId: targetId,
          username: targetUser.name,
          userAvatar: targetUser.avatar,
          userFrame: targetUser.avatarFrame || 'standard',
          role: 'admin',
          joinedAt: nowIso,
          lastReadAt: nowIso
        }
      ],
      messages: [],
      lastMessage: 'Rozpoczęto konwersację.',
      lastMessageTime: 'Przed chwilą',
      lastMessageSenderId: currentUserId,
      lastMessageStatus: 'sent'
    };

    const updatedConvs = [newConv, ...allConvs];
    saveConversationsToStorage(updatedConvs);
    setRawConversations(updatedConvs);
    setSelectedChatId(newId);
    return newId;
  };

  const createGroupChat = (groupName: string, selectedUserIds: string[], avatarUrl?: string): string => {
    const currentUserId = profile.id;
    const nowIso = new Date().toISOString();
    const newId = `grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const selectedProfiles = usersList.filter(u => selectedUserIds.includes(u.id));

    const members: ChatMember[] = [
      {
        userId: currentUserId,
        username: profile.name,
        userAvatar: profile.avatar,
        userFrame: profile.avatarFrame || 'standard',
        role: 'admin',
        joinedAt: nowIso,
        lastReadAt: nowIso
      },
      ...selectedProfiles.map(u => ({
        userId: u.id,
        username: u.name,
        userAvatar: u.avatar,
        userFrame: u.avatarFrame || 'standard',
        role: 'member' as const,
        joinedAt: nowIso,
        lastReadAt: nowIso
      }))
    ];

    const initialMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: newId,
      senderId: currentUserId,
      senderName: profile.name,
      senderAvatar: profile.avatar,
      senderFrame: profile.avatarFrame,
      content: `Utworzono czat grupowy "${groupName.trim()}".`,
      type: 'text',
      createdAt: nowIso,
      timeAgo: 'Przed chwilą',
      status: 'read',
      readBy: [currentUserId]
    };

    const newGroupConv: ChatConversation = {
      id: newId,
      type: 'group',
      name: groupName.trim(),
      avatar: avatarUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300',
      createdBy: currentUserId,
      createdAt: nowIso,
      updatedAt: nowIso,
      members,
      messages: [initialMsg],
      lastMessage: initialMsg.content,
      lastMessageTime: 'Przed chwilą',
      lastMessageSenderId: currentUserId,
      lastMessageStatus: 'read'
    };

    const allConvs = loadConversationsFromStorage();
    const updatedConvs = [newGroupConv, ...allConvs];
    saveConversationsToStorage(updatedConvs);
    setRawConversations(updatedConvs);
    setSelectedChatId(newId);
    addXp(20);
    return newId;
  };

  const toggleMessageReaction = (chatId: string, messageId: string, emoji: string) => {
    const currentUserId = profile.id;
    const allConvs = loadConversationsFromStorage();

    const updatedConvs = allConvs.map(conv => {
      if (conv.id !== chatId) return conv;

      const updatedMessages = conv.messages.map(msg => {
        if (msg.id !== messageId) return msg;

        const currentReactions = msg.reactions || {};
        const existingUsers = currentReactions[emoji] || [];
        const hasReacted = existingUsers.includes(currentUserId);

        let newUsers: string[];
        if (hasReacted) {
          newUsers = existingUsers.filter(id => id !== currentUserId);
        } else {
          newUsers = [...existingUsers, currentUserId];
        }

        const newReactions = { ...currentReactions };
        if (newUsers.length > 0) {
          newReactions[emoji] = newUsers;
        } else {
          delete newReactions[emoji];
        }

        return {
          ...msg,
          reactions: newReactions
        };
      });

      return {
        ...conv,
        messages: updatedMessages
      };
    });

    saveConversationsToStorage(updatedConvs);
    setRawConversations(updatedConvs);
  };

  const markChatAsRead = (chatId: string) => {
    const currentUserId = profile.id;
    const nowIso = new Date().toISOString();

    const allConvs = loadConversationsFromStorage();
    let changed = false;

    const updatedConvs = allConvs.map(conv => {
      if (conv.id !== chatId) return conv;

      const member = conv.members?.find(m => m.userId === currentUserId || m.username?.toLowerCase() === profile.name.toLowerCase());
      if (!member) return conv;

      changed = true;
      const updatedMembers = conv.members.map(m =>
        m.userId === currentUserId || m.username?.toLowerCase() === profile.name.toLowerCase()
          ? { ...m, lastReadAt: nowIso }
          : m
      );

      const updatedMessages = conv.messages.map(msg => {
        const readBy = msg.readBy || [msg.senderId];
        if (!readBy.includes(currentUserId)) {
          return {
            ...msg,
            readBy: [...readBy, currentUserId],
            status: 'read' as const
          };
        }
        return msg;
      });

      return {
        ...conv,
        members: updatedMembers,
        messages: updatedMessages
      };
    });

    if (changed) {
      saveConversationsToStorage(updatedConvs);
      setRawConversations(updatedConvs);
    }
  };

  const updateGroupChatInfo = (chatId: string, updates: { name?: string; avatar?: string }) => {
    const allConvs = loadConversationsFromStorage();
    const updatedConvs = allConvs.map(conv => {
      if (conv.id !== chatId || conv.type !== 'group') return conv;
      return {
        ...conv,
        name: updates.name ? updates.name.trim() : conv.name,
        avatar: updates.avatar ? updates.avatar.trim() : conv.avatar,
        updatedAt: new Date().toISOString()
      };
    });
    saveConversationsToStorage(updatedConvs);
    setRawConversations(updatedConvs);
  };

  const addGroupChatMember = (chatId: string, userId: string) => {
    const user = usersList.find(u => u.id === userId);
    if (!user) return;

    const nowIso = new Date().toISOString();
    const allConvs = loadConversationsFromStorage();

    const updatedConvs = allConvs.map(conv => {
      if (conv.id !== chatId || conv.type !== 'group') return conv;
      if (conv.members.some(m => m.userId === userId)) return conv;

      const newMember: ChatMember = {
        userId: user.id,
        username: user.name,
        userAvatar: user.avatar,
        userFrame: user.avatarFrame || 'standard',
        role: 'member',
        joinedAt: nowIso,
        lastReadAt: nowIso
      };

      const systemMsg: ChatMessage = {
        id: `msg_sys_${Date.now()}`,
        conversationId: chatId,
        senderId: profile.id,
        senderName: profile.name,
        senderAvatar: profile.avatar,
        content: `Użytkownik ${user.name} dołączył(a) do grupy.`,
        type: 'text',
        createdAt: nowIso,
        timeAgo: 'Przed chwilą',
        status: 'read',
        readBy: [profile.id]
      };

      return {
        ...conv,
        members: [...conv.members, newMember],
        messages: [...conv.messages, systemMsg],
        updatedAt: nowIso
      };
    });

    saveConversationsToStorage(updatedConvs);
    setRawConversations(updatedConvs);
  };

  const removeGroupChatMember = (chatId: string, userId: string) => {
    const allConvs = loadConversationsFromStorage();
    const nowIso = new Date().toISOString();

    const updatedConvs = allConvs.map(conv => {
      if (conv.id !== chatId || conv.type !== 'group') return conv;

      const targetMember = conv.members.find(m => m.userId === userId);
      if (!targetMember) return conv;

      const systemMsg: ChatMessage = {
        id: `msg_sys_${Date.now()}`,
        conversationId: chatId,
        senderId: profile.id,
        senderName: profile.name,
        senderAvatar: profile.avatar,
        content: `Użytkownik ${targetMember.username} został(a) usunięty(a) z grupy.`,
        type: 'text',
        createdAt: nowIso,
        timeAgo: 'Przed chwilą',
        status: 'read',
        readBy: [profile.id]
      };

      return {
        ...conv,
        members: conv.members.filter(m => m.userId !== userId),
        messages: [...conv.messages, systemMsg],
        updatedAt: nowIso
      };
    });

    saveConversationsToStorage(updatedConvs);
    setRawConversations(updatedConvs);
  };

  const updateGroupMemberRole = (chatId: string, userId: string, role: 'admin' | 'member') => {
    const allConvs = loadConversationsFromStorage();
    const updatedConvs = allConvs.map(conv => {
      if (conv.id !== chatId || conv.type !== 'group') return conv;

      return {
        ...conv,
        members: conv.members.map(m => m.userId === userId ? { ...m, role } : m),
        updatedAt: new Date().toISOString()
      };
    });

    saveConversationsToStorage(updatedConvs);
    setRawConversations(updatedConvs);
  };

  const leaveGroupChat = (chatId: string) => {
    removeGroupChatMember(chatId, profile.id);
    setSelectedChatId(null);
  };

  const toggleEventRSVP = (eventId: string, status: 'attending' | 'interested' | 'none') => {
    setEvents(events.map(ev => {
      if (ev.id === eventId) {
        const nextStatus = ev.userStatus === status ? 'none' : status;
        let diff = 0;
        if (ev.userStatus !== 'attending' && nextStatus === 'attending') diff = 1;
        if (ev.userStatus === 'attending' && nextStatus !== 'attending') diff = -1;

        const currentAttendees = ev.attendeesList || [];
        const filteredAttendees = currentAttendees.filter(a => a.id !== profile.id);
        const updatedAttendeesList = nextStatus !== 'none'
          ? [
              ...filteredAttendees,
              {
                id: profile.id,
                name: profile.name,
                avatar: profile.avatar,
                frame: profile.avatarFrame,
                status: nextStatus
              }
            ]
          : filteredAttendees;

        return {
          ...ev,
          userStatus: nextStatus,
          attendeesCount: Math.max(0, ev.attendeesCount + diff),
          attendeesList: updatedAttendeesList
        };
      }
      return ev;
    }));
    addXp(25);
  };

  const addEvent = (eventData: {
    title: string;
    description: string;
    dateStr: string;
    timeStr: string;
    location?: string;
    eventType: EventType;
    coverImage?: string;
    organizer?: string;
    isHighlighted?: boolean;
    hasReminder?: boolean;
    participantLimit?: number;
  }) => {
    if (profile.role !== 'ADMIN' && profile.role !== 'MODERATOR') return;

    const newEv: SocialEvent = {
      id: `ev_${Date.now()}`,
      title: eventData.title,
      description: eventData.description,
      dateStr: eventData.dateStr,
      timeStr: eventData.timeStr,
      location: eventData.location || 'Portal MaG / Whiteout Survival',
      eventType: eventData.eventType,
      coverImage: eventData.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
      attendeesCount: 1,
      userStatus: 'attending',
      organizer: eventData.organizer || profile.name,
      isHighlighted: Boolean(eventData.isHighlighted),
      hasReminder: Boolean(eventData.hasReminder),
      participantLimit: eventData.participantLimit,
      attendeesList: [
        {
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
          frame: profile.avatarFrame,
          status: 'attending'
        }
      ]
    };

    setEvents(prev => [newEv, ...prev]);
    addXp(50);
  };

  const updateEvent = (eventId: string, updatedData: Partial<SocialEvent>) => {
    if (profile.role !== 'ADMIN' && profile.role !== 'MODERATOR') return;
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...updatedData } : e));
  };

  const deleteEvent = (eventId: string) => {
    if (profile.role !== 'ADMIN' && profile.role !== 'MODERATOR') return;
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const toggleReelLike = (reelId: string) => {
    setReels(reels.map(r => {
      if (r.id === reelId) {
        const nextLiked = !r.isLiked;
        return {
          ...r,
          isLiked: nextLiked,
          likes: nextLiked ? r.likes + 1 : r.likes - 1
        };
      }
      return r;
    }));
  };

  const addReelComment = (reelId: string, content: string, parentId?: string, replyToUser?: string) => {
    if (!content.trim()) return;
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const existingList = r.commentList || [];
        const newComm = {
          id: `rc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          reelId,
          authorId: profile.id,
          authorName: profile.name,
          authorAvatar: profile.avatar,
          content: content.trim(),
          createdAt: 'Przed chwilą',
          likes: [],
          parentId,
          replyToUser
        };
        const updatedList = [...existingList, newComm];
        return {
          ...r,
          comments: updatedList.length,
          commentList: updatedList
        };
      }
      return r;
    }));
    addXp(10);
  };

  const likeReelComment = (reelId: string, commentId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const existingList = r.commentList || [];
        const updatedList = existingList.map(c => {
          if (c.id === commentId) {
            const hasLiked = c.likes.includes(profile.id);
            const nextLikes = hasLiked
              ? c.likes.filter(uid => uid !== profile.id)
              : [...c.likes, profile.id];
            return { ...c, likes: nextLikes };
          }
          return c;
        });
        return { ...r, commentList: updatedList };
      }
      return r;
    }));
  };

  const deleteReelComment = (reelId: string, commentId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const existingList = r.commentList || [];
        const updatedList = existingList.filter(c => c.id !== commentId && c.parentId !== commentId);
        return {
          ...r,
          comments: updatedList.length,
          commentList: updatedList
        };
      }
      return r;
    }));
  };

  const markNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // ================= ADMIN USER MANAGEMENT ACTIONS =================
  const updateUserRole = (userId: string, newRole: UserRole) => {
    if (profile.role !== 'ADMIN') return;
    const storedUsers: Record<string, UserAccountData> = JSON.parse(localStorage.getItem('mag_users_db') || '{}');
    
    Object.keys(storedUsers).forEach(key => {
      if (storedUsers[key].profile.id === userId) {
        storedUsers[key].profile.role = newRole;
      }
    });

    localStorage.setItem('mag_users_db', JSON.stringify(storedUsers));
    setUsersList(Object.values(storedUsers).map(u => u.profile));

    if (profile.id === userId) {
      setProfile(prev => ({ ...prev, role: newRole }));
    }
  };

  const updateUserAccountStatus = (userId: string, newStatus: UserAccountStatus) => {
    if (profile.role !== 'ADMIN') return;
    const storedUsers: Record<string, UserAccountData> = JSON.parse(localStorage.getItem('mag_users_db') || '{}');

    Object.keys(storedUsers).forEach(key => {
      if (storedUsers[key].profile.id === userId) {
        storedUsers[key].profile.accountStatus = newStatus;
      }
    });

    localStorage.setItem('mag_users_db', JSON.stringify(storedUsers));
    setUsersList(Object.values(storedUsers).map(u => u.profile));

    if (profile.id === userId) {
      setProfile(prev => ({ ...prev, accountStatus: newStatus }));
    }
  };

  // ================= GROUP & FORUM ACTIONS =================
  const createGroup = (groupData: {
    name: string;
    shortDescription: string;
    description: string;
    avatarImage: string;
    coverImage: string;
    category: string;
    visibility: GroupVisibility;
    rules: string;
  }) => {
    if (profile.role !== 'ADMIN') return;

    const newGroup: Group = {
      id: `grp_${Date.now()}`,
      name: groupData.name,
      shortDescription: groupData.shortDescription,
      description: groupData.description,
      avatarImage: groupData.avatarImage || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
      coverImage: groupData.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
      category: groupData.category || 'Społeczność',
      visibility: groupData.visibility,
      rules: groupData.rules || 'Szanuj innych członków i przestrzegaj zasad Portalu MaG.',
      ownerId: profile.id,
      membersCount: 1,
      newActivitiesCount: 0,
      members: [
        {
          userId: profile.id,
          username: profile.name,
          userAvatar: profile.avatar,
          role: 'OWNER',
          joinedAt: new Date().toLocaleDateString('pl-PL')
        }
      ],
      joinRequests: [],
      announcements: [],
      forumSections: [],
      forumTopics: [],
      wallPosts: [],
      createdAt: new Date().toLocaleDateString('pl-PL'),
      isJoined: true
    };

    setGroups(prev => [newGroup, ...prev]);
    addXp(100);
  };

  const updateGroup = (groupId: string, updatedData: Partial<Group>) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id === groupId) {
        return { ...grp, ...updatedData };
      }
      return grp;
    }));
  };

  const deleteGroup = (groupId: string) => {
    if (profile.role !== 'ADMIN') return;
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const toggleGroupJoin = (groupId: string) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      const isAlreadyMember = grp.members.some(m => m.userId === profile.id);

      if (isAlreadyMember) {
        // Leave group
        const newMembers = grp.members.filter(m => m.userId !== profile.id);
        return {
          ...grp,
          members: newMembers,
          membersCount: Math.max(0, newMembers.length),
          isJoined: false
        };
      }

      // If Public: direct join
      if (grp.visibility === 'PUBLICZNA') {
        const newMembers = [
          ...grp.members,
          {
            userId: profile.id,
            username: profile.name,
            userAvatar: profile.avatar,
            role: 'MEMBER' as GroupMemberRole,
            joinedAt: new Date().toLocaleDateString('pl-PL')
          }
        ];
        return {
          ...grp,
          members: newMembers,
          membersCount: newMembers.length,
          isJoined: true
        };
      } else {
        // Private group: send request if not already pending
        const existingReq = grp.joinRequests.some(r => r.userId === profile.id);
        if (existingReq) {
          // Cancel request
          return {
            ...grp,
            joinRequests: grp.joinRequests.filter(r => r.userId !== profile.id)
          };
        } else {
          // Send join request
          const newRequest = {
            id: `req_${Date.now()}`,
            groupId,
            userId: profile.id,
            username: profile.name,
            userAvatar: profile.avatar,
            requestedAt: new Date().toLocaleDateString('pl-PL')
          };
          return {
            ...grp,
            joinRequests: [...grp.joinRequests, newRequest]
          };
        }
      }
    }));
  };

  const handleJoinRequest = (groupId: string, requestId: string, accept: boolean) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      const requestObj = grp.joinRequests.find(r => r.id === requestId);
      if (!requestObj) return grp;

      const updatedRequests = grp.joinRequests.filter(r => r.id !== requestId);

      if (accept) {
        const newMember = {
          userId: requestObj.userId,
          username: requestObj.username,
          userAvatar: requestObj.userAvatar,
          role: 'MEMBER' as GroupMemberRole,
          joinedAt: new Date().toLocaleDateString('pl-PL')
        };
        const updatedMembers = [...grp.members, newMember];

        // Trigger notification for accepted user
        if (requestObj.userId === profile.id) {
          setNotifications(n => [
            {
              id: `notif_${Date.now()}`,
              title: 'Zaakceptowano dołączenie do grupy',
              message: `Twoja prośba o dołączenie do grupy "${grp.name}" została zaakceptowana!`,
              timeAgo: 'Przed chwilą',
              read: false,
              type: 'group'
            },
            ...n
          ]);
        }

        return {
          ...grp,
          joinRequests: updatedRequests,
          members: updatedMembers,
          membersCount: updatedMembers.length
        };
      } else {
        return {
          ...grp,
          joinRequests: updatedRequests
        };
      }
    }));
  };

  // FORUM SECTION ACTIONS
  const addForumSection = (groupId: string, sectionData: { name: string; description: string; iconName?: string }) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      const newSec: ForumSection = {
        id: `sec_${Date.now()}`,
        groupId,
        name: sectionData.name,
        description: sectionData.description,
        iconName: sectionData.iconName || 'Folder',
        order: grp.forumSections.length + 1
      };

      return {
        ...grp,
        forumSections: [...grp.forumSections, newSec]
      };
    }));
    addXp(30);
  };

  const updateForumSection = (groupId: string, sectionId: string, sectionData: { name: string; description: string; iconName?: string }) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        forumSections: grp.forumSections.map(sec => {
          if (sec.id === sectionId) {
            return { ...sec, ...sectionData };
          }
          return sec;
        })
      };
    }));
  };

  const deleteForumSection = (groupId: string, sectionId: string) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        forumSections: grp.forumSections.filter(s => s.id !== sectionId),
        forumTopics: grp.forumTopics.filter(t => t.sectionId !== sectionId)
      };
    }));
  };

  const reorderForumSections = (groupId: string, orderedSectionIds: string[]) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      const sectionMap = new Map<string, ForumSection>(grp.forumSections.map(s => [s.id, s]));
      const newSections: ForumSection[] = [];
      orderedSectionIds.forEach((id, idx) => {
        const sec = sectionMap.get(id);
        if (sec) {
          newSections.push({
            id: sec.id,
            groupId: sec.groupId,
            name: sec.name,
            description: sec.description,
            iconName: sec.iconName,
            order: idx + 1
          });
        }
      });

      return {
        ...grp,
        forumSections: newSections
      };
    }));
  };

  // FORUM TOPIC ACTIONS
  const addForumTopic = (
    groupId: string,
    sectionId: string,
    topicData: { title: string; content: string; image?: string; linkUrl?: string; youtubeId?: string }
  ) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      const newTopic: ForumTopic = {
        id: `top_${Date.now()}`,
        sectionId,
        groupId,
        authorId: profile.id,
        authorName: profile.name,
        authorAvatar: profile.avatar,
        title: topicData.title,
        content: topicData.content,
        image: topicData.image,
        linkUrl: topicData.linkUrl,
        youtubeId: topicData.youtubeId,
        createdAt: new Date().toLocaleString('pl-PL'),
        isPinned: false,
        isLocked: false,
        viewsCount: 1,
        replies: []
      };

      return {
        ...grp,
        forumTopics: [newTopic, ...grp.forumTopics],
        newActivitiesCount: grp.newActivitiesCount + 1
      };
    }));
    addXp(40);
  };

  const updateForumTopic = (groupId: string, topicId: string, topicData: { title: string; content: string }) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        forumTopics: grp.forumTopics.map(top => {
          if (top.id === topicId) {
            return {
              ...top,
              title: topicData.title,
              content: topicData.content,
              updatedAt: new Date().toLocaleString('pl-PL')
            };
          }
          return top;
        })
      };
    }));
  };

  const deleteForumTopic = (groupId: string, topicId: string) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        forumTopics: grp.forumTopics.filter(t => t.id !== topicId)
      };
    }));
  };

  const togglePinTopic = (groupId: string, topicId: string) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        forumTopics: grp.forumTopics.map(t => {
          if (t.id === topicId) {
            return { ...t, isPinned: !t.isPinned };
          }
          return t;
        })
      };
    }));
  };

  const toggleLockTopic = (groupId: string, topicId: string) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        forumTopics: grp.forumTopics.map(t => {
          if (t.id === topicId) {
            return { ...t, isLocked: !t.isLocked };
          }
          return t;
        })
      };
    }));
  };

  // FORUM REPLY ACTIONS
  const addForumReply = (
    groupId: string,
    topicId: string,
    replyData: { content: string; image?: string; linkUrl?: string; youtubeId?: string }
  ) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        forumTopics: grp.forumTopics.map(top => {
          if (top.id !== topicId) return top;

          const newReply: ForumReply = {
            id: `rep_${Date.now()}`,
            topicId,
            authorId: profile.id,
            authorName: profile.name,
            authorAvatar: profile.avatar,
            content: replyData.content,
            image: replyData.image,
            linkUrl: replyData.linkUrl,
            youtubeId: replyData.youtubeId,
            createdAt: new Date().toLocaleString('pl-PL'),
            likes: []
          };

          // Notify topic author if different
          if (top.authorId !== profile.id) {
            setNotifications(n => [
              {
                id: `notif_${Date.now()}`,
                title: 'Nowa odpowiedź w Twoim temacie',
                message: `${profile.name} odpowiedział/a na Twój temat "${top.title}" w grupie "${grp.name}"`,
                timeAgo: 'Przed chwilą',
                read: false,
                type: 'group'
              },
              ...n
            ]);
          }

          return {
            ...top,
            replies: [...top.replies, newReply],
            lastReplyAt: new Date().toLocaleString('pl-PL'),
            lastReplyAuthor: profile.name
          };
        })
      };
    }));
    addXp(15);
  };

  const updateForumReply = (groupId: string, topicId: string, replyId: string, content: string) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        forumTopics: grp.forumTopics.map(top => {
          if (top.id !== topicId) return top;

          return {
            ...top,
            replies: top.replies.map(rep => {
              if (rep.id === replyId) {
                return { ...rep, content, updatedAt: new Date().toLocaleString('pl-PL') };
              }
              return rep;
            })
          };
        })
      };
    }));
  };

  const deleteForumReply = (groupId: string, topicId: string, replyId: string) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        forumTopics: grp.forumTopics.map(top => {
          if (top.id !== topicId) return top;

          return {
            ...top,
            replies: top.replies.filter(rep => rep.id !== replyId)
          };
        })
      };
    }));
  };

  const likeForumReply = (groupId: string, topicId: string, replyId: string) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        forumTopics: grp.forumTopics.map(top => {
          if (top.id !== topicId) return top;

          return {
            ...top,
            replies: top.replies.map(rep => {
              if (rep.id === replyId) {
                const hasLiked = rep.likes.includes(profile.id);
                return {
                  ...rep,
                  likes: hasLiked ? rep.likes.filter(id => id !== profile.id) : [...rep.likes, profile.id]
                };
              }
              return rep;
            })
          };
        })
      };
    }));
  };

  // GROUP WALL ACTIONS
  const addWallPost = (groupId: string, postData: { content: string; image?: string; linkUrl?: string; youtubeId?: string }) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      const newWallPost: GroupWallPost = {
        id: `wall_${Date.now()}`,
        groupId,
        authorId: profile.id,
        authorName: profile.name,
        authorAvatar: profile.avatar,
        content: postData.content,
        image: postData.image,
        linkUrl: postData.linkUrl,
        youtubeId: postData.youtubeId,
        createdAt: 'Przed chwilą',
        likes: [],
        comments: []
      };

      return {
        ...grp,
        wallPosts: [newWallPost, ...grp.wallPosts]
      };
    }));
    addXp(25);
  };

  const addWallPostComment = (groupId: string, postId: string, content: string) => {
    if (!content.trim()) return;

    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        wallPosts: grp.wallPosts.map(p => {
          if (p.id !== postId) return p;

          const newComment = {
            id: `wcomm_${Date.now()}`,
            authorId: profile.id,
            authorName: profile.name,
            authorAvatar: profile.avatar,
            content,
            createdAt: 'Przed chwilą'
          };

          return {
            ...p,
            comments: [...p.comments, newComment]
          };
        })
      };
    }));
    addXp(10);
  };

  const likeWallPost = (groupId: string, postId: string) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        wallPosts: grp.wallPosts.map(p => {
          if (p.id !== postId) return p;

          const hasLiked = p.likes.includes(profile.id);
          return {
            ...p,
            likes: hasLiked ? p.likes.filter(id => id !== profile.id) : [...p.likes, profile.id]
          };
        })
      };
    }));
  };

  // ANNOUNCEMENT ACTIONS
  const addAnnouncement = (groupId: string, title: string, content: string, isPinned = true) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      const newAnn: GroupAnnouncement = {
        id: `ann_${Date.now()}`,
        groupId,
        authorName: profile.name,
        authorAvatar: profile.avatar,
        title,
        content,
        createdAt: new Date().toLocaleDateString('pl-PL'),
        isPinned
      };

      return {
        ...grp,
        announcements: [newAnn, ...grp.announcements]
      };
    }));
    addXp(30);
  };

  const deleteAnnouncement = (groupId: string, announcementId: string) => {
    setGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;

      return {
        ...grp,
        announcements: grp.announcements.filter(a => a.id !== announcementId)
      };
    }));
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedChatId,
        setSelectedChatId,
        profile,
        setProfile,
        usersList,
        posts,
        chats,
        events,
        groups,
        games,
        reels,
        notifications,
        unreadNotificationsCount,
        totalUnreadMessages,
        soundEnabled,
        setSoundEnabled,
        shaderQuality,
        setShaderQuality,
        isAuthenticated,
        animationState,
        login,
        logout,
        addPost,
        addReel,
        likePost,
        addPostComment,
        sendMessage,
        getOrCreateDirectChat,
        createGroupChat,
        sendChatMessage,
        toggleMessageReaction,
        markChatAsRead,
        updateGroupChatInfo,
        addGroupChatMember,
        removeGroupChatMember,
        updateGroupMemberRole,
        leaveGroupChat,
        toggleEventRSVP,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleReelLike,
        addReelComment,
        likeReelComment,
        deleteReelComment,
        markNotificationsRead,
        addXp,
        playShardSound,
        updateUserRole,
        updateUserAccountStatus,
        createGroup,
        updateGroup,
        deleteGroup,
        toggleGroupJoin,
        handleJoinRequest,
        addForumSection,
        updateForumSection,
        deleteForumSection,
        reorderForumSections,
        addForumTopic,
        updateForumTopic,
        deleteForumTopic,
        togglePinTopic,
        toggleLockTopic,
        addForumReply,
        updateForumReply,
        deleteForumReply,
        likeForumReply,
        addWallPost,
        addWallPostComment,
        likeWallPost,
        addAnnouncement,
        deleteAnnouncement,
        announcements,
        unreadAnnouncementsCount,
        previewAnnouncement,
        setPreviewAnnouncement,
        activeAnnouncementModal,
        setActiveAnnouncementModal,
        createPortalAnnouncement,
        updatePortalAnnouncement,
        deletePortalAnnouncement,
        confirmAnnouncementRead,
        updateUserPermissions,
        portalTheme,
        setPortalTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
