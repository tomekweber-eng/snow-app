import React, { useState, useRef, useEffect } from 'react';
import { Resort, Memory, User } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Play, MapPin, Plus, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
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
  
  // Zoom and pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse/touch handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdmin || isDragging) return;
    
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
    console.log('New memory:', { ...data, resortId: resort.id });
    alert('Memory added! (In production, this would save to the database)');
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <header className="relative z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            </div>

            {/* Resort name */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-border/50">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm md:text-base">{resort.name}</span>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                className="rounded-full w-8 h-8"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                className="rounded-full w-8 h-8"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="rounded-full w-8 h-8"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Admin indicator */}
        {isAdmin && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-full shadow-lg text-xs font-medium">
            <Plus className="w-3 h-3" />
            <span>Click map to add memory</span>
          </div>
        )}
      </header>

      {/* Map Container - Full screen */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-hidden ${isAdmin ? 'cursor-crosshair' : 'cursor-grab'} ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div 
          className="w-full h-full relative transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Resort Map Image - Desaturated */}
          <div 
            className="absolute inset-0"
            onClick={handleMapClick}
          >
            <img
              src={resort.mapImage}
              alt={`${resort.name} ski map`}
              className="w-full h-full object-contain"
              style={{
                filter: 'grayscale(70%) brightness(1.1) contrast(0.9)',
              }}
              draggable={false}
            />
          </div>

          {/* Memory markers */}
          {resortMemories.map((memory) => (
            <button
              key={memory.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMemory(memory);
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
              style={{
                left: `${memory.position?.x || 50}%`,
                top: `${memory.position?.y || 50}%`,
              }}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 w-14 h-14 -m-1 rounded-xl bg-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Thumbnail */}
                <div className={`
                  relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden
                  bg-white p-0.5 shadow-xl border-2 border-white
                  transition-all duration-300
                  group-hover:scale-110 group-hover:shadow-2xl
                  ${memory.type === 'video' ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}>
                  <img
                    src={memory.thumbnailUrl || memory.url}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                    draggable={false}
                  />
                  {memory.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <Play className="w-3.5 h-3.5 text-primary ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Tagged users */}
                {memory.taggedUsers.length > 0 && (
                  <div className="absolute -bottom-1 -right-1 flex -space-x-1.5">
                    {memory.taggedUsers.slice(0, 2).map((userId) => {
                      const user = getUserById(userId);
                      return user ? (
                        <div
                          key={userId}
                          className="w-5 h-5 rounded-full bg-white border-2 border-white flex items-center justify-center text-[9px] font-bold text-primary shadow-md"
                          style={{ backgroundColor: 'hsl(var(--primary) / 0.15)' }}
                        >
                          {user.name.charAt(0)}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="px-2 py-1 bg-foreground text-background text-xs font-medium rounded-lg whitespace-nowrap">
                    {memory.description || 'View memory'}
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* Admin click indicator */}
          {isAdmin && addMemoryPosition && (
            <div 
              className="absolute w-6 h-6 -ml-3 -mt-3 bg-primary rounded-full animate-ping pointer-events-none"
              style={{
                left: `${addMemoryPosition.x}%`,
                top: `${addMemoryPosition.y}%`,
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

      {/* Add Memory Modal */}
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
