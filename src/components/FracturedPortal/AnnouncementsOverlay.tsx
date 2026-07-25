import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnnouncementGlassSheet } from './AnnouncementGlassSheet';

export const AnnouncementsOverlay: React.FC = () => {
  const {
    profile,
    isAuthenticated,
    announcements,
    confirmAnnouncementRead,
    previewAnnouncement,
    setPreviewAnnouncement,
    activeAnnouncementModal,
    setActiveAnnouncementModal
  } = useApp();

  const [dismissedSessionIds, setDismissedSessionIds] = useState<string[]>([]);

  if (!isAuthenticated || !profile) return null;

  // 1. Check if there is a preview announcement from Admin Panel
  if (previewAnnouncement) {
    return (
      <AnnouncementGlassSheet
        announcement={previewAnnouncement}
        isPreview={true}
        onDismiss={() => setPreviewAnnouncement(null)}
      />
    );
  }

  // 2. Check if user clicked a specific past announcement to review
  if (activeAnnouncementModal) {
    return (
      <AnnouncementGlassSheet
        announcement={activeAnnouncementModal}
        isPreview={true}
        onDismiss={() => setActiveAnnouncementModal(null)}
      />
    );
  }

  // 3. Filter unread active announcements for current user
  const unreadAnnouncements = announcements.filter(ann => {
    if (ann.status !== 'active') return false;
    
    // Check expiration if present
    if (ann.expiresAt && ann.expiresAt.trim() !== '') {
      const expTime = new Date(ann.expiresAt).getTime();
      if (!isNaN(expTime) && expTime < Date.now()) return false;
    }

    // Check if dismissed in current session (for non-mandatory items)
    if (dismissedSessionIds.includes(ann.id)) return false;

    // Check if user confirmed read
    const userConfirmed = ann.confirmations?.some(c =>
      (c.userId === profile.id || c.username === profile.name) && Boolean(c.confirmedAt)
    );

    return !userConfirmed;
  });

  if (unreadAnnouncements.length === 0) return null;

  const currentAnnouncement = unreadAnnouncements[0];

  const handleConfirm = (announcementId: string) => {
    confirmAnnouncementRead(announcementId);
  };

  const handleDismiss = () => {
    if (currentAnnouncement.requirement === 'ZWYKŁE') {
      setDismissedSessionIds(prev => [...prev, currentAnnouncement.id]);
    }
  };

  return (
    <AnnouncementGlassSheet
      announcement={currentAnnouncement}
      currentIndex={1}
      totalCount={unreadAnnouncements.length}
      onConfirm={handleConfirm}
      onDismiss={handleDismiss}
    />
  );
};
