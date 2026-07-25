import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompactHeader } from '../CompactHeader';
import { Send, MessageSquare, PhoneCall, Video, Search } from 'lucide-react';

export const CzatyView: React.FC = () => {
  const { chats, selectedChatId, setSelectedChatId, sendMessage, profile } = useApp();
  const [msgInput, setMsgInput] = useState('');

  const activeChat = chats.find(c => c.id === selectedChatId) || chats[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim() || !activeChat) return;
    sendMessage(activeChat.id, msgInput);
    setMsgInput('');
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Compact Module Header */}
      <CompactHeader
        title="Czaty Sojuszowe"
        badge="Online"
      />

      {/* Main Chat Layout Grid */}
      <div className="flex-1 min-h-0 app-scroll-container p-3 sm:p-5 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Conversations Sidebar */}
        <div className="md:col-span-4 rounded-2xl bg-slate-900/80 border border-purple-500/20 p-3 backdrop-blur-xl flex flex-col h-[280px] md:h-full overflow-hidden shadow-xl">
          <div className="relative mb-2 shrink-0">
            <Search className="w-4 h-4 text-purple-400/60 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Szukaj konwersacji..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-base text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {chats.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 flex flex-col items-center gap-1">
                <MessageSquare className="w-6 h-6 text-purple-400/40" />
                <span>Brak rozmów</span>
              </div>
            ) : (
              chats.map((chat) => {
                const isSelected = activeChat && chat.id === activeChat.id;
                return (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2.5 border ${
                      isSelected
                        ? 'bg-purple-950/80 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                        : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-900 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={chat.user.avatar}
                        alt={chat.user.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/30"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-black" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100 truncate">{chat.user.name}</span>
                        <span className="text-[10px] text-slate-400">{chat.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-purple-200/70 truncate mt-0.5">{chat.lastMessage}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Conversation Stream */}
        <div className="md:col-span-8 rounded-2xl bg-slate-900/80 border border-purple-500/20 backdrop-blur-xl p-4 flex flex-col h-[400px] md:h-full overflow-hidden shadow-xl">
          {activeChat ? (
            <>
              {/* Header Info */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={activeChat.user.avatar}
                    alt={activeChat.user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/40"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeChat.user.name}</h3>
                    <span className="text-[10px] text-emerald-400 font-medium">Aktywny(a) w Portalu</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full bg-slate-950 border border-slate-800 text-purple-300 hover:text-white hover:bg-purple-950 transition-colors">
                    <PhoneCall className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full bg-slate-950 border border-slate-800 text-purple-300 hover:text-white hover:bg-purple-950 transition-colors">
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages History Stream */}
              <div className="flex-1 my-3 overflow-y-auto space-y-2.5 pr-2 flex flex-col justify-end">
                {activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 max-w-[85%] ${
                      msg.isMe ? 'ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    <img
                      src={msg.isMe ? profile.avatar : activeChat.user.avatar}
                      alt={msg.senderName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />

                    <div
                      className={`p-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                        msg.isMe
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-slate-950 text-slate-100 border border-slate-800 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[9px] block text-right mt-1 opacity-70">
                        {msg.timeAgo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="pt-2 border-t border-slate-800 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder={`Napisz wiadomość do ${activeChat.user.name}...`}
                  className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!msgInput.trim()}
                  className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold disabled:opacity-40 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-1">
              <MessageSquare className="w-10 h-10 text-purple-400/30" />
              <p className="text-xs">Wybierz konwersację z listy</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
