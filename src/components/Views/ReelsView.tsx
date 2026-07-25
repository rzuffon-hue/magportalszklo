import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CompactHeader } from '../CompactHeader';
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Youtube,
  Image,
  Sparkles,
  Flame,
  Send,
  Trash2,
  CornerDownRight,
  Film
} from 'lucide-react';
import { ReelComment, Reel } from '../../types';

export const ReelsView: React.FC = () => {
  const {
    reels,
    addReel,
    toggleReelLike,
    addReelComment,
    likeReelComment,
    deleteReelComment,
    profile,
    setActiveView
  } = useApp();

  // Selected reel for Fullscreen Viewer mode. If null -> Level 1 (REELS HUB)
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [feedbackIcon, setFeedbackIcon] = useState<'play' | 'pause' | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Comments Bottom Sheet State
  const [showComments, setShowComments] = useState(false);
  const [wasAutoPaused, setWasAutoPaused] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ReelComment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Drag / Touch Swipe State for Horizontal Reel Deck in Viewer
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const commentsScrollRef = useRef<HTMLDivElement>(null);

  // Form state for creating a Reel
  const [reelTitle, setReelTitle] = useState('');
  const [reelType, setReelType] = useState<'image' | 'youtube'>('image');
  const [reelMediaUrl, setReelMediaUrl] = useState('');
  const [reelTags, setReelTags] = useState('#MaG #Portal');

  const currentReel = reels.find(r => r.id === selectedReelId) || reels[currentIndex] || reels[0];

  // Helper to extract Youtube ID
  const extractYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Open Fullscreen Viewer for a specific Reel
  const handleOpenViewer = (reelId: string) => {
    const index = reels.findIndex(r => r.id === reelId);
    if (index !== -1) {
      setCurrentIndex(index);
    }
    setSelectedReelId(reelId);
    setIsPlaying(true);
    setFeedbackIcon(null);
    setShowComments(false);
  };

  // Next / Prev handlers in Viewer
  const handleNext = () => {
    if (reels.length === 0) return;
    const newIdx = (currentIndex + 1) % reels.length;
    setCurrentIndex(newIdx);
    if (reels[newIdx]) {
      setSelectedReelId(reels[newIdx].id);
    }
    setIsPlaying(true);
    setFeedbackIcon(null);
    setShowComments(false);
  };

  const handlePrev = () => {
    if (reels.length === 0) return;
    const newIdx = (currentIndex - 1 + reels.length) % reels.length;
    setCurrentIndex(newIdx);
    if (reels[newIdx]) {
      setSelectedReelId(reels[newIdx].id);
    }
    setIsPlaying(true);
    setFeedbackIcon(null);
    setShowComments(false);
  };

  // Toggle Video Play/Pause on Video Click
  const handleVideoClick = () => {
    if (showComments) return; // ignore when comments sheet is open
    if (isPlaying) {
      setIsPlaying(false);
      setFeedbackIcon('pause');
      setTimeout(() => setFeedbackIcon(null), 600);
    } else {
      setIsPlaying(true);
      setFeedbackIcon('play');
      setTimeout(() => setFeedbackIcon(null), 400);
    }
  };

  // Comments Bottom Sheet Open/Close
  const handleOpenComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showComments) {
      if (isPlaying) {
        setIsPlaying(false);
        setWasAutoPaused(true);
      } else {
        setWasAutoPaused(false);
      }
      setShowComments(true);
    } else {
      handleCloseComments();
    }
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setReplyingTo(null);
    if (wasAutoPaused) {
      setIsPlaying(true);
      setWasAutoPaused(false);
    }
  };

  // Touch Swipe Handlers for Horizontal Navigation in Fullscreen Viewer
  const handleTouchStart = (e: React.TouchEvent) => {
    if (showComments) return; // Do not swipe reels when comments are open
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (showComments || touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (showComments || touchStartX.current === null) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    const deltaX = dragOffset;

    // Swipe Threshold: 40px
    if (deltaX < -40) {
      handleNext();
    } else if (deltaX > 40) {
      handlePrev();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse Drag Handlers for Desktop Testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (showComments) return;
    touchStartX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || showComments || touchStartX.current === null) return;
    const deltaX = e.clientX - touchStartX.current;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging || showComments || touchStartX.current === null) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    const deltaX = dragOffset;
    if (deltaX < -50) {
      handleNext();
    } else if (deltaX > 50) {
      handlePrev();
    }
    touchStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  // Share button
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Post Comment Submission
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentReel) return;

    let parentId: string | undefined = undefined;
    let replyToUser: string | undefined = undefined;

    if (replyingTo) {
      parentId = replyingTo.parentId ? replyingTo.parentId : replyingTo.id;
      replyToUser = replyingTo.authorName;
    }

    addReelComment(currentReel.id, commentText.trim(), parentId, replyToUser);
    setCommentText('');
    setReplyingTo(null);

    setTimeout(() => {
      if (commentsScrollRef.current) {
        commentsScrollRef.current.scrollTop = commentsScrollRef.current.scrollHeight;
      }
    }, 100);
  };

  // Add Reel handler
  const handleCreateReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelTitle.trim()) return;

    let finalBg = reelMediaUrl.trim();
    let finalYtId: string | undefined = undefined;

    if (reelType === 'youtube') {
      const ytId = extractYoutubeId(reelMediaUrl);
      if (ytId) {
        finalYtId = ytId;
        finalBg = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      } else {
        finalBg = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800';
      }
    } else if (!finalBg) {
      finalBg = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
    }

    const tagsArray = reelTags.split(' ').filter(t => t.startsWith('#') || t.trim().length > 0);

    addReel(
      reelTitle.trim(),
      finalBg,
      reelType,
      finalYtId,
      tagsArray.length > 0 ? tagsArray : ['#MaG']
    );

    setReelTitle('');
    setReelMediaUrl('');
    setShowAddModal(false);
  };

  // Popular reels sorted by likes count
  const popularReels = [...reels].sort((a, b) => b.likes - a.likes);

  // Prepare Comments Structure
  const commentList = currentReel?.commentList || [];
  const topLevelComments = commentList.filter(c => !c.parentId);
  const totalCommentsCount = commentList.length;

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Compact Header */}
      <CompactHeader
        title="REELS SOJUSZU"
        onAction={() => setShowAddModal(true)}
        actionIcon={<Plus className="w-3.5 h-3.5" />}
        actionLabel="DODAJ"
      />

      {/* LEVEL 1: REELS HUB / BIBLIOTEKA */}
      {selectedReelId === null ? (
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-6 max-w-5xl mx-auto w-full app-scroll-container">
          
          {/* SECTION 1: NAJNOWSZE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-200 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" /> NAJNOWSZE
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{reels.length} materiałów</span>
            </div>

            {/* HORIZONTAL SCROLL ROW 1 */}
            <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none snap-x touch-pan-x">
              {/* FIRST TILE: + DODAJ REEL */}
              <div
                onClick={() => setShowAddModal(true)}
                className="w-28 sm:w-36 md:w-40 aspect-[9/16] flex-shrink-0 snap-start rounded-2xl border-2 border-dashed border-rose-500/30 hover:border-rose-400/80 bg-slate-900/60 hover:bg-slate-900/90 hover:shadow-[0_0_25px_rgba(244,63,94,0.2)] backdrop-blur-md flex flex-col items-center justify-center p-3 transition-all duration-300 cursor-pointer group text-center select-none"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-500/20 group-hover:text-white transition-all duration-300 mb-2 shadow-inner">
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-rose-300 transition-colors">
                  Dodaj Reel
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-1.5 leading-tight">
                  Zdjęcie • Film • YouTube
                </span>
              </div>

              {/* REEL CARDS IN NAJNOWSZE */}
              {reels.map((reel) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  onClick={() => handleOpenViewer(reel.id)}
                />
              ))}
            </div>
          </div>

          {/* SECTION 2: POPULARNE */}
          <div className="space-y-3 pt-2 border-t border-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-200 uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> POPULARNE
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Najwyższy opór i polubienia</span>
            </div>

            {/* HORIZONTAL SCROLL ROW 2 */}
            <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none snap-x touch-pan-x">
              {popularReels.map((reel) => (
                <ReelCard
                  key={`pop_${reel.id}`}
                  reel={reel}
                  onClick={() => handleOpenViewer(reel.id)}
                />
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* LEVEL 2: FULLSCREEN REEL VIEWER */
        <div className="flex-1 p-2 sm:p-4 flex flex-col items-center justify-center relative max-w-md mx-auto w-full overflow-hidden">
          
          {/* TOP BACK TO HUB BUTTON */}
          <div className="w-full flex items-center justify-between mb-2 px-1">
            <button
              onClick={() => setSelectedReelId(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md"
            >
              <ChevronLeft className="w-4 h-4" /> Biblioteka Reels
            </button>
            <span className="text-[11px] font-mono text-rose-300 font-bold bg-rose-950/60 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
              {currentIndex + 1} / {reels.length}
            </span>
          </div>

          {/* FULLSCREEN REEL PLAYER CONTAINER */}
          <div
            className="relative w-full h-full min-h-[500px] max-h-[720px] rounded-3xl overflow-hidden border border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.15)] bg-black flex flex-col justify-between cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleVideoClick}
          >
            {/* HORIZONTAL TRACK SLIDE DECK */}
            <div
              className="flex h-full w-full pointer-events-none"
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              {reels.map((reel, idx) => {
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={reel.id}
                    className="w-full h-full flex-shrink-0 relative overflow-hidden bg-black"
                  >
                    {/* BACKGROUND MEDIA */}
                    {reel.type === 'youtube' && reel.youtubeId ? (
                      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center">
                        {isCurrent && isPlaying ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${reel.youtubeId}?autoplay=1&controls=0&loop=1&playlist=${reel.youtubeId}&modestbranding=1&rel=0&disablekb=1`}
                            title={reel.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className="w-full h-full border-0 object-cover scale-125 pointer-events-none"
                          />
                        ) : (
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${reel.videoBg})` }}
                          >
                            <div className="absolute inset-0 bg-black/50" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                        style={{ backgroundImage: `url(${reel.videoBg})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* TOP AUTHOR OVERLAY */}
            <div className="absolute top-0 inset-x-0 z-20 p-3.5 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2 bg-black/50 border border-white/10 backdrop-blur-md px-3 py-1 rounded-full shadow-md">
                <img
                  src={currentReel.authorAvatar}
                  alt={currentReel.authorName}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-rose-400/80"
                />
                <span className="text-xs font-semibold text-white/90">{currentReel.authorName}</span>
              </div>
            </div>

            {/* DESKTOP SIDE NAVIGATION BUTTONS */}
            <div className="hidden sm:flex absolute inset-y-0 inset-x-2 z-20 items-center justify-between pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="pointer-events-auto p-2 rounded-full bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/70 backdrop-blur-md transition-all active:scale-95 shadow-lg"
                title="Poprzedni Reel (Swipe Right)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="pointer-events-auto p-2 rounded-full bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/70 backdrop-blur-md transition-all active:scale-95 shadow-lg"
                title="Następny Reel (Swipe Left)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* CENTER PLAY / PAUSE FEEDBACK LAYER */}
            {!isPlaying && !showComments ? (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-black/60 border border-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-2xl">
                  <Play className="w-7 h-7 ml-1 fill-white text-white" />
                </div>
              </div>
            ) : feedbackIcon === 'pause' ? (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-out fade-out duration-500">
                <div className="w-14 h-14 rounded-full bg-black/60 border border-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-2xl">
                  <Pause className="w-7 h-7 fill-white text-white" />
                </div>
              </div>
            ) : feedbackIcon === 'play' ? (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-out fade-out duration-300">
                <div className="w-14 h-14 rounded-full bg-black/60 border border-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-2xl scale-110">
                  <Play className="w-7 h-7 ml-1 fill-white text-white" />
                </div>
              </div>
            ) : null}

            {/* BOTTOM REEL DETAILS & REACTION BAR */}
            <div className="absolute bottom-0 inset-x-0 z-20 pt-12 pb-3.5 px-4 sm:px-5 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-auto">
              {/* Title & Hashtags */}
              <div className="space-y-1.5 mb-3">
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
                  {currentReel.title}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {currentReel.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] bg-rose-950/70 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded-full font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* HORIZONTAL REACTION BAR */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* LIKE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReelLike(currentReel.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md border transition-all text-xs font-bold active:scale-95 ${
                    currentReel.isLiked
                      ? 'bg-rose-600/90 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                      : 'bg-black/50 border-white/20 text-rose-200 hover:bg-black/70 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${currentReel.isLiked ? 'fill-white text-white' : 'text-rose-400'}`} />
                  <span>{currentReel.likes}</span>
                </button>

                {/* COMMENT */}
                <button
                  onClick={handleOpenComments}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md border transition-all text-xs font-bold active:scale-95 ${
                    showComments
                      ? 'bg-rose-500/30 border-rose-400 text-rose-300'
                      : 'bg-black/50 border-white/20 text-slate-200 hover:bg-black/70 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-slate-300" />
                  <span>{totalCommentsCount}</span>
                </button>

                {/* SHARE */}
                <button
                  onClick={handleShareClick}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md text-slate-200 hover:bg-black/70 hover:text-white transition-all text-xs font-bold active:scale-95"
                >
                  <Share2 className="w-4 h-4 text-slate-300" />
                  <span>{shareCopied ? 'Skopiowano!' : 'Udostępnij'}</span>
                </button>
              </div>

              {/* BOTTOM HORIZONTAL PROGRESS LINE */}
              <div className="mt-3 w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / reels.length) * 100}%` }}
                />
              </div>
            </div>

            {/* BOTTOM SHEET COMMENTS PANEL */}
            {showComments && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-x-0 bottom-0 z-30 h-[65%] max-h-[480px] bg-slate-900/95 border-t border-rose-500/30 rounded-t-3xl backdrop-blur-xl shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-bottom"
              >
                {/* BOTTOM SHEET HEADER & HANDLE */}
                <div className="px-4 pt-2.5 pb-2.5 border-b border-slate-800 flex items-center justify-between relative">
                  <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none">
                    <div className="w-10 h-1 rounded-full bg-slate-600/60" />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <MessageCircle className="w-4 h-4 text-rose-400" />
                    <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                      KOMENTARZE <span className="text-rose-400">({totalCommentsCount})</span>
                    </h3>
                  </div>
                  <button
                    onClick={handleCloseComments}
                    className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* SCROLLABLE COMMENTS LIST */}
                <div
                  ref={commentsScrollRef}
                  className="flex-1 overflow-y-auto p-3.5 space-y-3.5 app-scroll-container"
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  {topLevelComments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                      <MessageCircle className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                      <p className="text-xs font-semibold text-slate-400">Brak komentarzy do tego Reela.</p>
                      <p className="text-[11px] text-slate-500">Bądź pierwszy i podziel się swoją opinią!</p>
                    </div>
                  ) : (
                    topLevelComments.map((comment) => {
                      const isCommentLiked = comment.likes.includes(profile.id);
                      const isAuthorOrAdmin = profile.id === comment.authorId || profile.role === 'ADMIN';
                      const childReplies = commentList.filter(c => c.parentId === comment.id);

                      return (
                        <div key={comment.id} className="space-y-2">
                          {/* PARENT COMMENT */}
                          <div className="flex items-start gap-2.5 bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-2xl relative group">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-rose-500/30 flex-shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-rose-300 truncate">
                                  {comment.authorName}
                                </span>
                                <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                              </div>
                              <p className="text-xs text-slate-200 mt-0.5 break-words leading-snug">
                                {comment.content}
                              </p>

                              {/* ACTIONS ROW */}
                              <div className="flex items-center gap-3 mt-1.5 pt-1 border-t border-slate-800/50">
                                <button
                                  onClick={() => likeReelComment(currentReel.id, comment.id)}
                                  className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                                    isCommentLiked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-rose-300'
                                  }`}
                                >
                                  <Heart className={`w-3 h-3 ${isCommentLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                                  <span>{comment.likes.length}</span>
                                </button>

                                <button
                                  onClick={() => setReplyingTo(comment)}
                                  className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                  <CornerDownRight className="w-3 h-3 text-slate-500" />
                                  <span>Odpowiedz</span>
                                </button>

                                {isAuthorOrAdmin && (
                                  <button
                                    onClick={() => setDeleteConfirmId(comment.id)}
                                    className="text-[11px] text-rose-400/80 hover:text-rose-300 flex items-center gap-0.5 ml-auto transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" /> Usuń
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* NESTED REPLIES */}
                          {childReplies.length > 0 && (
                            <div className="pl-3 sm:pl-4 border-l-2 border-rose-500/20 ml-3 space-y-2">
                              {childReplies.map((reply) => {
                                const isReplyLiked = reply.likes.includes(profile.id);
                                const isReplyAuthorOrAdmin = profile.id === reply.authorId || profile.role === 'ADMIN';

                                return (
                                  <div
                                    key={reply.id}
                                    className="flex items-start gap-2 bg-slate-950/80 border border-slate-800/60 p-2 rounded-xl"
                                  >
                                    <img
                                      src={reply.authorAvatar}
                                      alt={reply.authorName}
                                      referrerPolicy="no-referrer"
                                      className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700 flex-shrink-0 mt-0.5"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="text-[11px] font-bold text-slate-200">
                                            {reply.authorName}
                                          </span>
                                          {reply.replyToUser && (
                                            <span className="text-[10px] text-rose-400 font-semibold bg-rose-950/60 px-1.5 py-0.2 rounded">
                                              @{reply.replyToUser}
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[9px] text-slate-500">{reply.createdAt}</span>
                                      </div>
                                      <p className="text-xs text-slate-300 mt-0.5 break-words leading-tight">
                                        {reply.content}
                                      </p>

                                      <div className="flex items-center gap-3 mt-1">
                                        <button
                                          onClick={() => likeReelComment(currentReel.id, reply.id)}
                                          className={`flex items-center gap-1 text-[10px] font-semibold ${
                                            isReplyLiked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-rose-300'
                                          }`}
                                        >
                                          <Heart className={`w-3 h-3 ${isReplyLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                                          <span>{reply.likes.length}</span>
                                        </button>

                                        <button
                                          onClick={() => setReplyingTo(reply)}
                                          className="text-[10px] text-slate-400 hover:text-white font-semibold"
                                        >
                                          Odpowiedz
                                        </button>

                                        {isReplyAuthorOrAdmin && (
                                          <button
                                            onClick={() => setDeleteConfirmId(reply.id)}
                                            className="text-[10px] text-rose-400/80 hover:text-rose-300 ml-auto"
                                          >
                                            Usuń
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* BOTTOM COMPOSER INPUT */}
                <div className="p-3 bg-slate-950 border-t border-slate-800">
                  {replyingTo && (
                    <div className="flex items-center justify-between bg-rose-950/60 border border-rose-500/30 px-3 py-1 rounded-xl mb-2 text-xs text-rose-300 font-semibold">
                      <span>Odpowiadasz użytkownikowi <strong className="text-white">@{replyingTo.authorName}</strong></span>
                      <button onClick={() => setReplyingTo(null)} className="text-rose-400 hover:text-white p-0.5">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendComment} className="flex items-center gap-2">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-rose-500/40 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={replyingTo ? `Odpowiedź dla @${replyingTo.authorName}...` : "Napisz komentarz..."}
                      className="flex-1 bg-slate-900 border border-slate-800 focus:border-rose-500/80 text-xs text-white placeholder-slate-500 rounded-full px-3.5 py-2 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="p-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-rose-500/20 active:scale-95 transition-all flex-shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-rose-500/30 rounded-2xl p-4 shadow-2xl text-center space-y-3">
            <h4 className="text-sm font-bold text-white">Usuwanie komentarza</h4>
            <p className="text-xs text-slate-300">Czy na pewno chcesz usunąć ten komentarz?</p>
            <div className="flex justify-center gap-2 pt-1">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  if (currentReel) {
                    deleteReelComment(currentReel.id, deleteConfirmId);
                  }
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD REEL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-400" /> Dodaj Nowy Reel
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReel} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tytuł wideo</label>
                <input
                  type="text"
                  required
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  placeholder="np. Epicki rajd MaG!"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Typ wideo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReelType('image')}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      reelType === 'image' ? 'bg-rose-500/20 text-rose-300 border-rose-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Image className="w-4 h-4" /> Obraz / Grafika
                  </button>
                  <button
                    type="button"
                    onClick={() => setReelType('youtube')}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      reelType === 'youtube' ? 'bg-rose-500/20 text-rose-300 border-rose-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Youtube className="w-4 h-4 text-rose-500" /> YouTube
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {reelType === 'youtube' ? 'Link YouTube' : 'URL Tła / Obrazu'}
                </label>
                <input
                  type="text"
                  required
                  value={reelMediaUrl}
                  onChange={(e) => setReelMediaUrl(e.target.value)}
                  placeholder={reelType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://images.unsplash.com/...'}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tagi</label>
                <input
                  type="text"
                  value={reelTags}
                  onChange={(e) => setReelTags(e.target.value)}
                  placeholder="#MaG #Turniej"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25"
                >
                  Opublikuj Reel (+60 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* COMPACT REEL CARD COMPONENT FOR HUB ROWS */
interface ReelCardProps {
  reel: Reel;
  onClick: () => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-28 sm:w-36 md:w-40 aspect-[9/16] flex-shrink-0 snap-start relative rounded-2xl overflow-hidden border border-slate-800/80 hover:border-rose-500/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.25)] transition-all duration-300 cursor-pointer group bg-slate-950 select-none"
    >
      {/* THUMBNAIL BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
        style={{ backgroundImage: `url(${reel.videoBg})` }}
      />

      {/* SMOKED GLASS GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/40 group-hover:from-slate-950/90 transition-colors" />

      {/* MEDIA TYPE BADGE TOP RIGHT */}
      <div className="absolute top-2 right-2 z-10">
        {reel.type === 'youtube' ? (
          <span className="bg-red-950/90 border border-red-500/40 text-red-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-md backdrop-blur-md">
            <Youtube className="w-2.5 h-2.5 text-red-400" /> YT
          </span>
        ) : reel.type === 'image' ? (
          <span className="bg-sky-950/90 border border-sky-500/40 text-sky-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-md backdrop-blur-md">
            <Image className="w-2.5 h-2.5 text-sky-400" /> FOTO
          </span>
        ) : (
          <span className="bg-rose-950/90 border border-rose-500/40 text-rose-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-md backdrop-blur-md">
            <Film className="w-2.5 h-2.5 text-rose-400" /> FILM
          </span>
        )}
      </div>

      {/* CENTER PLAY HOVER ICON */}
      <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-9 h-9 rounded-full bg-rose-500/80 border border-white/40 backdrop-blur-md text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
          <Play className="w-4 h-4 ml-0.5 fill-white text-white" />
        </div>
      </div>

      {/* BOTTOM OVERLAY INFO */}
      <div className="absolute bottom-0 inset-x-0 p-2.5 z-10 space-y-1">
        {/* AUTHOR ROW */}
        <div className="flex items-center gap-1.5">
          <img
            src={reel.authorAvatar}
            alt={reel.authorName}
            referrerPolicy="no-referrer"
            className="w-3.5 h-3.5 rounded-full object-cover ring-1 ring-rose-400/80 shrink-0"
          />
          <span className="text-[10px] text-slate-300 font-semibold truncate leading-none">
            {reel.authorName}
          </span>
        </div>

        {/* TITLE */}
        <h3 className="text-[11px] font-bold text-white line-clamp-2 leading-tight group-hover:text-rose-200 transition-colors drop-shadow-sm">
          {reel.title}
        </h3>

        {/* STATS */}
        <div className="flex items-center gap-2 pt-0.5 text-[9px] font-mono text-rose-300/90 font-bold">
          <span className="flex items-center gap-0.5">
            <Heart className="w-2.5 h-2.5 fill-rose-400/50 text-rose-400" /> {reel.likes}
          </span>
          <span className="flex items-center gap-0.5 text-slate-400">
            <MessageCircle className="w-2.5 h-2.5 text-slate-400" /> {reel.comments}
          </span>
        </div>
      </div>
    </div>
  );
};
