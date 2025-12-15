import React, { useState, useRef } from 'react';
import { Resort, Memory, User } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Play, MapPin, Plus, ZoomIn, ZoomOut, Maximize2, Camera } from 'lucide-react';
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
  const [hasMoved, setHasMoved] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [clickStart, setClickStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse/touch handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    setClickStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = Math.abs(e.clientX - clickStart.x);
    const dy = Math.abs(e.clientY - clickStart.y);
    if (dx > 5 || dy > 5) {
      setHasMoved(true);
    }
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const wasClick = isDragging && !hasMoved;
    setIsDragging(false);
    
    // If it was a click (no movement) and admin mode, add memory
    if (wasClick && isAdmin && containerRef.current) {
      const innerDiv = containerRef.current.querySelector('.map-inner') as HTMLElement;
      if (innerDiv) {
        const rect = innerDiv.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setAddMemoryPosition({ x, y });
      }
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setHasMoved(false);
      setDragStart({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
      setClickStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = Math.abs(e.touches[0].clientX - clickStart.x);
    const dy = Math.abs(e.touches[0].clientY - clickStart.y);
    if (dx > 5 || dy > 5) {
      setHasMoved(true);
    }
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const wasClick = isDragging && !hasMoved;
    setIsDragging(false);
    
    if (wasClick && isAdmin && containerRef.current && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const innerDiv = containerRef.current.querySelector('.map-inner') as HTMLElement;
      if (innerDiv) {
        const rect = innerDiv.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        setAddMemoryPosition({ x, y });
      }
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
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
          className="map-inner w-full h-full relative transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Resort Map Image - Desaturated */}
          <div className="absolute inset-0">
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

          {/* Memory markers - Pin style with icons */}
          {resortMemories.map((memory) => (
            <button
              key={memory.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMemory(memory);
              }}
              className="absolute transform -translate-x-1/2 -translate-y-full group z-10"
              style={{
                left: `${memory.position?.x || 50}%`,
                top: `${memory.position?.y || 50}%`,
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Pin circle with icon - smaller size */}
                <div className={`
                  relative w-7 h-7 md:w-8 md:h-8 rounded-full
                  flex items-center justify-center
                  shadow-lg border-2 border-white
                  transition-all duration-300
                  group-hover:scale-125 group-hover:shadow-xl
                  ${memory.type === 'video' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-accent text-accent-foreground'
                  }
                `}>
                  {memory.type === 'video' ? (
                    <Play className="w-3 h-3 md:w-3.5 md:h-3.5 ml-0.5" fill="currentColor" />
                  ) : (
                    <Camera className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  )}
                </div>
                
                {/* Pin pointer/tail - smaller */}
                <div className={`w-0 h-0 -mt-0.5 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent ${
                  memory.type === 'video' ? 'border-t-primary' : 'border-t-accent'
                }`} />

                {/* Tagged users count badge - smaller */}
                {memory.taggedUsers.length > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-border flex items-center justify-center text-[8px] font-bold text-foreground shadow">
                    {memory.taggedUsers.length}
                  </div>
                )}

                {/* Tooltip on hover */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-full whitespace-nowrap shadow-lg">
                    {memory.description || (memory.type === 'video' ? 'Watch video' : 'View photo')}
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
