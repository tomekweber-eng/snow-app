import React from 'react';
import { Memory } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { X, Calendar, MapPin, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

interface VideoPopupProps {
  memory: Memory;
  onClose: () => void;
}

const VideoPopup: React.FC<VideoPopupProps> = ({ memory, onClose }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Popup container */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media */}
        <div className="aspect-video bg-muted">
          {memory.type === 'video' && isYouTubeUrl(memory.url) ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(memory.url)}?autoplay=0&rel=0&modestbranding=1`}
              title="Video"
              className="w-full h-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img
              src={memory.url}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Compact info */}
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(memory.date), 'MMM d, yyyy')}</span>
            </div>

            {/* Location */}
            {resort && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{resort.name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {memory.description && (
            <p className="mt-3 text-sm text-foreground">{memory.description}</p>
          )}

          {/* Tagged users */}
          {memory.taggedUsers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {memory.taggedUsers.map((userId) => {
                const user = getUserById(userId);
                return user ? (
                  <span
                    key={userId}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent/50 rounded-full text-xs font-medium text-accent-foreground"
                  >
                    {user.sport === 'ski' ? '🎿' : '🏂'}
                    {user.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
