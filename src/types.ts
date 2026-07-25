export type AppView = 'home' | 'sciana' | 'czaty' | 'reels' | 'grupy' | 'gry' | 'wydarzenia' | 'profil' | 'admin' | 'miasto';

export type PortalTheme = 'mroczny' | 'lustrzany' | 'komiksowy';
export type UserRole = 'USER' | 'MODERATOR' | 'R4 MaG' | 'ADMIN';
export type UserAccountStatus = 'active' | 'blocked';
export type AvatarFrameStyle = 'standard' | 'ice' | 'gold' | 'emerald' | 'crimson' | 'mag' | 'admin_frame' | 'r4_frame' | 'moderator_frame';

export interface CityStats {
  likesGiven: number;
  commentsWritten: number;
  likesReceived: number;
}

export interface UserCityData {
  level: number;
  stats: CityStats;
  lastUpgradedAt?: string;
  cityName?: string;
  buildingLevels?: Record<string, number>;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  avatarFrame?: AvatarFrameStyle;
  role: UserRole;
  accountStatus: UserAccountStatus;
  createdAt?: string;
  level: number;
  xp: number;
  maxXp: number;
  title: string;
  status: 'online' | 'offline' | 'ingame';
  bio: string;
  alliance?: string;
  wosNick?: string;
  wosPlayerId?: string;
  stateCountry?: string;
  socialLinks?: {
    discord?: string;
    youtube?: string;
    facebook?: string;
  };
  badges: Array<{ id: string; name: string; icon: string; color: string }>;
  permissions?: string[];
  stats: {
    postsCount: number;
    friendsCount: number;
    eventsAttended: number;
    gamesPlayed: number;
  };
  cityData?: UserCityData;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  likes: number;
  commentsCount: number;
  comments: PostComment[];
  isLiked?: boolean;
  image?: string;
  linkUrl?: string;
  youtubeId?: string;
  badge?: string;
}

export type ChatMessageType = 'text' | 'image' | 'gif';

export interface ChatMessageReplyTo {
  id: string;
  senderName: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderFrame?: AvatarFrameStyle;
  content: string;
  type?: ChatMessageType;
  mediaUrl?: string;
  replyTo?: ChatMessageReplyTo;
  reactions?: Record<string, string[]>; // emoji -> userIds
  createdAt: string;
  timeAgo?: string;
  status?: 'sent' | 'delivered' | 'read';
  readBy?: string[];
  isMe?: boolean;
}

export interface ChatMember {
  userId: string;
  username: string;
  userAvatar: string;
  userFrame?: AvatarFrameStyle;
  role: 'admin' | 'member';
  joinedAt: string;
  lastReadAt: string;
}

export interface ChatConversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: ChatMember[];
  messages: ChatMessage[];
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSenderId?: string;
  lastMessageStatus?: 'sent' | 'delivered' | 'read';
  unreadCount?: number;
  user?: {
    id: string;
    name: string;
    avatar: string;
    frame?: AvatarFrameStyle;
    status: 'online' | 'offline' | 'ingame';
    title?: string;
    role?: UserRole;
  };
}

export interface ReelComment {
  id: string;
  reelId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: string[]; // userIds
  parentId?: string; // if set, it is a 1-level nested reply
  replyToUser?: string; // username being replied to
}

export interface Reel {
  id: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  videoBg: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  tags: string[];
  type?: 'image' | 'youtube';
  youtubeId?: string;
  commentList?: ReelComment[];
}

// ================= GRUPY & FORUM MODELS =================
export type GroupVisibility = 'PUBLICZNA' | 'PRYWATNA';
export type GroupMemberRole = 'OWNER' | 'MODERATOR' | 'MEMBER';

export interface GroupMember {
  userId: string;
  username: string;
  userAvatar: string;
  role: GroupMemberRole;
  joinedAt: string;
  isBlocked?: boolean;
}

export interface GroupJoinRequest {
  id: string;
  groupId: string;
  userId: string;
  username: string;
  userAvatar: string;
  requestedAt: string;
}

export interface GroupAnnouncement {
  id: string;
  groupId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  createdAt: string;
  isPinned: boolean;
}

export interface GroupWallPostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface GroupWallPost {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  image?: string;
  linkUrl?: string;
  youtubeId?: string;
  createdAt: string;
  likes: string[]; // userIds
  comments: GroupWallPostComment[];
}

