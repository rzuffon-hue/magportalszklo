import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AvatarWithFrame } from '../AvatarWithFrame';
import { UserProfileModal } from '../UserProfileModal';
import { UserProfile, ChatConversation, ChatMessage, ChatMessageType, ChatMessageReplyTo } from '../../types';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Image as ImageIcon,
  Smile,
  X,
  Check,
  CheckCheck,
  ArrowLeft,
  Users,
  Info,
  UserPlus,
  Trash2,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  LogOut,
  Edit3
} from 'lucide-react';

const QUICK_EMOJIS = ['❤️', '😂', '👍', '🔥', '😮', '😢', '⚔️', '🛡️', '✨', '🚀', '💎', '🐉'];

const QUICK_GIFS = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3pueWFxdzNyZXVpM3p4ZXExNDhkbTVjcjN5emEwdTZnM3h4NXltZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGFyMnQ3dW5vZ2Vrb2U5NHdsaWdqNzlsbnd1YWR6YzRwNW5ibW5hOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1QMTl9ggmYvJgy05J/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmNrdDVxOHg2aGVkZmcxbmlubHF3aG0xeTdmZmJjcTNkcnAxdWlzciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKrEzvLbsVAud8I/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDVqbmtrNmRrcGg5a2NlZTR1cnFsdTBuaGR0NHZldXprcnJ0bzRvaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d4aU235GYA45G/giphy.gif'
];

