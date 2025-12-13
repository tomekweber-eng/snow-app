import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Location, Route } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Mountain, 
  Calendar, 
  Users, 
  Image as ImageIcon,
  Video,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';

interface LocationDetailProps {
  location: Location;
  onBack: () => void;
  onRouteSelect: (route: Route) => void;
}

export function LocationDetail({ location, onBack, onRouteSelect }: LocationDetailProps) {
  const { getRoutesByLocation, getMediaByLocation, getUserById } = useApp();
  const routes = getRoutesByLocation(location.id);
  const media = getMediaByLocation(location.id);
  const photoCount = media.filter(m => m.type === 'photo').length;
  const videoCount = media.filter(m => m.type === 'video').length;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-red-500';
      case 'expert': return 'bg-black';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="glass" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            {location.name}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4" />
            {location.region} • {location.elevation}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card variant="glass" className="p-4 text-center">
          <Mountain className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-semibold text-foreground">{routes.length}</p>
          <p className="text-sm text-muted-foreground">Routes</p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-semibold text-foreground">{location.tripDates.length}</p>
          <p className="text-sm text-muted-foreground">Trips</p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <ImageIcon className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-semibold text-foreground">{photoCount}</p>
          <p className="text-sm text-muted-foreground">Photos</p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <Video className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-semibold text-foreground">{videoCount}</p>
          <p className="text-sm text-muted-foreground">Videos</p>
        </Card>
      </div>

      {/* Routes List */}
      <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Routes & Memories</h2>
      <div className="space-y-4">
        {routes.map((route, index) => {
          const routeMedia = media.filter(m => m.routeId === route.id);
          
          return (
            <Card
              key={route.id}
              variant="elevated"
              className="p-5 cursor-pointer hover:border-primary/30 group"
              onClick={() => onRouteSelect(route)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getDifficultyColor(route.difficulty)}`} />
                    <h3 className="font-display text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                      {route.name}
                    </h3>
                    {route.isPlanned && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                        Planned
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {format(new Date(route.date), 'MMMM d, yyyy')}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div className="flex -space-x-2">
                        {route.participants.slice(0, 4).map((userId) => {
                          const user = getUserById(userId);
                          return (
                            <div
                              key={userId}
                              className="w-7 h-7 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium text-secondary-foreground"
                              title={user?.name}
                            >
                              {user?.name.charAt(0)}
                            </div>
                          );
                        })}
                        {route.participants.length > 4 && (
                          <div className="w-7 h-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium text-primary">
                            +{route.participants.length - 4}
                          </div>
                        )}
                      </div>
                    </div>

                    {routeMedia.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                        {routeMedia.length} memories
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview thumbnails */}
                {routeMedia.length > 0 && (
                  <div className="hidden md:flex gap-2">
                    {routeMedia.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted"
                      >
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                            <Video className="w-4 h-4 text-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