export interface ForumReply {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  image?: string;
  linkUrl?: string;
  youtubeId?: string;
  createdAt: string;
  updatedAt?: string;
  likes: string[]; // userIds
}

export interface ForumTopic {
  id: string;
  sectionId: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  image?: string;
  linkUrl?: string;
  youtubeId?: string;
  createdAt: string;
  updatedAt?: string;
  isPinned: boolean;
  isLocked: boolean;
  viewsCount: number;
  replies: ForumReply[];
  lastReplyAt?: string;
  lastReplyAuthor?: string;
}

export interface ForumSection {
  id: string;
  groupId: string;
  name: string;
  description: string;
  iconName?: string;
  order: number;
}

export interface Group {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  avatarImage: string;
  category: string;
  visibility: GroupVisibility; // 'PUBLICZNA' | 'PRYWATNA'
  rules: string;
  ownerId: string;
  membersCount: number;
  newActivitiesCount: number;
  members: GroupMember[];
  joinRequests: GroupJoinRequest[];
  announcements: GroupAnnouncement[];
  forumSections: ForumSection[];
  forumTopics: ForumTopic[];
  wallPosts: GroupWallPost[];
  createdAt: string;
  isArchived?: boolean;
  isJoined?: boolean; // dynamic property for current user
}

export interface GameItem {
  id: string;
  title: string;
  genre: string;
  coverImage: string;
  activePlayersCount: number;
  friendsPlaying: Array<{ id: string; name: string; avatar: string }>;
  rating: number;
}

export type EventType =
  | 'Pułapka na Niedźwiedzia'
  | 'Odlewnia'
  | 'Kanion'
  | 'SVS'
  | 'Turniej'
  | 'Spotkanie'
  | 'Inne';

export interface SocialEventAttendee {
  id: string;
  name: string;
  avatar: string;
  frame?: AvatarFrameStyle;
  status: 'attending' | 'interested' | 'none';
}

export interface SocialEvent {
  id: string;
  title: string;
  dateStr: string;
  timeStr: string;
  location: string;
  description: string;
  coverImage: string;
  attendeesCount: number;
  userStatus: 'attending' | 'interested' | 'none';
  organizer: string;
  eventType?: EventType;
  isHighlighted?: boolean;
  hasReminder?: boolean;
  participantLimit?: number;
  attendeesList?: SocialEventAttendee[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: 'chat' | 'post' | 'event' | 'system' | 'group';
}

export interface UserAccountData {
  username: string;
  pinHash: string;
  profile: UserProfile;
  createdAt: string;
}

// ================= ANNOUNCEMENTS SYSTEM MODELS =================
export type AnnouncementCategory =
  | 'WAŻNE'
  | 'TURNIEJ'
  | 'WYDARZENIE'
  | 'GRY'
  | 'SOJUSZ'
  | 'AKTUALIZACJA'
  | 'OSTRZEŻENIE'
  | 'INFORMACJA';

export type AnnouncementRequirement = 'ZWYKŁE' | 'WYMAGA_POTWIERDZENIA';

export interface AnnouncementConfirmation {
  userId: string;
  username: string;
  userAvatar: string;
  readAt: string;
  confirmedAt?: string;
}

export interface PortalAnnouncement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  requirement: AnnouncementRequirement;
  
  // Optional fields
  eventDate?: string; // e.g. "2026-07-28"
  eventTime?: string; // e.g. "20:00"
  linkUrl?: string; // External link
  imageUrl?: string; // Graphic header
  portalTargetView?: AppView; // AppView target when clicking CTA
  portalTargetId?: string; // Target entity ID
  ctaLabel?: string; // Custom button text e.g. "ZOBACZ TURNIEJ"
  
  // Scheduling & Validity
  publishType: 'now' | 'scheduled';
  scheduledPublishAt?: string; // ISO string or time string
  expiresAt?: string; // ISO date or empty
  
  // Author & Metadata
  createdByUserId: string;
  createdByName: string;
  createdByAvatar: string;
  createdAt: string;
  
  // Status
  status: 'active' | 'scheduled' | 'completed';
  
  // Confirmations list
  confirmations: AnnouncementConfirmation[];
}

