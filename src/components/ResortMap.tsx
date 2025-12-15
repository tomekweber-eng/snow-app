import React, { useState } from 'react';
import { Resort, Memory } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Play, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MediaViewer from '@/components/MediaViewer';

interface ResortMapProps {
  resort: Resort;
  onBack: () => void;
}

const ResortMap: React.FC<ResortMapProps> = ({ resort, onBack }) => {
  const { getMemoriesByResort, getUserById } = useApp();
  const resortMemories = getMemoriesByResort(resort.id);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <div className="relative w-full h-full min-h-screen bg-background animate-glide-in">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full px-4 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">{resort.name}</span>
          </div>
        </div>
      </div>

      {/* Resort Map Image */}
      <div className="relative w-full h-full">
        <img
          src={resort.mapImage}
          alt={`${resort.name} ski map`}
          className="w-full h-full object-contain bg-muted/10"
        />

        {/* Memory markers */}
        {resortMemories.map((memory) => (
          <button
            key={memory.id}
            onClick={() => setSelectedMemory(memory)}
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
                w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden
                bg-white p-1 shadow-lg
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
                <div className="absolute -bottom-2 -right-2 flex -space-x-2">
                  {memory.taggedUsers.slice(0, 2).map((userId) => {
                    const user = getUserById(userId);
                    return user ? (
                      <div
                        key={userId}
                        className="w-6 h-6 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-[10px] font-medium text-primary shadow-sm"
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
      </div>

      {/* Media Viewer Modal */}
      {selectedMemory && (
        <MediaViewer
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </div>
  );
};

export default ResortMap;
