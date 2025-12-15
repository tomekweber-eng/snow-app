import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Resort } from '@/types';

interface UnifiedMapProps {
  onResortSelect: (resort: Resort) => void;
}

const UnifiedMap: React.FC<UnifiedMapProps> = ({ onResortSelect }) => {
  const { resorts } = useApp();
  
  const austriaResorts = resorts.filter(r => r.country === 'AT');
  const czechResorts = resorts.filter(r => r.country === 'CZ');

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-muted/20 to-background overflow-hidden">
      {/* Map container */}
      <div className="relative w-full h-full flex flex-col lg:flex-row">
        
        {/* Czech Republic */}
        <div className="flex-1 relative p-4 md:p-8">
          <div className="relative h-full min-h-[300px] bg-white/50 rounded-3xl border border-border/30 overflow-hidden shadow-sm">
            {/* Country shape - Czech Republic */}
            <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-10">
              <path
                d="M50,80 Q80,40 140,50 T200,55 T260,50 T320,60 T350,80 Q360,120 340,150 T280,160 T200,155 T120,160 T60,140 Q40,110 50,80 Z"
                fill="currentColor"
                className="text-foreground"
              />
            </svg>

            {/* Country label with capital */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground/90">Czech Republic</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-foreground/60" />
                <span className="text-sm text-muted-foreground">Prague</span>
              </div>
            </div>

            {/* Capital marker */}
            <div className="absolute" style={{ left: '35%', top: '40%' }}>
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-foreground/50 border-2 border-white shadow-sm" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground whitespace-nowrap font-medium">
                  Praha
                </span>
              </div>
            </div>

            {/* Resort pins */}
            {czechResorts.map((resort) => (
              <button
                key={resort.id}
                onClick={() => onResortSelect(resort)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                style={{
                  left: `${resort.coordinates.x}%`,
                  top: `${resort.coordinates.y}%`,
                }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Pin */}
                  <div className={`
                    w-5 h-5 md:w-6 md:h-6 rounded-full shadow-lg
                    transition-all duration-300 ease-out
                    group-hover:scale-125
                    ${resort.visited 
                      ? 'bg-primary ring-4 ring-primary/20' 
                      : 'bg-muted-foreground/40'
                    }
                  `}>
                    {resort.visited && (
                      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className={`
                    mt-2 px-3 py-1.5 rounded-full
                    bg-white shadow-md border border-border/50
                    opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
                    transition-all duration-200
                    whitespace-nowrap
                  `}>
                    <span className="text-xs md:text-sm font-medium text-foreground">
                      {resort.name}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:flex items-center px-2">
          <div className="w-px h-2/3 bg-border/50" />
        </div>

        {/* Austria */}
        <div className="flex-1 relative p-4 md:p-8">
          <div className="relative h-full min-h-[300px] bg-white/50 rounded-3xl border border-border/30 overflow-hidden shadow-sm">
            {/* Country shape - Austria */}
            <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-10">
              <path
                d="M30,100 Q60,50 120,60 T200,65 T280,60 T360,80 Q380,100 360,130 T280,150 T200,145 T120,150 T50,130 Q20,115 30,100 Z"
                fill="currentColor"
                className="text-foreground"
              />
            </svg>

            {/* Country label with capital */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground/90">Austria</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-foreground/60" />
                <span className="text-sm text-muted-foreground">Vienna</span>
              </div>
            </div>

            {/* Capital marker */}
            <div className="absolute" style={{ left: '75%', top: '35%' }}>
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-foreground/50 border-2 border-white shadow-sm" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground whitespace-nowrap font-medium">
                  Wien
                </span>
              </div>
            </div>

            {/* Resort pins */}
            {austriaResorts.map((resort) => (
              <button
                key={resort.id}
                onClick={() => onResortSelect(resort)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                style={{
                  left: `${resort.coordinates.x}%`,
                  top: `${resort.coordinates.y}%`,
                }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Pin */}
                  <div className={`
                    w-5 h-5 md:w-6 md:h-6 rounded-full shadow-lg
                    transition-all duration-300 ease-out
                    group-hover:scale-125
                    ${resort.visited 
                      ? 'bg-primary ring-4 ring-primary/20' 
                      : 'bg-muted-foreground/40'
                    }
                  `}>
                    {resort.visited && (
                      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className={`
                    mt-2 px-3 py-1.5 rounded-full
                    bg-white shadow-md border border-border/50
                    opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
                    transition-all duration-200
                    whitespace-nowrap
                  `}>
                    <span className="text-xs md:text-sm font-medium text-foreground">
                      {resort.name}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedMap;
