import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Route } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CommentsSection } from '@/components/CommentsSection';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Image as ImageIcon,
  Video,
  Play,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface RouteDetailProps {
  route: Route;
  onBack: () => void;
}

export function RouteDetail({ route, onBack }: RouteDetailProps) {
  const { getMediaByRoute, getUserById } = useApp();
  const media = getMediaByRoute(route.id);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return { label: 'Easy', color: 'text-green-400' };
      case 'intermediate': return { label: 'Intermediate', color: 'text-blue-400' };
      case 'advanced': return { label: 'Advanced', color: 'text-red-400' };
      case 'expert': return { label: 'Expert', color: 'text-foreground' };
      default: return { label: 'Unknown', color: 'text-muted-foreground' };
    }
  };

  const difficulty = getDifficultyLabel(route.difficulty);

  const openMedia = (index: number) => setSelectedMediaIndex(index);
  const closeMedia = () => setSelectedMediaIndex(null);
  const prevMedia = () => setSelectedMediaIndex((i) => (i !== null && i > 0 ? i - 1 : media.length - 1));
  const nextMedia = () => setSelectedMediaIndex((i) => (i !== null && i < media.length - 1 ? i + 1 : 0));

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="glass" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            {route.name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(route.date), 'MMMM d, yyyy')}
            </span>
            <span className={difficulty.color}>{difficulty.label}</span>
          </div>
        </div>
      </div>

      {/* Participants */}
      <Card variant="glass" className="p-4 mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Riders:</span>
          <div className="flex flex-wrap gap-2">
            {route.participants.map((userId) => {
              const user = getUserById(userId);
              return (
                <div
                  key={userId}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="text-secondary-foreground">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.type === 'skier' ? '⛷️' : '🏂'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Route Timeline Visual */}
      {route.isPlanned ? (
        <Card variant="glass" className="p-6 mb-6 text-center">
          <p className="text-muted-foreground">
            This route is planned but not yet ridden. Memories will appear here after the trip!
          </p>
        </Card>
      ) : (
        <>
          {/* Media Grid */}
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Memories from this ride
          </h2>

          {media.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {media.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => openMedia(index)}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                >
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Video indicator */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 text-foreground ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Time indicator */}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs text-foreground/80">
                      {format(new Date(item.timestamp), 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card variant="glass" className="p-8 text-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No media yet for this route</p>
            </Card>
          )}
        </>
      )}

      {/* Comments Section */}
      <CommentsSection targetType="route" targetId={route.id} />

      {/* Lightbox */}
      {selectedMediaIndex !== null && media[selectedMediaIndex] && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center animate-scale-in">
          <button
            onClick={closeMedia}
            className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevMedia}
            className="absolute left-4 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextMedia}
            className="absolute right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh] mx-4">
            {media[selectedMediaIndex].type === 'video' ? (
              <div className="relative aspect-video bg-card rounded-xl overflow-hidden">
                <img
                  src={media[selectedMediaIndex].url}
                  alt=""
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={media[selectedMediaIndex].url}
                alt=""
                className="max-h-[80vh] rounded-xl object-contain"
              />
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {format(new Date(media[selectedMediaIndex].timestamp), 'MMMM d, yyyy • h:mm a')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedMediaIndex + 1} of {media.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
