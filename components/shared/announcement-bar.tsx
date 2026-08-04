import type { Announcement } from '../../lib/types/database';

export function AnnouncementBar({ announcement }: { announcement?: Announcement | null }) {
  if (!announcement || !announcement.active || !announcement.message) {
    return null;
  }

  return (
    <div className="announcement">
      {announcement.link_url ? (
        <a href={announcement.link_url} style={{ color: '#ffffff', textDecoration: 'underline' }}>
          {announcement.message}
        </a>
      ) : (
        <span>{announcement.message}</span>
      )}
    </div>
  );
}
