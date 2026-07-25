import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Group, ForumSection, ForumTopic } from '../../../types';
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Search,
  Pin,
  Lock,
  X,
  Eye,
  MessageCircle,
  Clock,
  Trash2,
  Edit2
} from 'lucide-react';

interface ForumSectionViewProps {
  group: Group;
  section: ForumSection;
  onBack: () => void;
  onSelectTopic: (topic: ForumTopic) => void;
}

export const ForumSectionView: React.FC<ForumSectionViewProps> = ({
  group,
  section,
  onBack,
  onSelectTopic
}) => {
  const {
    profile,
    addForumTopic,
    deleteForumTopic,
    updateForumSection,
    deleteForumSection
  } = useApp();

  const [topicSearch, setTopicSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New topic form
  const [topicTitle, setTopicTitle] = useState('');
  const [topicContent, setTopicContent] = useState('');
  const [topicImage, setTopicImage] = useState('');
  const [topicLink, setTopicLink] = useState('');
  const [topicYoutube, setTopicYoutube] = useState('');

  // Edit section modal
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [secName, setSecName] = useState(section.name);
  const [secDesc, setSecDesc] = useState(section.description);

  const isPortalAdmin = profile.role === 'ADMIN';
  const isGroupOwner = group.ownerId === profile.id;
  const isGroupMod = group.members.some(
    m => m.userId === profile.id && (m.role === 'MODERATOR' || m.role === 'OWNER')
  );
  const canModerate = isPortalAdmin || isGroupOwner || isGroupMod;

  const sectionTopics = group.forumTopics.filter(t => t.sectionId === section.id);

  const filteredTopics = sectionTopics.filter(t =>
    t.title.toLowerCase().includes(topicSearch.toLowerCase()) ||
    t.content.toLowerCase().includes(topicSearch.toLowerCase()) ||
    t.authorName.toLowerCase().includes(topicSearch.toLowerCase())
  );

  // Sort pinned first
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleCreateTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim() || !topicContent.trim()) return;

    let ytId = topicYoutube.trim();
    if (ytId.includes('v=')) {
      ytId = ytId.split('v=')[1]?.split('&')[0] || ytId;
    } else if (ytId.includes('youtu.be/')) {
      ytId = ytId.split('youtu.be/')[1]?.split('?')[0] || ytId;
    }

    addForumTopic(group.id, section.id, {
      title: topicTitle.trim(),
      content: topicContent.trim(),
      image: topicImage.trim() || undefined,
      linkUrl: topicLink.trim() || undefined,
      youtubeId: ytId || undefined
    });

    setTopicTitle('');
    setTopicContent('');
    setTopicImage('');
    setTopicLink('');
    setTopicYoutube('');
    setShowCreateModal(false);
  };

  const handleSaveSectionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secName.trim()) return;
    updateForumSection(group.id, section.id, {
      name: secName.trim(),
      description: secDesc.trim()
    });
    setShowEditSectionModal(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-serif">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> {section.name}
            </h2>
            <p className="text-xs text-slate-400">{section.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canModerate && (
            <>
              <button
                onClick={() => setShowEditSectionModal(true)}
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                title="Edytuj dział"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  deleteForumSection(group.id, section.id);
                  onBack();
                }}
                className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900"
                title="Usuń dział"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> NOWY TEMAT
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Szukaj tematu w tym dziale..."
          value={topicSearch}
          onChange={(e) => setTopicSearch(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Topics List */}
      <div className="space-y-2.5">
        {sortedTopics.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl text-slate-400 text-xs space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-300">Brak tematów w tym dziale</p>
            <p className="text-slate-500">Bądź pierwszy! Rozpocznij nową dyskusję klikając "NOWY TEMAT".</p>
          </div>
        ) : (
          sortedTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2.5 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
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
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {topic.title}
                  </h3>
                </div>

                {canModerate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteForumTopic(group.id, topic.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Usuń temat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {topic.content}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <img
                    src={topic.authorAvatar}
                    alt={topic.authorName}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-800"
                  />
                  <span className="font-semibold text-slate-300">{topic.authorName}</span>
                  <span className="text-slate-500">• {topic.createdAt}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <MessageCircle className="w-3.5 h-3.5" /> {topic.replies.length}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Eye className="w-3.5 h-3.5" /> {topic.viewsCount}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL: TWORZENIE TEMATU ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                <Plus className="w-4 h-4 text-emerald-400" /> Nowy Temat w: {section.name}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTopicSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tytuł tematu *</label>
                <input
                  type="text"
                  required
                  placeholder="Zwięzły tytuł dyskusji..."
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Treść wpisu *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Napisz szczegółowo, o czym chcesz porozmawiać..."
                  value={topicContent}
                  onChange={(e) => setTopicContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">URL zdjęcia (opcjonalnie)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={topicImage}
                    onChange={(e) => setTopicImage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Link YouTube (opcjonalnie)</label>
                  <input
                    type="text"
                    placeholder="Link lub ID filmu..."
                    value={topicYoutube}
                    onChange={(e) => setTopicYoutube(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-500/20"
                >
                  Opublikuj Temat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDYCJA DZIAŁU ================= */}
      {showEditSectionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Edycja Działu Forum</h3>
            <form onSubmit={handleSaveSectionEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nazwa działu</label>
                <input
                  type="text"
                  required
                  value={secName}
                  onChange={(e) => setSecName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Opis działu</label>
                <textarea
                  rows={2}
                  value={secDesc}
                  onChange={(e) => setSecDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditSectionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
