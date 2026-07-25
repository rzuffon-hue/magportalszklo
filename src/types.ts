export type AppView = 'home' | 'sciana' | 'czaty' | 'reels' | 'grupy' | 'gry' | 'wydarzenia' | 'profil' | 'admin';

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';
export type UserAccountStatus = 'active' | 'blocked';
export type AvatarFrameStyle = 'standard' | 'ice' | 'gold' | 'emerald' | 'crimson' | 'mag';

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
  stats: {
    postsCount: number;
    friendsCount: number;
    eventsAttended: number;
    gamesPlayed: number;
  };
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

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timeAgo: string;
  isMe?: boolean;
}

export interface ChatConversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  };
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
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
