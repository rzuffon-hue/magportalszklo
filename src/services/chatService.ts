import { ChatConversation, ChatMessage, ChatMessageType, ChatMessageReplyTo, UserProfile, UserAccountData } from '../types';

export const SEED_USERS: Record<string, UserAccountData> = {
  rzaba: {
    username: 'Rzaba',
    pinHash: '',
    createdAt: '2026-01-15',
    profile: {
      id: 'usr_rzaba',
      name: 'Rzaba',
      role: 'ADMIN',
      accountStatus: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000',
      avatarFrame: 'emerald',
      level: 15,
      xp: 450,
      maxXp: 1200,
      title: 'Przywódca Sojuszu MaG',
      status: 'online',
      bio: 'Główny dowódca Sojuszu MaG w Whiteout Survival. Zawsze gotowy na rajd!',
      alliance: 'MaG',
      wosNick: 'MaG_Rzaba',
      wosPlayerId: '9842104',
      stateCountry: 'PL / S104',
      badges: [{ id: 'b1', name: 'Założyciel', icon: 'Crown', color: '#f59e0b' }],
      stats: { postsCount: 0, friendsCount: 0, eventsAttended: 0, gamesPlayed: 0 }
    }
  }
};

export function seedUsersDatabase(): Record<string, UserAccountData> {
  const existingRaw = localStorage.getItem('mag_users_db');
  let storedUsers: Record<string, UserAccountData> = {};
  if (existingRaw) {
    try {
      storedUsers = JSON.parse(existingRaw);
    } catch {
      storedUsers = {};
    }
  }

  // Ensure rzaba always exists
  if (!storedUsers['rzaba']) {
    storedUsers['rzaba'] = SEED_USERS.rzaba;
  }

  localStorage.setItem('mag_users_db', JSON.stringify(storedUsers));
  return storedUsers;
}

export const INITIAL_CONVERSATIONS: ChatConversation[] = [];

export function loadConversationsFromStorage(): ChatConversation[] {
  const saved = localStorage.getItem('mag_conversations_db');
  if (saved) {
    try {
      const parsed: ChatConversation[] = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback
    }
  }
  localStorage.setItem('mag_conversations_db', JSON.stringify(INITIAL_CONVERSATIONS));
  return INITIAL_CONVERSATIONS;
}

export function saveConversationsToStorage(conversations: ChatConversation[]): void {
  localStorage.setItem('mag_conversations_db', JSON.stringify(conversations));
}
