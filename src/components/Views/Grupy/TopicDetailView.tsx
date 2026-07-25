import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Group,
  ForumSection,
  ForumTopic
} from '../../../types';
import {
  ArrowLeft,
  Pin,
  Lock,
  Unlock,
  Trash2,
  Edit2,
  Heart,
  MessageSquare,
  Send,
  Image,
  Link as LinkIcon,
  Youtube,
  Shield,
  Check,
  X
} from 'lucide-react';

interface TopicDetailViewProps {
  group: Group;
  section: ForumSection;
  topic: ForumTopic;
  onBack: () => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  group,
  section,
  topic,
  onBack
}) => {
  const {
    profile,
    addForumReply,
    updateForumReply,
    deleteForumReply,
    likeForumReply,
    updateForumTopic,
    deleteForumTopic,
    togglePinTopic,
    toggleLockTopic
  } = useApp();

  // Reply form state
  const [replyText, setReplyText] = useState('');
  const [replyImage, setReplyImage] = useState('');
  const [replyLink, setReplyLink] = useState('');
  const [replyYoutube, setReplyYoutube] = useState('');
  const [showMediaInputs, setShowMediaInputs] = useState(false);

  // Edit topic modal
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);
  const [editContent, setEditContent] = useState(topic.content);

  // Edit reply state
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  const isGroupOwner = group.ownerId === profile.id;
  const isPortalAdmin = profile.role === 'ADMIN';
  const isGroupMod = group.members.some(
    m => m.userId === profile.id && (m.role === 'MODERATOR' || m.role === 'OWNER')
  );
  const canModerate = isPortalAdmin || isGroupOwner || isGroupMod;
  const isTopicAuthor = topic.authorId === profile.id;

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    let ytId = replyYoutube.trim();
    if (ytId.includes('v=')) {
      ytId = ytId.split('v=')[1]?.split('&')[0] || ytId;
    } else if (ytId.includes('youtu.be/')) {
      ytId = ytId.split('youtu.be/')[1]?.split('?')[0] || ytId;
    }

    addForumReply(group.id, topic.id, {
      content: replyText.trim(),
      image: replyImage.trim() || undefined,
      linkUrl: replyLink.trim() || undefined,
      youtubeId: ytId || undefined
    });

    setReplyText('');
    setReplyImage('');
    setReplyLink('');
    setReplyYoutube('');
    setShowMediaInputs(false);
  };

  const handleQuoteReply = (authorName: string) => {
    setReplyText(`@${authorName} `);
  };

  const handleSaveTopicEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    updateForumTopic(group.id, topic.id, {
      title: editTitle.trim(),
      content: editContent.trim()
    });
    setIsEditingTopic(false);
  };

  const handleSaveReplyEdit = (replyId: string) => {
    if (!editReplyContent.trim()) return;
    updateForumReply(group.id, topic.id, replyId, editReplyContent.trim());
    setEditingReplyId(null);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Wróć do {section.name}
        </button>

        <div className="flex items-center gap-2">
          {topic.isPinned && (
            <span className="flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
              <Pin className="w-3 h-3" /> PRZYPIĘTY
            </span>
          )}
          {topic.isLocked && (
            <span className="flex items-center gap-1 text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
              <Lock className="w-3 h-3" /> ZAMKNIĘTY
            </span>
          )}
        </div>
      </div>

      {/* Main Topic Card (Original Post) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-4">
        {/* Author header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={topic.authorAvatar}
              alt={topic.authorName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
            <div>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                {topic.authorName}
                {isPortalAdmin && <Shield className="w-3 h-3 text-amber-400" />}
              </span>
              <span className="text-[11px] text-slate-400 block">
                Napisano: {topic.createdAt} {topic.updatedAt && `(Edytowano: ${topic.updatedAt})`}
              </span>
            </div>
          </div>

          {/* Topic Admin Actions */}
          <div className="flex items-center gap-1.5">
            {canModerate && (
              <>
                <button
                  onClick={() => togglePinTopic(group.id, topic.id)}
                  title={topic.isPinned ? 'Odepnij' : 'Przypnij'}
                  className={`p-1.5 rounded-lg border text-xs transition-all ${
                    topic.isPinned
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toggleLockTopic(group.id, topic.id)}
                  title={topic.isLocked ? 'Odblokuj' : 'Zablokuj'}
                  className={`p-1.5 rounded-lg border text-xs transition-all ${
                    topic.isLocked
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {topic.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </button>
              </>
            )}

            {(isTopicAuthor || canModerate) && (
              <>
                <button
                  onClick={() => setIsEditingTopic(!isEditingTopic)}
                  className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                  title="Edytuj temat"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    deleteForumTopic(group.id, topic.id);
                    onBack();
                  }}
                  className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900"
                  title="Usuń temat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Edit Topic Form or Display */}
        {isEditingTopic ? (
          <div className="space-y-3 pt-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold"
            />
            <textarea
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditingTopic(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Anuluj
              </button>
              <button
                onClick={handleSaveTopicEdit}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-xs font-bold text-white"
              >
                Zapisz zmiany
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white font-serif">{topic.title}</h2>
            <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {topic.content}
            </div>

            {/* Media attachments */}
            {topic.image && (
              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-96">
                <img
                  src={topic.image}
                  alt="Attachment"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {topic.linkUrl && (
              <a
                href={topic.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 underline hover:text-emerald-300"
              >
                <LinkIcon className="w-3.5 h-3.5" /> {topic.linkUrl}
              </a>
            )}

            {topic.youtubeId && (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800">
                <iframe
                  src={`https://www.youtube.com/embed/${topic.youtubeId}`}
                  title="YouTube video"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Replies List Header */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-400" /> Odpowiedzi w dyskusji ({topic.replies.length})
        </h3>
      </div>

      {/* Replies Stream */}
      <div className="space-y-3">
        {topic.replies.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            Brak odpowiedzi. Bądź pierwszy i podziel się swoją opinią poniżej!
          </div>
        ) : (
          topic.replies.map((reply) => {
            const isReplyAuthor = reply.authorId === profile.id;
            const hasLiked = reply.likes.includes(profile.id);

            return (
              <div
                key={reply.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3"
              >
                {/* Reply Author Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={reply.authorAvatar}
                      alt={reply.authorName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200">{reply.authorName}</span>
                      <span className="text-[10px] text-slate-500 block">{reply.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleQuoteReply(reply.authorName)}
                      className="text-[11px] text-slate-400 hover:text-emerald-300 font-medium px-2 py-0.5 rounded-md hover:bg-slate-800"
                    >
                      Odpowiedz
                    </button>

                    {(isReplyAuthor || canModerate) && (
                      <>
                        <button
                          onClick={() => {
                            setEditingReplyId(reply.id);
                            setEditReplyContent(reply.content);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white"
                          title="Edytuj"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteForumReply(group.id, topic.id, reply.id)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300"
                          title="Usuń"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Reply Content or Edit Input */}
                {editingReplyId === reply.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={editReplyContent}
                      onChange={(e) => setEditReplyContent(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingReplyId(null)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleSaveReplyEdit(reply.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-[11px] font-bold text-white flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Zapisz
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {reply.content}
                    </p>

                    {reply.image && (
                      <img
                        src={reply.image}
                        alt="Attachment"
                        referrerPolicy="no-referrer"
                        className="max-h-60 rounded-xl object-cover border border-slate-800"
                      />
                    )}

                    {reply.linkUrl && (
                      <a
                        href={reply.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 underline"
                      >
                        <LinkIcon className="w-3 h-3" /> {reply.linkUrl}
                      </a>
                    )}

                    {reply.youtubeId && (
                      <div className="aspect-video max-w-sm rounded-xl overflow-hidden border border-slate-800">
                        <iframe
                          src={`https://www.youtube.com/embed/${reply.youtubeId}`}
                          title="YouTube video"
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Reply Footer: Likes */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <button
                    onClick={() => likeForumReply(group.id, topic.id, reply.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
                      hasLiked
                        ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                    <span>{reply.likes.length}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply Input Form */}
      {topic.isLocked && !canModerate ? (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-rose-400" />
          Temat został zamknięty przez moderatora. Odpowiadanie jest wyłączone.
        </div>
      ) : (
        <form onSubmit={handleReplySubmit} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-emerald-400" /> Dodaj odpowiedź w temacie
            </span>
            <button
              type="button"
              onClick={() => setShowMediaInputs(!showMediaInputs)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              {showMediaInputs ? 'Ukryj multimedia' : '+ Dodaj multimedia (Zdjęcie / Link / YouTube)'}
            </button>
          </div>

          <textarea
            rows={3}
            placeholder="Napisz swoją odpowiedź..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          />

          {showMediaInputs && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl">
                <Image className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <input
                  type="url"
                  placeholder="URL zdjęcia..."
                  value={replyImage}
                  onChange={(e) => setReplyImage(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl">
                <LinkIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <input
                  type="url"
                  placeholder="URL linku..."
                  value={replyLink}
                  onChange={(e) => setReplyLink(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl">
                <Youtube className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Link do YouTube..."
                  value={replyYoutube}
                  onChange={(e) => setReplyYoutube(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none w-full"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              Wyślij odpowiedź
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
