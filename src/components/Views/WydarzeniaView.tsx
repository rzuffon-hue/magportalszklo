import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompactHeader } from '../CompactHeader';
import { AvatarWithFrame } from '../AvatarWithFrame';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  X,
  Bell,
  Star,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  HelpCircle,
  XCircle
} from 'lucide-react';
import { EventType, SocialEvent } from '../../types';

export const WydarzeniaView: React.FC = () => {
  const { profile, events, addEvent, updateEvent, deleteEvent, toggleEventRSVP, portalTheme } = useApp();
  const isMirror = portalTheme === 'lustrzany';

  const isManagementAllowed = profile.role === 'ADMIN' || profile.role === 'MODERATOR';

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('Pułapka na Niedźwiedzia');
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [location, setLocation] = useState('Portal MaG / Whiteout Survival');
  const [coverImage, setCoverImage] = useState('');
  const [organizer, setOrganizer] = useState(profile.name);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [hasReminder, setHasReminder] = useState(true);
  const [participantLimit, setParticipantLimit] = useState<number | undefined>(undefined);

  // Participant list toggle for event card
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEventType('Pułapka na Niedźwiedzia');
    setDateStr('');
    setTimeStr('');
    setLocation('Portal MaG / Whiteout Survival');
    setCoverImage('');
    setOrganizer(profile.name);
    setIsHighlighted(false);
    setHasReminder(true);
    setParticipantLimit(undefined);
    setEditingEventId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (ev: SocialEvent) => {
    setEditingEventId(ev.id);
    setTitle(ev.title);
    setDescription(ev.description);
    setEventType(ev.eventType || 'Pułapka na Niedźwiedzia');
    setDateStr(ev.dateStr);
    setTimeStr(ev.timeStr);
    setLocation(ev.location);
    setCoverImage(ev.coverImage);
    setOrganizer(ev.organizer);
    setIsHighlighted(Boolean(ev.isHighlighted));
    setHasReminder(Boolean(ev.hasReminder));
    setParticipantLimit(ev.participantLimit);
    setShowModal(true);
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateStr.trim() || !timeStr.trim()) return;

    if (editingEventId) {
      updateEvent(editingEventId, {
        title: title.trim(),
        description: description.trim(),
        eventType,
        dateStr: dateStr.trim(),
        timeStr: timeStr.trim(),
        location: location.trim(),
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
        organizer: organizer.trim() || profile.name,
        isHighlighted,
        hasReminder,
        participantLimit
      });
    } else {
      addEvent({
        title: title.trim(),
        description: description.trim(),
        eventType,
        dateStr: dateStr.trim(),
        timeStr: timeStr.trim(),
        location: location.trim(),
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
        organizer: organizer.trim() || profile.name,
        isHighlighted,
        hasReminder,
        participantLimit
      });
    }

    setShowModal(false);
    resetForm();
  };

  return (
    <div className={`h-full w-full flex flex-col overflow-hidden font-sans ${isMirror ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* Compact Header */}
      <CompactHeader
        title="Wydarzenia i Kalendarz"
        badge={`${events.length} nadchodzących`}
      />

      {/* Main Content Area */}
      <div className="flex-1 app-scroll-container p-3 sm:p-5 max-w-5xl mx-auto w-full space-y-4">
        
        {/* Top Control Bar */}
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border backdrop-blur-xl ${
          isMirror ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/60 border-slate-800/80 shadow-xl'
        }`}>
          <div>
            <h2 className={`text-sm sm:text-base font-black flex items-center gap-2 ${isMirror ? 'text-slate-950' : 'text-white'}`}>
              <Calendar className="w-4 h-4 text-amber-500" /> Harmonogram Wydarzeń Sojuszu i Portalu
            </h2>
            <p className={`text-xs font-sans ${isMirror ? 'text-slate-600' : 'text-slate-400'}`}>
              Zapisuj się na bitwy SVS, Pułapki na Niedźwiedzia, Odlewnie i spotkania gildii.
            </p>
          </div>

          {isManagementAllowed && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Dodaj wydarzenie
            </button>
          )}
        </div>

        {/* Events List / Empty State */}
        {events.length === 0 ? (
          <div className={`p-8 sm:p-12 text-center rounded-3xl border space-y-3 max-w-lg mx-auto my-8 backdrop-blur-2xl ${
            isMirror ? 'bg-white border-slate-300' : 'bg-slate-900/50 border-slate-800/80'
          }`}>
            <div className={`w-14 h-14 mx-auto rounded-2xl border flex items-center justify-center shadow-sm ${
              isMirror ? 'bg-amber-100 border-amber-300 text-amber-600' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <Sparkles className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className={`text-base font-extrabold ${isMirror ? 'text-slate-950' : 'text-white'}`}>Brak nadchodzących wydarzeń</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              W kalendarzu Portalu MaG nie ma obecnie aktywnych wydarzeń. {isManagementAllowed ? 'Kliknij przycisk powyżej, aby dodać pierwsze wydarzenie!' : 'Zaglądaj tu regularnie, by nie przegapić nadchodzących akcji sojuszu!'}
            </p>
            {isManagementAllowed && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-extrabold hover:bg-amber-400 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Stwórz pierwsze wydarzenie
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => {
              const isExpanded = expandedEventId === ev.id;
              const attendees = ev.attendeesList || [];
              const attendingList = attendees.filter(a => a.status === 'attending');
              const interestedList = attendees.filter(a => a.status === 'interested');

              return (
                <div
                  key={ev.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm backdrop-blur-xl ${
                    isMirror
                      ? ev.isHighlighted
                        ? 'bg-white border-amber-400 ring-2 ring-amber-300'
                        : 'bg-white border-slate-300'
                      : ev.isHighlighted
                        ? 'bg-slate-900/80 border-amber-500/60 ring-1 ring-amber-500/30'
                        : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
                    {/* Cover Image */}
                    <div className="md:col-span-4 h-44 sm:h-48 rounded-xl overflow-hidden relative border border-slate-300 dark:border-slate-800 shrink-0 group">
                      <img
                        src={ev.coverImage}
                        alt={ev.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="bg-slate-950/90 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                          {ev.eventType || 'Spotkanie'}
                        </span>
                        {ev.isHighlighted && (
                          <span className="bg-amber-500 text-black px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3 fill-current" /> Wyróżnione
                          </span>
                        )}
                      </div>

                      {/* Time Badge */}
                      <div className="absolute bottom-2.5 left-2.5 bg-slate-950/90 text-slate-100 border border-slate-700/80 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {ev.dateStr}, {ev.timeStr}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-8 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className={`text-base sm:text-lg font-black ${isMirror ? 'text-slate-950' : 'text-white'}`}>{ev.title}</h3>
                          <span className={`text-xs font-medium block ${isMirror ? 'text-slate-600' : 'text-slate-400'}`}>
                            Organizator: <strong className="text-amber-600 dark:text-amber-300">{ev.organizer}</strong>
                          </span>
                        </div>

                        {/* Admin/Mod Controls */}
                        {isManagementAllowed && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleOpenEditModal(ev)}
                              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                                isMirror ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                              }`}
                              title="Edytuj wydarzenie"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteEvent(ev.id)}
                              className="p-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 hover:bg-rose-200 text-xs transition-all cursor-pointer dark:bg-rose-950/80 dark:border-rose-500/40 dark:text-rose-300"
                              title="Usuń wydarzenie"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className={`text-xs leading-relaxed font-sans line-clamp-3 ${isMirror ? 'text-slate-700' : 'text-slate-300'}`}>
                        {ev.description}
                      </p>

                      <div className={`flex flex-wrap items-center gap-4 text-xs pt-2 border-t ${
                        isMirror ? 'border-slate-200 text-slate-600' : 'border-slate-800/80 text-slate-400'
                      }`}>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" /> {ev.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-amber-500" /> {ev.attendeesCount} {ev.participantLimit ? `/ ${ev.participantLimit}` : ''} zapisanych
                        </span>
                        {ev.hasReminder && (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                            <Bell className="w-3 h-3" /> Powiadomienia włączone
                          </span>
                        )}
                      </div>

                      {/* RSVP Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleEventRSVP(ev.id, 'attending')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              ev.userStatus === 'attending'
                                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                : 'bg-slate-950 border border-slate-800 text-amber-300 hover:bg-slate-900'
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> WEZMĘ UDZIAŁ
                          </button>

                          <button
                            onClick={() => toggleEventRSVP(ev.id, 'interested')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              ev.userStatus === 'interested'
                                ? 'bg-purple-950 border border-purple-500/60 text-purple-200'
                                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <HelpCircle className="w-3.5 h-3.5" /> MOŻE
                          </button>

                          <button
                            onClick={() => toggleEventRSVP(ev.id, 'none')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              ev.userStatus === 'none'
                                ? 'bg-slate-950 border border-slate-800 text-slate-500'
                                : 'bg-slate-950 border border-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" /> NIE MOGĘ
                          </button>
                        </div>

                        {/* Toggle Attendees List Button */}
                        <button
                          onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                          className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                        >
                          {isExpanded ? 'Ukryj listę' : 'Uczestnicy'} ({attendees.length})
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Attendees List Drawer */}
                  {isExpanded && (
                    <div className="bg-slate-950/90 border-t border-slate-800 p-4 space-y-3 animate-in fade-in duration-200">
                      <h4 className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-400" /> Lista zapisanych graczy ({attendees.length})
                      </h4>

                      {attendees.length === 0 ? (
                        <p className="text-xs text-slate-500 py-2">Nikt jeszcze nie potwierdził udziału w wydarzeniu.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {attendees.map((a) => (
                            <div
                              key={a.id}
                              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <AvatarWithFrame
                                  src={a.avatar}
                                  alt={a.name}
                                  frame={a.frame}
                                  size="sm"
                                />
                                <span className="text-xs font-bold text-white truncate">{a.name}</span>
                              </div>

                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${
                                  a.status === 'attending'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                }`}
                              >
                                {a.status === 'attending' ? 'WEZMĘ UDZIAŁ' : 'MOŻE'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: Dodaj / Edytuj Wydarzenie */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                {editingEventId ? 'Edytuj Wydarzenie' : 'Dodaj Nowe Wydarzenie'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nazwa Wydarzenia *</label>
                <input
                  type="text"
                  required
                  placeholder="np. Bitwa o SVS #142 / Pułapka na Niedźwiedzia"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Typ Wydarzenia *</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pułapka na Niedźwiedzia">Pułapka na Niedźwiedzia</option>
                    <option value="Odlewnia">Odlewnia</option>
                    <option value="Kanion">Kanion</option>
                    <option value="SVS">SVS (State vs State)</option>
                    <option value="Turniej">Turniej Sojuszu</option>
                    <option value="Spotkanie">Spotkanie społeczności</option>
                    <option value="Inne">Inne</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Organizator</label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Data (np. Dziś, 28 Lipca) *</label>
                  <input
                    type="text"
                    required
                    placeholder="np. Sobota, 28 Lipca"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Godzina *</label>
                  <input
                    type="text"
                    required
                    placeholder="np. 20:00 UTC+2"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Lokalizacja / Serwer</label>
                <input
                  type="text"
                  placeholder="np. Discord Sojuszu MaG / Gra Whiteout Survival"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Opis Wydarzenia</label>
                <textarea
                  rows={3}
                  placeholder="Szczegóły taktyczne, wymogi koordynacji, zasady uczestnictwa..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Cover Image Selection */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Grafika Okładki</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="url"
                    placeholder="URL grafiki (https://...)"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                  <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-2.5 rounded-xl text-slate-200 font-bold flex items-center gap-1.5 shrink-0 transition-all">
                    <ImageIcon className="w-4 h-4 text-amber-400" /> Upload pliku
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHighlighted}
                    onChange={(e) => setIsHighlighted(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span className="font-bold text-slate-200">Wyróżnione wydarzenie</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasReminder}
                    onChange={(e) => setHasReminder(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span className="font-bold text-slate-200">Przypomnienia dla graczy</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-500/20"
                >
                  {editingEventId ? 'Zapisz Zmiany' : 'Opublikuj Wydarzenie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
