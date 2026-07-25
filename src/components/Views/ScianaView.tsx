import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompactHeader } from '../CompactHeader';
import { ThumbsUp, MessageCircle, Send, Image, Link as LinkIcon, Youtube, Play, X, ExternalLink, Sparkles } from 'lucide-react';

export const ScianaView: React.FC = () => {
  const { posts, addPost, likePost, addPostComment } = useApp();
  const [newPostText, setNewPostText] = useState('');
  const [activeAttachment, setActiveAttachment] = useState<'none' | 'photo' | 'link' | 'youtube'>('none');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [playingYoutubeId, setPlayingYoutubeId] = useState<string | null>(null);

  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Helper to extract YouTube video ID
  const extractYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Helper to get domain from link
  const getDomain = (url: string): string => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname.replace('www.', '');
    } catch {
      return url || 'link';
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !imageUrl && !linkUrl && !youtubeInput) return;

    let finalYoutubeId = extractYoutubeId(youtubeInput) || extractYoutubeId(newPostText);
    let finalLinkUrl = linkUrl.trim() || undefined;

    // Auto detect link or youtube in text if not explicitly attached
    if (!finalYoutubeId && !finalLinkUrl) {
      const urlMatch = newPostText.match(/(https?:\/\/[^\s]+)/g);
      if (urlMatch && urlMatch[0]) {
        const detectedUrl = urlMatch[0];
        const ytId = extractYoutubeId(detectedUrl);
        if (ytId) {
          finalYoutubeId = ytId;
        } else {
          finalLinkUrl = detectedUrl;
        }
      }
    }

    addPost(
      newPostText.trim(),
      imageUrl.trim() || undefined,
      finalLinkUrl,
      finalYoutubeId || undefined
    );

    // Reset form
    setNewPostText('');
    setImageUrl('');
    setLinkUrl('');
    setYoutubeInput('');
    setActiveAttachment('none');
  };

  const toggleCommentBox = (postId: string) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addPostComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Compact Module Header */}
      <CompactHeader
        title="Ściana Sojuszu"
        badge={`${posts.length} wpisów`}
      />

      {/* Main Scrollable Content Container */}
      <div className="flex-1 app-scroll-container p-3 sm:p-5 lg:p-6 space-y-4 max-w-3xl mx-auto w-full">
        {/* Post Composer ("Co słychać?") */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-sky-500/25 shadow-xl space-y-3">
          <form onSubmit={handleCreatePost} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                M
              </div>
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Co słychać w Sojuszu MaG? Napisz wiadomość..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/60 resize-none"
              />
            </div>

            {/* Active Attachment Inputs */}
            {activeAttachment === 'photo' && (
              <div className="p-3 rounded-xl bg-slate-950 border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-sky-300 flex items-center gap-1">
                    <Image className="w-3.5 h-3.5" /> Dodaj Zdjęcie / Grafikę
                  </span>
                  <button type="button" onClick={() => setActiveAttachment('none')} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Wklej URL zdjęcia (np. https://images.unsplash.com/...)"
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-base text-slate-200 focus:outline-none focus:border-sky-500"
                />
                {imageUrl && (
                  <div className="relative rounded-lg overflow-hidden h-32 border border-slate-800">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {activeAttachment === 'link' && (
              <div className="p-3 rounded-xl bg-slate-950 border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-sky-300 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5" /> Dodaj Link / Artykuł
                  </span>
                  <button type="button" onClick={() => setActiveAttachment('none')} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Wklej adres WWW (np. https://mag-portal.pl/artykul)"
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-base text-slate-200 focus:outline-none focus:border-sky-500"
                />
                {linkUrl && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-xs text-sky-300 font-mono truncate">{getDomain(linkUrl)}</span>
                  </div>
                )}
              </div>
            )}

            {activeAttachment === 'youtube' && (
              <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-300 flex items-center gap-1">
                    <Youtube className="w-3.5 h-3.5 text-rose-500" /> Dodaj Film z YouTube
                  </span>
                  <button type="button" onClick={() => setActiveAttachment('none')} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  placeholder="Wklej link YouTube (np. https://www.youtube.com/watch?v=...)"
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-base text-slate-200 focus:outline-none focus:border-rose-500"
                />
                {extractYoutubeId(youtubeInput) && (
                  <div className="relative rounded-lg overflow-hidden aspect-video border border-slate-800 max-h-40">
                    <img
                      src={`https://img.youtube.com/vi/${extractYoutubeId(youtubeInput)}/hqdefault.jpg`}
                      alt="YouTube Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveAttachment(activeAttachment === 'photo' ? 'none' : 'photo')}
                  className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                    activeAttachment === 'photo' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title="Dodaj zdjęcie"
                >
                  <Image className="w-4 h-4 text-sky-400" />
                  <span className="hidden sm:inline">Zdjęcie</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAttachment(activeAttachment === 'link' ? 'none' : 'link')}
                  className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                    activeAttachment === 'link' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title="Dodaj link"
                >
                  <LinkIcon className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAttachment(activeAttachment === 'youtube' ? 'none' : 'youtube')}
                  className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                    activeAttachment === 'youtube' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title="Dodaj film z YouTube"
                >
                  <Youtube className="w-4 h-4 text-rose-500" />
                  <span className="hidden sm:inline">YouTube</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={!newPostText.trim() && !imageUrl && !linkUrl && !youtubeInput}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-110 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-sky-500/20 disabled:opacity-40 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Opublikuj</span>
              </button>
            </div>
          </form>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
              <Sparkles className="w-6 h-6 text-sky-400" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Brak wpisów na ścianie</p>
            <p className="text-xs text-slate-500">Bądź pierwszym, który opublikuje wiadomość dla sojuszu!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-3"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">{post.authorName}</span>
                      {post.badge && (
                        <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-semibold">
                          {post.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{post.timeAgo}</span>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              {post.content && (
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                  {post.content}
                </p>
              )}

              {/* Image Attachment */}
              {post.image && (
                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-96">
                  <img
                    src={post.image}
                    alt="Załącznik wpisu"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Link Preview Card */}
              {post.linkUrl && !post.youtubeId && (
                <a
                  href={post.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-sky-500/40 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 group-hover:scale-105 transition-transform shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-mono text-sky-400 block truncate">{getDomain(post.linkUrl)}</span>
                      <p className="text-xs font-medium text-slate-300 truncate mt-0.5">{post.linkUrl}</p>
                    </div>
                  </div>
                </a>
              )}

              {/* YouTube Card */}
              {post.youtubeId && (
                <div className="rounded-xl overflow-hidden border border-rose-500/30 bg-black/90 shadow-lg">
                  {playingYoutubeId === post.id ? (
                    <div className="relative aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${post.youtubeId}?autoplay=1`}
                        title="YouTube player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => setPlayingYoutubeId(post.id)}
                      className="relative aspect-video w-full cursor-pointer group overflow-hidden"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${post.youtubeId}/hqdefault.jpg`}
                        alt="YouTube Thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 fill-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Youtube className="w-4 h-4 text-rose-500" /> Odtwórz wideo YouTube
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono">YouTube</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Post Action Footer */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <button
                  onClick={() => likePost(post.id)}
                  className={`flex items-center gap-1.5 font-semibold transition-all ${
                    post.isLiked ? 'text-sky-400 scale-105' : 'hover:text-sky-300'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-sky-400' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() => toggleCommentBox(post.id)}
                  className="flex items-center gap-1.5 font-semibold hover:text-sky-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-sky-400" />
                  <span>{post.commentsCount} komentarzy</span>
                </button>
              </div>

              {/* Comment Box */}
              {openComments[post.id] && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5">
                  {post.comments.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
                      <img
                        src={c.authorAvatar}
                        alt={c.authorName}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{c.authorName}</span>
                          <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{c.content}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Napisz komentarz..."
                      className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommentSubmit(post.id);
                      }}
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                    >
                      Wyślij
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
