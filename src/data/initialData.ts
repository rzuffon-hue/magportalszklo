import { UserProfile, Post, ChatConversation, SocialEvent, Group, GameItem, Reel, NotificationItem } from '../types';

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

export const initialReels: Reel[] = [
  {
    id: 'reel_1',
    authorName: 'Rzaba',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title: 'Oficjalny zwiastun Sojuszu MaG! 🛡️✨',
    videoBg: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
    type: 'youtube',
    youtubeId: 'dQw4w9WgXcQ',
    likes: 18,
    comments: 3,
    shares: 5,
    isLiked: false,
    tags: ['#MaG', '#Sojusz', '#Aero'],
    commentList: [
      {
        id: 'rc_1',
        reelId: 'reel_1',
        authorId: 'usr_bibi',
        authorName: 'Bibi',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'Świetny montaż! Wygląda rewelacyjnie. 🚀',
        createdAt: '1 godz. temu',
        likes: ['usr_rzaba'],
      },
      {
        id: 'rc_2',
        reelId: 'reel_1',
        authorId: 'usr_rzaba',
        authorName: 'Rzaba',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Dzięki Bibi! Szykujemy więcej materiałów z turnieju.',
        createdAt: '30 min. temu',
        likes: [],
        parentId: 'rc_1',
        replyToUser: 'Bibi'
      },
      {
        id: 'rc_3',
        reelId: 'reel_1',
        authorId: 'usr_gawron',
        authorName: 'Gawron',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        content: 'Kiedy kolejny odcinek? Dołączam do grupy!',
        createdAt: '10 min. temu',
        likes: ['usr_bibi']
      }
    ]
  },
  {
    id: 'reel_2',
    authorName: 'Bibi',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Nowe tarcze i pancerze w zbrojowni! ⚔️',
    videoBg: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800',
    type: 'image',
    likes: 24,
    comments: 1,
    shares: 2,
    isLiked: true,
    tags: ['#Zbrojownia', '#Ekwipunek', '#Kuznia'],
    commentList: [
      {
        id: 'rc_4',
        reelId: 'reel_2',
        authorId: 'usr_rzaba',
        authorName: 'Rzaba',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Statystyki obrony kosmiczne! 🛡️',
        createdAt: '2 godz. temu',
        likes: ['usr_bibi']
      }
    ]
  },
  {
    id: 'reel_3',
    authorName: 'Gawron',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    title: 'Nocny rajd na smoczą twierdzę 🐉🔥',
    videoBg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    type: 'image',
    likes: 42,
    comments: 0,
    shares: 9,
    isLiked: false,
    tags: ['#Rajd', '#Smok', '#Turniej'],
    commentList: []
  }
];

export const initialNotifications: NotificationItem[] = [];