export const CzatyView: React.FC = () => {
  const {
    chats,
    selectedChatId,
    setSelectedChatId,
    profile,
    usersList,
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
    portalTheme
  } = useApp();

  const isMirror = portalTheme === 'lustrzany';

  // Navigation & Search State
  const [listSearch, setListSearch] = useState('');
  const [showListSearchInput, setShowListSearchInput] = useState(false);
  const [activeTabMobile, setActiveTabMobile] = useState<'list' | 'chat'>('list');

  // New Conversation Modal State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatType, setNewChatType] = useState<'select' | 'direct' | 'group'>('select');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedGroupUserIds, setSelectedGroupUserIds] = useState<string[]>([]);
  const [groupStep, setGroupStep] = useState<1 | 2>(1);
  const [groupNameInput, setGroupNameInput] = useState('');
  const [groupAvatarInput, setGroupAvatarInput] = useState('');

  // Active Chat State
  const [msgInput, setMsgInput] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'gif'>('image');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showReactionPickerMsgId, setShowReactionPickerMsgId] = useState<string | null>(null);

  // Group Info Modal State
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [addMemberSearch, setAddMemberSearch] = useState('');
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupAvatar, setEditGroupAvatar] = useState('');
  const [isEditingGroup, setIsEditingGroup] = useState(false);

  // Public Profile View Modal State
  const [viewingProfileUser, setViewingProfileUser] = useState<UserProfile | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active Chat Object
  const activeChat = chats.find(c => c.id === selectedChatId) || (chats.length > 0 ? chats[0] : null);

  // Auto-mark active chat as read when opened or new messages arrive
  useEffect(() => {
    if (activeChat) {
      markChatAsRead(activeChat.id);
    }
  }, [activeChat?.id, activeChat?.messages?.length]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length, activeChat?.id]);

  // Sync mobile view tab
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setActiveTabMobile('chat');
  };

  // Filtered Chats for Conversation List
  const filteredChats = chats.filter(chat => {
    if (!listSearch.trim()) return true;
    const searchLower = listSearch.toLowerCase();
    if (chat.type === 'group') {
      return chat.name?.toLowerCase().includes(searchLower);
    }
    return chat.user?.name.toLowerCase().includes(searchLower) || chat.user?.title?.toLowerCase().includes(searchLower);
  });

  // Registered Users for Direct Chat (excluding current user)
  const registeredOtherUsers = usersList.filter(u => {
    if (u.id === profile.id || u.name.toLowerCase() === profile.name.toLowerCase()) return false;
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.wosNick && u.wosNick.toLowerCase().includes(q)) ||
      (u.title && u.title.toLowerCase().includes(q))
    );
  });

  // Start Direct Chat
  const handleStartDirectChat = (targetUser: UserProfile) => {
    const chatId = getOrCreateDirectChat(targetUser);
    setShowNewChatModal(false);
    setNewChatType('select');
    setUserSearchQuery('');
    handleSelectChat(chatId);
  };

  // Toggle user selection for group creation
  const handleToggleGroupUser = (userId: string) => {
    if (selectedGroupUserIds.includes(userId)) {
      setSelectedGroupUserIds(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedGroupUserIds(prev => [...prev, userId]);
    }
  };

  // Create Group Chat Handler
  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupNameInput.trim() || selectedGroupUserIds.length < 2) return;
    const newGrpId = createGroupChat(groupNameInput, selectedGroupUserIds, groupAvatarInput);
    setShowNewChatModal(false);
    setNewChatType('select');
    setGroupStep(1);
    setGroupNameInput('');
    setGroupAvatarInput('');
    setSelectedGroupUserIds([]);
    handleSelectChat(newGrpId);
  };

  // Send Message Handler
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeChat) return;

    if (mediaUrlInput.trim()) {
      sendChatMessage(
        activeChat.id,
        msgInput.trim(),
        mediaType,
        mediaUrlInput.trim(),
        replyingTo ? { id: replyingTo.id, senderName: replyingTo.senderName, content: replyingTo.content } : undefined
      );
      setMediaUrlInput('');
      setShowAttachMenu(false);
    } else if (msgInput.trim()) {
      sendChatMessage(
        activeChat.id,
        msgInput.trim(),
        'text',
        undefined,
        replyingTo ? { id: replyingTo.id, senderName: replyingTo.senderName, content: replyingTo.content } : undefined
      );
    } else {
      return;
    }

    setMsgInput('');
    setReplyingTo(null);
  };

  // Quick Emoji Click Handler
  const handleInsertEmoji = (emoji: string) => {
    setMsgInput(prev => prev + emoji);
  };

  // Quick GIF Selection Handler
  const handleSelectGif = (gifUrl: string) => {
    if (!activeChat) return;
    sendChatMessage(
      activeChat.id,
      '',
      'gif',
      gifUrl,
      replyingTo ? { id: replyingTo.id, senderName: replyingTo.senderName, content: replyingTo.content } : undefined
    );
    setShowAttachMenu(false);
    setReplyingTo(null);
  };

  // Render Status Checkmarks for Sent Messages
  const renderMessageStatus = (msg: ChatMessage) => {
    if (!msg.isMe) return null;
    const isRead = msg.status === 'read' || (msg.readBy && msg.readBy.length > 1);
    const isDelivered = msg.status === 'delivered' || isRead;

    if (isRead) {
      return <CheckCheck className="w-3.5 h-3.5 text-purple-400 inline ml-1" title="Przeczytano" />;
    }
    if (isDelivered) {
      return <CheckCheck className="w-3.5 h-3.5 text-slate-400 inline ml-1" title="Dostarczono" />;
    }
    return <Check className="w-3.5 h-3.5 text-slate-500 inline ml-1" title="Wysłano" />;
  };

  // Is current user Admin of Active Group Chat?
  const isCurrentGroupAdmin = activeChat?.type === 'group' && activeChat.members.some(m => m.userId === profile.id && m.role === 'admin');

  return (
    <div className={`h-full w-full flex flex-col overflow-hidden font-sans ${isMirror ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* 1. TOP COMPACT HEADER */}
      <div className={`shrink-0 h-14 px-3 sm:px-6 border-b backdrop-blur-xl flex items-center justify-between z-20 ${
        isMirror ? 'bg-white/95 border-slate-300 text-slate-950 shadow-sm' : 'bg-slate-950/90 border-purple-500/20 text-slate-100'
      }`}>
        <div className="flex items-center gap-2">
          {activeTabMobile === 'chat' && (
            <button
              onClick={() => setActiveTabMobile('list')}
              className={`md:hidden p-2 rounded-xl border ${
                isMirror ? 'bg-slate-100 text-purple-700 border-slate-300' : 'bg-slate-900 text-purple-300 hover:text-white border border-slate-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-xl border ${
              isMirror ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
            }`}>
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className={`text-sm font-black tracking-wide uppercase font-serif ${isMirror ? 'text-slate-950' : 'text-slate-100'}`}>CZATY</h1>
          </div>
        </div>

        {/* Action Buttons: Search & New Chat */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowNewChatModal(true);
              setNewChatType('direct');
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isMirror ? 'border-slate-300 bg-white text-slate-800 hover:border-sky-500' : 'border-slate-700/60 text-slate-200 hover:border-sky-400'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">wyszukaj użytkownika</span>
          </button>

          <button
            onClick={() => {
              setShowNewChatModal(true);
              setNewChatType('select');
              setGroupStep(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nowa rozmowa</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN TWO-COLUMN RESPONSIVE LAYOUT */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* LEFT PANEL: CONVERSATION LIST */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r flex flex-col shrink-0 h-full overflow-hidden ${
            isMirror ? 'border-slate-300 bg-white' : 'border-slate-800/80 bg-slate-950'
          } ${activeTabMobile === 'chat' ? 'hidden md:flex' : 'flex'}`}
        >
          {/* List Search Bar Toggle */}
          {showListSearchInput && (
            <div className={`p-2.5 border-b animate-in fade-in duration-150 ${isMirror ? 'border-slate-200 bg-slate-50' : 'border-slate-800/80 bg-slate-900/60'}`}>
              <div className="relative">
                <Search className="w-4 h-4 text-purple-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Szukaj po nazwie lub opisie..."
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  className={`w-full pl-9 pr-8 py-1.5 rounded-xl border text-xs focus:outline-none ${
                    isMirror
                      ? 'bg-white border-slate-300 text-slate-950 placeholder-slate-500 focus:border-purple-500'
                      : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-purple-500'
                  }`}
                />
                {listSearch && (
                  <button onClick={() => setListSearch('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Conversation Cards List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center text-xs flex flex-col items-center justify-center space-y-2 h-64">
                <MessageSquare className="w-8 h-8 text-purple-500/40" />
                <p className={`font-bold ${isMirror ? 'text-slate-800' : 'text-slate-300'}`}>Brak konwersacji</p>
                <p className={`text-[11px] ${isMirror ? 'text-slate-500' : 'text-slate-500'}`}>Kliknij „+ nowa rozmowa”, aby napisać do znajomego!</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const isSelected = activeChat && chat.id === activeChat.id;
                const isGroup = chat.type === 'group';

                return (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`p-2.5 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border ${
                      isSelected
                        ? isMirror
                          ? 'bg-sky-100 border-sky-400 text-sky-950 shadow-sm'
                          : 'bg-purple-950/70 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : isMirror
                          ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900'
                          : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900 hover:border-purple-500/30'
                    }`}
                  >
                    {/* Avatar Display */}
                    <div className="relative shrink-0">
                      {isGroup ? (
                        <div className={`w-10 h-10 rounded-full ring-2 flex items-center justify-center overflow-hidden ${
                          isMirror ? 'bg-slate-200 ring-sky-400' : 'bg-slate-900 ring-purple-500/40'
                        }`}>
                          <img
                            src={chat.avatar || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300'}
                            alt={chat.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <AvatarWithFrame
                          src={chat.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          frame={chat.user?.frame}
                          size="md"
                        />
                      )}

                      {!isGroup && (
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-black ${
                            chat.user?.status === 'online'
                              ? 'bg-emerald-500'
                              : chat.user?.status === 'ingame'
                              ? 'bg-amber-400'
                              : 'bg-slate-400'
                          }`}
                        />
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-black truncate flex items-center gap-1 ${
                          isMirror ? 'text-slate-950' : 'text-white'
                        }`}>
                          {isGroup ? chat.name : chat.user?.name}
                          {isGroup && (
                            <span className={`text-[9px] px-1 rounded font-mono border ${
                              isMirror ? 'bg-sky-100 text-sky-900 border-sky-300' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            }`}>
                              GRUPA
                            </span>
                          )}
                        </span>
                        <span className={`text-[10px] shrink-0 font-medium ${isMirror ? 'text-slate-500' : 'text-slate-400'}`}>{chat.lastMessageTime}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-xs truncate flex-1 ${isMirror ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                          {chat.lastMessage || 'Rozpoczęto rozmowę...'}
                        </p>

                        {/* Unread Badge */}
                        {chat.unreadCount && chat.unreadCount > 0 ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-sky-600 text-white font-black text-[10px] min-w-[18px] text-center shadow-md shrink-0">
                            {chat.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: ACTIVE CHAT THREAD */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden ${
            isMirror ? 'bg-slate-50/90' : 'bg-slate-950/95'
          } ${activeTabMobile === 'list' ? 'hidden md:flex' : 'flex'}`}
        >
          {activeChat ? (
            <>
              {/* Active Chat Header */}
              <div className={`shrink-0 h-14 px-4 border-b flex items-center justify-between backdrop-blur-xl z-10 ${
                isMirror ? 'bg-white border-slate-300 text-slate-950 shadow-sm' : 'bg-slate-900/80 border-slate-800 text-slate-100'
              }`}>
                <div
                  onClick={() => {
                    if (activeChat.type === 'direct' && activeChat.user) {
                      const foundUser = usersList.find(u => u.id === activeChat.user?.id || u.name.toLowerCase() === activeChat.user?.name.toLowerCase());
                      if (foundUser) setViewingProfileUser(foundUser);
                    } else if (activeChat.type === 'group') {
                      setShowGroupInfoModal(true);
                    }
                  }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  {activeChat.type === 'group' ? (
                    <img
                      src={activeChat.avatar || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300'}
                      alt={activeChat.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-400 group-hover:ring-sky-500 transition-all"
                    />
                  ) : (
                    <AvatarWithFrame
                      src={activeChat.user?.avatar || ''}
                      frame={activeChat.user?.frame}
                      size="sm"
                    />
                  )}

                  <div>
                    <h2 className={`text-xs sm:text-sm font-black transition-colors flex items-center gap-1.5 ${
                      isMirror ? 'text-slate-950 group-hover:text-sky-600' : 'text-white group-hover:text-purple-300'
                    }`}>
                      {activeChat.type === 'group' ? activeChat.name : activeChat.user?.name}
                      {activeChat.type === 'group' && (
                        <span className={`text-[10px] font-mono ${isMirror ? 'text-sky-700' : 'text-purple-400'}`}>({activeChat.members.length} osób)</span>
                      )}
                    </h2>
                    <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-bold">
                      {activeChat.type === 'group'
                        ? 'Czat grupowy sojuszu'
                        : activeChat.user?.status === 'online'
                        ? '• Dostępny w Portalu'
                        : activeChat.user?.status === 'ingame'
                        ? '• W grze Whiteout Survival'
                        : '• Niedostępny'}
                    </span>
                  </div>
                </div>

                {/* Header Action Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (activeChat.type === 'group') {
                        setShowGroupInfoModal(true);
                      } else if (activeChat.user) {
                        const foundUser = usersList.find(u => u.id === activeChat.user?.id || u.name.toLowerCase() === activeChat.user?.name.toLowerCase());
                        if (foundUser) setViewingProfileUser(foundUser);
                      }
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold ${
                      isMirror
                        ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                        : 'bg-slate-950 border-slate-800 text-purple-300 hover:text-white hover:bg-purple-950/60'
                    }`}
                  >
                    <Info className="w-4 h-4 text-sky-500" />
                    <span className="hidden sm:inline">Informacje</span>
                  </button>
                </div>
              </div>

              {/* Messages History Stream */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
                {activeChat.messages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center justify-center space-y-2 h-full">
                    <Sparkles className="w-8 h-8 text-purple-400/40" />
                    <p className="font-bold text-slate-300">Brak wiadomości</p>
                    <p>Napisz pierwszą wiadomość poniżej!</p>
                  </div>
                ) : (
                  activeChat.messages.map((msg) => {
                    const isMe = msg.isMe;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 max-w-[90%] sm:max-w-[75%] group relative ${
                          isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                        }`}
                      >
                        {/* Sender Avatar */}
                        {!isMe && (
                          <div
                            onClick={() => {
                              const foundUser = usersList.find(u => u.id === msg.senderId || u.name.toLowerCase() === msg.senderName.toLowerCase());
                              if (foundUser) setViewingProfileUser(foundUser);
                            }}
                            className="cursor-pointer shrink-0"
                          >
                            <AvatarWithFrame src={msg.senderAvatar} frame={msg.senderFrame} size="xs" />
                          </div>
                        )}

                        {/* Message Content Box */}
                        <div className="flex flex-col min-w-0">
                          {/* Sender Name in Group Chat */}
                          {!isMe && activeChat.type === 'group' && (
                            <span className="text-[10px] font-bold text-purple-300 mb-0.5 ml-1">
                              {msg.senderName}
                            </span>
                          )}

                          {/* Reply Quote Banner */}
                          {msg.replyTo && (
                            <div className={`p-2 rounded-xl border-l-2 text-[11px] mb-1 opacity-90 ${
                              isMirror ? 'bg-sky-50 border-sky-500 text-slate-800' : 'bg-slate-900/90 border-purple-500 text-slate-300'
                            }`}>
                              <span className={`font-bold block ${isMirror ? 'text-sky-900' : 'text-purple-300'}`}>{msg.replyTo.senderName}</span>
                              <p className="truncate">{msg.replyTo.content}</p>
                            </div>
                          )}

                          {/* Main Bubble */}
                          <div
                            className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm relative ${
                              isMe
                                ? isMirror
                                  ? 'bg-sky-600 text-white rounded-br-none shadow-sky-600/20'
                                  : 'bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white rounded-br-none'
                                : isMirror
                                  ? 'bg-white text-slate-950 border border-slate-300 rounded-bl-none shadow-sm'
                                  : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none'
                            }`}
                          >
                            {/* Text Content */}
                            {msg.content && <p className="whitespace-pre-wrap break-words">{msg.content}</p>}

                            {/* Media Attachment */}
                            {msg.mediaUrl && (
                              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-black/30 max-w-sm">
                                <img
                                  src={msg.mediaUrl}
                                  alt="Załącznik"
                                  referrerPolicy="no-referrer"
                                  className="w-full max-h-64 object-cover"
                                />
                              </div>
                            )}

                            {/* Timestamp & Status */}
                            <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                              isMe ? 'text-white/80' : isMirror ? 'text-slate-500' : 'opacity-70'
                            }`}>
                              <span>{msg.timeAgo || 'Teraz'}</span>
                              {renderMessageStatus(msg)}
                            </div>
                          </div>

                          {/* Reactions Display */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(msg.reactions).map(([emoji, rawUids]) => {
                                const uids = (rawUids || []) as string[];
                                return (
                                  <button
                                    key={emoji}
                                    onClick={() => toggleMessageReaction(activeChat.id, msg.id, emoji)}
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all ${
                                      uids.includes(profile.id)
                                        ? 'bg-purple-900/80 border-purple-500 text-purple-200'
                                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                                  >
                                    <span>{emoji}</span>
                                    <span>{uids.length}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Quick Action Hover Bar (Reply / Reaction) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 self-center">
                          <button
                            onClick={() => setShowReactionPickerMsgId(showReactionPickerMsgId === msg.id ? null : msg.id)}
                            className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                            title="Dodaj reakcję"
                          >
                            <Smile className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setReplyingTo(msg)}
                            className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                            title="Odpowiedz"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Inline Emoji Reaction Picker Popup */}
                        {showReactionPickerMsgId === msg.id && (
                          <div className="absolute top-0 z-30 bg-slate-950 border border-purple-500/50 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1 animate-in zoom-in-95 duration-150">
                            {QUICK_EMOJIS.slice(0, 7).map(e => (
                              <button
                                key={e}
                                onClick={() => {
                                  toggleMessageReaction(activeChat.id, msg.id, e);
                                  setShowReactionPickerMsgId(null);
                                }}
                                className="p-1 hover:bg-slate-800 rounded-lg text-sm transition-transform hover:scale-125"
                              >
                                {e}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* STICKY BOTTOM COMPOSER (Safe-area aware & iPhone min-font 16px to prevent auto-zoom) */}
              <div className={`shrink-0 p-2 sm:p-3 border-t space-y-2 ${
                isMirror ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-800/80'
              }`}>
                
                {/* Reply Banner if set */}
                {replyingTo && (
                  <div className={`px-3 py-1.5 rounded-xl border flex items-center justify-between text-xs animate-in slide-in-from-bottom-1 duration-150 ${
                    isMirror ? 'bg-sky-50 border-sky-300 text-slate-900' : 'bg-slate-900 border-purple-500/40 text-slate-300'
                  }`}>
                    <div className="truncate">
                      <span className={`font-bold block ${isMirror ? 'text-sky-900' : 'text-purple-300'}`}>Odpowiadasz na wiadomość od {replyingTo.senderName}:</span>
                      <span className={`truncate block ${isMirror ? 'text-slate-700' : 'text-slate-300'}`}>{replyingTo.content}</span>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Attachment Drawer Panel */}
                {showAttachMenu && (
                  <div className={`p-3 rounded-2xl border space-y-3 animate-in zoom-in-95 duration-150 ${
                    isMirror ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-purple-500/30'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-2 ${isMirror ? 'border-slate-200' : 'border-slate-800'}`}>
                      <span className={`text-xs font-bold ${isMirror ? 'text-sky-900' : 'text-purple-300'}`}>Wyślij zdjęcie lub GIF</span>
                      <button onClick={() => setShowAttachMenu(false)} className="text-slate-400 hover:text-slate-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Media Type Tabs */}
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => setMediaType('image')}
                        className={`px-3 py-1 rounded-xl font-bold cursor-pointer ${
                          mediaType === 'image'
                            ? 'bg-sky-600 text-white'
                            : isMirror ? 'bg-slate-200 text-slate-700' : 'bg-slate-950 text-slate-400'
                        }`}
                      >
                        Zdjęcie (URL)
                      </button>
                      <button
                        onClick={() => setMediaType('gif')}
                        className={`px-3 py-1 rounded-xl font-bold cursor-pointer ${
                          mediaType === 'gif'
                            ? 'bg-sky-600 text-white'
                            : isMirror ? 'bg-slate-200 text-slate-700' : 'bg-slate-950 text-slate-400'
                        }`}
                      >
                        Szybki GIF
                      </button>
                    </div>

                    {mediaType === 'image' ? (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Wklej adres URL zdjęcia (https://...)"
                          value={mediaUrlInput}
                          onChange={(e) => setMediaUrlInput(e.target.value)}
                          className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                            isMirror
                              ? 'bg-white border-slate-300 text-slate-950 focus:border-sky-500'
                              : 'bg-slate-950 border-slate-800 text-white focus:border-purple-500'
                          }`}
                        />
                        <button
                          onClick={handleSend}
                          disabled={!mediaUrlInput.trim()}
                          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs disabled:opacity-40 cursor-pointer"
                        >
                          Wyślij
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {QUICK_GIFS.map((gif, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectGif(gif)}
                            className={`aspect-video rounded-xl overflow-hidden border cursor-pointer hover:border-sky-500 transition-all ${
                              isMirror ? 'border-slate-300' : 'border-slate-800'
                            }`}
                          >
                            <img src={gif} alt="GIF" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Emoji Strip */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-base">
                  {QUICK_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleInsertEmoji(emoji)}
                      className={`p-1 rounded-lg transition-transform hover:scale-125 shrink-0 cursor-pointer ${
                        isMirror ? 'hover:bg-slate-200' : 'hover:bg-slate-900'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Main Composer Form */}
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className={`p-2.5 rounded-2xl border transition-all shrink-0 cursor-pointer ${
                      showAttachMenu
                        ? 'bg-sky-600 text-white border-sky-600'
                        : isMirror
                        ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                        : 'bg-slate-900 border-slate-800 text-purple-300 hover:text-white hover:border-slate-700'
                    }`}
                    title="Załącz plik / GIF"
                  >
                    <Plus className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    placeholder={`Napisz wiadomość...`}
                    style={{ fontSize: '16px' }}
                    className={`flex-1 px-4 py-2.5 rounded-2xl border focus:outline-none ${
                      isMirror
                        ? 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-500 focus:border-sky-500'
                        : 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-purple-500'
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={!msgInput.trim() && !mediaUrlInput.trim()}
                    className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold disabled:opacity-40 transition-all shadow-lg shadow-purple-600/30 shrink-0 cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-3 p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <MessageSquare className="w-7 h-7" />
              </div>
              <p className="text-base font-extrabold text-slate-800 dark:text-slate-100">Brak rozmów</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs">Znajdź użytkownika i rozpocznij rozmowę.</p>
              <button
                onClick={() => {
                  setShowNewChatModal(true);
                  setNewChatType('direct');
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Wyszukaj użytkownika
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. MODAL: NOWA ROZMOWA */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl w-full max-w-lg p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" /> NOWA ROZMOWA
              </h2>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STEP 1: Select Type */}
            {newChatType === 'select' && (
              <div className="space-y-3 py-2">
                <p className="text-xs text-slate-300 font-medium">Wybierz rodzaj nowej konwersacji:</p>

                <div
                  onClick={() => setNewChatType('direct')}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 cursor-pointer flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Napisz do osoby</h3>
                      <p className="text-xs text-slate-400">Prywatna rozmowa z zarejestrowanym członkiem MaG</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-400" />
                </div>

                <div
                  onClick={() => setNewChatType('group')}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 cursor-pointer flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Utwórz czat grupowy</h3>
                      <p className="text-xs text-slate-400">Wspólna konwersacja dla kilku członków lub sojuszu</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            )}

            {/* STEP 2A: Direct Chat User Search */}
            {newChatType === 'direct' && (
              <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                <div className="relative shrink-0">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Szukaj użytkownika po nazwie, nicku WOS..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {registeredOtherUsers.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">Nie znaleziono zarejestrowanych użytkowników</p>
                  ) : (
                    registeredOtherUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => handleStartDirectChat(u)}
                        className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 cursor-pointer flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <AvatarWithFrame src={u.avatar} frame={u.avatarFrame} size="sm" />
                          <div>
                            <span className="text-xs font-bold text-white block">{u.name}</span>
                            <span className="text-[10px] text-amber-300 font-semibold">{u.title || u.role}</span>
                          </div>
                        </div>

                        <button className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-bold border border-purple-500/40 transition-all">
                          Rozpocznij
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* STEP 2B: Group Chat Creation Flow */}
            {newChatType === 'group' && (
              <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                {groupStep === 1 ? (
                  <>
                    <p className="text-xs text-slate-300 font-medium shrink-0">Wybierz członków grupy (minimum 2 osoby):</p>

                    {/* Selected Chips Strip */}
                    {selectedGroupUserIds.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900/80 rounded-2xl border border-slate-800 shrink-0">
                        {selectedGroupUserIds.map((uid) => {
                          const u = usersList.find(x => x.id === uid);
                          if (!u) return null;
                          return (
                            <span
                              key={uid}
                              className="px-2 py-1 rounded-xl bg-purple-900/80 text-purple-200 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1.5"
                            >
                              <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                              <span>{u.name}</span>
                              <button onClick={() => handleToggleGroupUser(uid)} className="hover:text-white">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className="relative shrink-0">
                      <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Szukaj osób do dodania..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                      {registeredOtherUsers.map((u) => {
                        const isSelected = selectedGroupUserIds.includes(u.id);
                        return (
                          <div
                            key={u.id}
                            onClick={() => handleToggleGroupUser(u.id)}
                            className={`p-2.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-purple-950/80 border-purple-500 shadow-md'
                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <AvatarWithFrame src={u.avatar} frame={u.avatarFrame} size="sm" />
                              <div>
                                <span className="text-xs font-bold text-white block">{u.name}</span>
                                <span className="text-[10px] text-slate-400">{u.title}</span>
                              </div>
                            </div>

                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-purple-600 border-purple-400 text-white' : 'border-slate-700'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-end shrink-0">
                      <button
                        disabled={selectedGroupUserIds.length < 2}
                        onClick={() => setGroupStep(2)}
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs disabled:opacity-40 shadow-lg shadow-purple-600/30"
                      >
                        Dalej ({selectedGroupUserIds.length})
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleCreateGroupSubmit} className="space-y-4 py-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1">Nazwa Grupy</label>
                      <input
                        type="text"
                        required
                        placeholder="np. Dowódcy Rajdów S104"
                        value={groupNameInput}
                        onChange={(e) => setGroupNameInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1">URL Zdjęcia Grupy (opcjonalnie)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={groupAvatarInput}
                        onChange={(e) => setGroupAvatarInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setGroupStep(1)}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs"
                      >
                        Wróć
                      </button>
                      <button
                        type="submit"
                        disabled={!groupNameInput.trim()}
                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30"
                      >
                        UTWÓRZ GRUPĘ
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. MODAL: INFORMACJE O GRUPIE */}
      {showGroupInfoModal && activeChat && activeChat.type === 'group' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl w-full max-w-lg p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" /> INFORMACJE O GRUPIE
              </h2>
              <button onClick={() => setShowGroupInfoModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Group Banner */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shrink-0">
              <img
                src={activeChat.avatar || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300'}
                alt={activeChat.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/40"
              />
              <div className="flex-1">
                <h3 className="text-sm font-black text-white">{activeChat.name}</h3>
                <span className="text-xs text-purple-300 font-semibold">{activeChat.members.length} członków</span>
              </div>
            </div>

            {/* Admin Edit Section */}
            {isCurrentGroupAdmin && (
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 shrink-0">
                <button
                  onClick={() => setIsEditingGroup(!isEditingGroup)}
                  className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edytuj nazwę lub zdjęcie grupy
                </button>

                {isEditingGroup && (
                  <div className="space-y-2 pt-2 text-xs">
                    <input
                      type="text"
                      placeholder="Nowa nazwa grupy..."
                      value={editGroupName}
                      onChange={(e) => setEditGroupName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                    <input
                      type="url"
                      placeholder="Nowy URL zdjęcia..."
                      value={editGroupAvatar}
                      onChange={(e) => setEditGroupAvatar(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                    <button
                      onClick={() => {
                        updateGroupChatInfo(activeChat.id, { name: editGroupName, avatar: editGroupAvatar });
                        setIsEditingGroup(false);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                    >
                      Zapisz zmiany
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Member List Header */}
            <div className="flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-200">Lista Członków:</span>
              {isCurrentGroupAdmin && (
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-2.5 py-1 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center gap-1 hover:bg-purple-600 hover:text-white transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Dodaj osobę
                </button>
              )}
            </div>

            {/* Member List Stream */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {activeChat.members.map((m) => (
                <div
                  key={m.userId}
                  className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div
                    onClick={() => {
                      const foundUser = usersList.find(u => u.id === m.userId || u.name.toLowerCase() === m.username.toLowerCase());
                      if (foundUser) setViewingProfileUser(foundUser);
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <AvatarWithFrame src={m.userAvatar} frame={m.userFrame} size="sm" />
                    <div>
                      <span className="font-bold text-white block">{m.username}</span>
                      <span className={`text-[10px] font-bold ${m.role === 'admin' ? 'text-amber-400' : 'text-slate-400'}`}>
                        {m.role === 'admin' ? '👑 Admin Grupy' : 'Członek'}
                      </span>
                    </div>
                  </div>

                  {/* Admin Actions for Members */}
                  {isCurrentGroupAdmin && m.userId !== profile.id && (
                    <div className="flex items-center gap-1">
                      {m.role !== 'admin' && (
                        <button
                          onClick={() => updateGroupMemberRole(activeChat.id, m.userId, 'admin')}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40"
                          title="Awansuj na Admina"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => removeGroupChatMember(activeChat.id, m.userId)}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/40"
                        title="Usuń z grupy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Leave Group Action */}
            <div className="pt-2 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => {
                  leaveGroupChat(activeChat.id);
                  setShowGroupInfoModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-extrabold text-xs border border-rose-500/40 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Opuść grupę
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: DODAJ CZŁONKA DO GRUPIE */}
      {showAddMemberModal && activeChat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl w-full max-w-md p-5 shadow-2xl space-y-3 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" /> DODAJ OSOBĘ DO GRUPY
              </h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Szukaj użytkownika..."
              value={addMemberSearch}
              onChange={(e) => setAddMemberSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            />

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {usersList
                .filter(u => !activeChat.members.some(m => m.userId === u.id))
                .filter(u => u.name.toLowerCase().includes(addMemberSearch.toLowerCase()))
                .map(u => (
                  <div
                    key={u.id}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <AvatarWithFrame src={u.avatar} frame={u.avatarFrame} size="sm" />
                      <span className="font-bold text-white">{u.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        addGroupChatMember(activeChat.id, u.id);
                        setShowAddMemberModal(false);
                      }}
                      className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      Dodaj
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: PUBLIC PROFILE VIEW (Opens when avatar is clicked in chat) */}
      <UserProfileModal
        user={viewingProfileUser}
        onClose={() => setViewingProfileUser(null)}
        onStartChat={(u) => {
          setViewingProfileUser(null);
          handleStartDirectChat(u);
        }}
      />
    </div>
  );
};
