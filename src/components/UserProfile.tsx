import React from 'react';
import { User, Memory, Resort } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Play, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BurgerMenu from '@/components/BurgerMenu';

interface UserProfileProps {
  user: User;
  onBack: () => void;
  onMemorySelect: (memory: Memory) => void;
  onResortSelect: (resort: Resort) => void;
  onUserSelect: (user: User) => void;
  isAdmin: boolean;
  onAdminToggle: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onBack, 
  onMemorySelect,
  onResortSelect,
  onUserSelect,
  isAdmin,
  onAdminToggle
}) => {
  const { getMemoriesByUser, getResortById } = useApp();
  const userMemories = getMemoriesByUser(user.id);

  // Get unique resorts this user has memories in
  const visitedResortIds = [...new Set(userMemories.map(m => m.resortId))];

  return (
    <div className="min-h-screen bg-background animate-glide-in">
      {/* Header - consistent with other views */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Burger menu */}
          <BurgerMenu
            onResortSelect={onResortSelect}
            onUserSelect={onUserSelect}
            isAdmin={isAdmin}
            onAdminToggle={onAdminToggle}
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          
          <h1 className="font-semibold text-lg flex-1">Profile</h1>
          
          {isAdmin && (
            <div className="px-3 py-1.5 bg-primary/10 rounded-full">
              <span className="text-xs font-medium text-primary">Admin</span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/40 flex items-center justify-center text-4xl font-semibold shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-xl">
              {user.sport === 'ski' ? '🎿' : '🏂'}
            </div>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            {user.nickname && user.nickname !== user.name && (
              <p className="text-muted-foreground">@{user.nickname}</p>
            )}
            {user.bio && (
              <p className="mt-2 text-muted-foreground">{user.bio}</p>
            )}
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-3">
              <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                {user.type === 'adult' ? 'Adult' : 'Kid'}
              </span>
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                {userMemories.length} memories
              </span>
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                {visitedResortIds.length} places
              </span>
            </div>
          </div>
        </div>

        {/* Memories grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Memories</h3>
          {userMemories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {userMemories.map((memory) => {
                const resort = getResortById(memory.resortId);
                return (
                  <button
                    key={memory.id}
                    onClick={() => onMemorySelect(memory)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-muted"
                  >
                    <img
                      src={memory.thumbnailUrl || memory.url}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Video indicator */}
                    {memory.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Info overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex items-center gap-1.5 text-white text-sm">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{resort?.name}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No memories yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
