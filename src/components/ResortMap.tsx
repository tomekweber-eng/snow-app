import React, { useState } from 'react';
import { Resort, Memory, User } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Play, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoPopup from '@/components/VideoPopup';
import BurgerMenu from '@/components/BurgerMenu';
import AddMemoryModal from '@/components/AddMemoryModal';

interface ResortMapProps {
  resort: Resort;
  onBack: () => void;
  onResortSelect: (resort: Resort) => void;
  onUserSelect: (user: User) => void;
  isAdmin: boolean;
  onAdminToggle: () => void;
}

const ResortMap: React.FC<ResortMapProps> = ({ 
  resort, 
  onBack, 
  onResortSelect, 
  onUserSelect,
  isAdmin,
  onAdminToggle
}) => {
  const { getMemoriesByResort, getUserById } = useApp();
  const resortMemories = getMemoriesByResort(resort.id);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [addMemoryPosition, setAddMemoryPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdmin) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setAddMemoryPosition({ x, y });
  };

  const handleSaveMemory = (data: {
    type: 'photo' | 'video';
    url: string;
    description: string;
    taggedUsers: string[];
    position: { x: number; y: number };
  }) => {
    // In a real app, this would save to the database
    console.log('New memory:', { ...data, resortId: resort.id });
    // For now, just show a success message
    alert('Memory added! (In production, this would save to the database)');
  };

  return (
    <div className="min-h-screen bg-background animate-glide-in">
      {/* Header - same as main view */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Burger menu */}
              <BurgerMenu
                onResortSelect={onResortSelect}
                onUserSelect={onUserSelect}
                isAdmin={isAdmin}
                onAdminToggle={onAdminToggle}
              />
              
              {/* Back button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2 rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </div>

            {/* Resort name */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-border/50">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm md:text-base">{resort.name}</span>
            </div>

            {/* Admin indicator */}
            {isAdmin && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                <Plus className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary hidden sm:inline">Click map to add</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Resort Map Container */}
      <div className="max-w-7xl mx-auto p-4">
        <div 
          className={`relative w-full aspect-[4/3] md:aspect-[16/9] bg-white rounded-3xl overflow-hidden shadow-lg border border-border/30 ${
            isAdmin ? 'cursor-crosshair' : ''
          }`}
          onClick={handleMapClick}
        >
          {/* Resort Map Image */}
          <img
            src={resort.mapImage}
            alt={`${resort.name} ski map`}
            className="w-full h-full object-contain bg-gradient-to-b from-sky-50 to-white"
          />

          {/* Memory markers */}
          {resortMemories.map((memory) => (
            <button
              key={memory.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMemory(memory);
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${memory.position?.x || 50}%`,
                top: `${memory.position?.y || 50}%`,
              }}
            >
              {/* Marker */}
              <div className="relative">
                {/* Thumbnail */}
                <div className={`
                  w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden
                  bg-white p-0.5 shadow-lg
                  transition-all duration-300
                  group-hover:scale-110 group-hover:shadow-xl
                  ${memory.type === 'video' ? 'ring-2 ring-primary/50' : ''}
                `}>
                  <img
                    src={memory.thumbnailUrl || memory.url}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {memory.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                        <Play className="w-3 h-3 text-primary ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Tagged users preview */}
                {memory.taggedUsers.length > 0 && (
                  <div className="absolute -bottom-1 -right-1 flex -space-x-1.5">
                    {memory.taggedUsers.slice(0, 2).map((userId) => {
                      const user = getUserById(userId);
                      return user ? (
                        <div
                          key={userId}
                          className="w-5 h-5 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-[9px] font-medium text-primary shadow-sm"
                        >
                          {user.name.charAt(0)}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Admin: Click position indicator */}
          {isAdmin && addMemoryPosition && (
            <div 
              className="absolute w-4 h-4 bg-primary rounded-full animate-ping"
              style={{
                left: `${addMemoryPosition.x}%`,
                top: `${addMemoryPosition.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </div>
      </div>

      {/* Video/Photo Popup */}
      {selectedMemory && (
        <VideoPopup
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}

      {/* Add Memory Modal (Admin) */}
      {addMemoryPosition && (
        <AddMemoryModal
          resortId={resort.id}
          position={addMemoryPosition}
          onClose={() => setAddMemoryPosition(null)}
          onSave={handleSaveMemory}
        />
      )}
    </div>
  );
};

export default ResortMap;
