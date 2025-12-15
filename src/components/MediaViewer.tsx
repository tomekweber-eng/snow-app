import React from 'react';
import { Memory } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { X, Play, Calendar, MapPin, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

interface MediaViewerProps {
  memory: Memory;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ memory, onClose }) => {
  const { getUserById, getResortById } = useApp();
  const resort = getResortById(memory.resortId);

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media */}
        <div className="aspect-video bg-muted">
          {memory.type === 'video' && isYouTubeUrl(memory.url) ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(memory.url)}?autoplay=1`}
              title="Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img
              src={memory.url}
              alt=""
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(memory.date), 'MMMM d, yyyy')}</span>
            </div>

            {/* Location */}
            {resort && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{resort.name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {memory.description && (
            <p className="mt-4 text-foreground">{memory.description}</p>
          )}

          {/* Tagged users */}
          {memory.taggedUsers.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {memory.taggedUsers.map((userId) => {
                  const user = getUserById(userId);
                  return user ? (
                    <span
                      key={userId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent rounded-full text-sm font-medium text-accent-foreground"
                    >
                      {user.sport === 'ski' ? '🎿' : '🏂'}
                      {user.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaViewer;
