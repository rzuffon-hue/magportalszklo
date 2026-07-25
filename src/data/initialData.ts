import { UserProfile, Post, ChatConversation, SocialEvent, Group, GameItem, Reel, NotificationItem, PortalAnnouncement } from '../types';

export const initialProfile: UserProfile = {
  id: 'guest',
  name: 'Użytkownik',
  role: 'USER',
  accountStatus: 'active',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 1,
  xp: 0,
  maxXp: 1000,
  title: 'Członek Portalu MaG',
  status: 'online',
  bio: 'Nowy wędrowiec w Portalu MaG.',
  badges: [],
  stats: {
    postsCount: 0,
    friendsCount: 0,
    eventsAttended: 0,
    gamesPlayed: 0
  }
};

export const initialPosts: Post[] = [];

export const initialChats: ChatConversation[] = [];

export const initialEvents: SocialEvent[] = [];

export const initialGroups: Group[] = [];

export const initialGames: GameItem[] = [];

export interface ReelComment {
  id: string;
  reelId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: string[];
  parentId?: string;
  replyToUser?: string;
}

export const initialReels: Reel[] = [];

export const initialNotifications: NotificationItem[] = [];

export const initialAnnouncements: PortalAnnouncement[] = [];

