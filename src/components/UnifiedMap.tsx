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

  // Map resort coordinates to SVG positions
  // Czech Republic bounds roughly: x 180-420, y 20-140
  // Austria bounds roughly: x 50-380, y 140-280
  const getResortPosition = (resort: Resort) => {
    if (resort.country === 'CZ') {
      // Map percentage to Czech bounds
      return {
        x: 180 + (resort.coordinates.x / 100) * 240,
        y: 20 + (resort.coordinates.y / 100) * 120,
      };
    } else {
      // Map percentage to Austria bounds
      return {
        x: 50 + (resort.coordinates.x / 100) * 330,
        y: 140 + (resort.coordinates.y / 100) * 140,
      };
    }
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-80px)] bg-background overflow-hidden p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Map SVG */}
        <svg 
          viewBox="0 0 500 320" 
          className="w-full h-auto"
          style={{ maxHeight: 'calc(100vh - 160px)' }}
        >
          {/* Surrounding countries (subtle) */}
          <g className="opacity-30">
            {/* Germany (D) - left of Czech */}
            <text x="120" y="60" className="fill-muted-foreground text-[10px] font-medium">D</text>
            
            {/* Poland (PL) - top right */}
            <text x="400" y="30" className="fill-muted-foreground text-[10px] font-medium">PL</text>
            
            {/* Slovakia (SK) - right of Austria/Czech */}
            <text x="440" y="150" className="fill-muted-foreground text-[10px] font-medium">SK</text>
            
            {/* Hungary (HU) - bottom right */}
            <text x="420" y="260" className="fill-muted-foreground text-[10px] font-medium">HU</text>
            
            {/* Italy (I) - bottom left */}
            <text x="80" y="290" className="fill-muted-foreground text-[10px] font-medium">I</text>
            
            {/* Switzerland (CH) - left of Austria */}
            <text x="20" y="200" className="fill-muted-foreground text-[10px] font-medium">CH</text>
          </g>

          {/* Czech Republic */}
          <g className="group cursor-pointer">
            <path
              d="M180,85 
                 Q200,35 260,25 
                 Q320,20 360,35 
                 Q400,45 420,70 
                 Q435,95 420,120 
                 Q400,140 360,145 
                 Q320,148 280,145 
                 Q240,142 210,130 
                 Q180,120 175,100 
                 Q172,90 180,85 Z"
              className="fill-primary/20 stroke-primary/40 stroke-[1.5] transition-all duration-300 hover:fill-primary/30"
            />
            {/* Country label */}
            <text x="290" y="85" className="fill-foreground/70 text-[14px] font-semibold pointer-events-none">CZ</text>
            
            {/* Prague marker */}
            <g className="pointer-events-none">
              <circle cx="270" cy="70" r="3" className="fill-foreground/50" />
              <text x="280" y="68" className="fill-muted-foreground text-[8px]">Praha</text>
            </g>
          </g>

          {/* Austria */}
          <g className="group cursor-pointer">
            <path
              d="M50,220 
                 Q30,200 50,180 
                 Q70,165 100,160 
                 Q130,155 160,150 
                 Q200,145 240,145 
                 Q280,145 320,150 
                 Q360,155 380,170 
                 Q400,185 395,210 
                 Q390,235 360,250 
                 Q320,265 280,265 
                 Q240,265 200,260 
                 Q160,255 120,245 
                 Q80,235 50,220 Z"
              className="fill-accent/30 stroke-accent/50 stroke-[1.5] transition-all duration-300 hover:fill-accent/40"
            />
            {/* Country label */}
            <text x="220" y="210" className="fill-foreground/70 text-[14px] font-semibold pointer-events-none">A</text>
            
            {/* Vienna marker */}
            <g className="pointer-events-none">
              <circle cx="365" cy="175" r="3" className="fill-foreground/50" />
              <text x="372" y="173" className="fill-muted-foreground text-[8px]">Wien</text>
            </g>
          </g>

          {/* Resort pins - Czech Republic */}
          {czechResorts.map((resort) => {
            const pos = getResortPosition(resort);
            return (
              <g 
                key={resort.id} 
                className="cursor-pointer group/pin"
                onClick={() => onResortSelect(resort)}
              >
                {/* Pin glow for visited */}
                {resort.visited && (
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r="12" 
                    className="fill-primary/20 animate-pulse" 
                  />
                )}
                
                {/* Pin circle */}
                <circle 
                  cx={pos.x} 
                  cy={pos.y} 
                  r="6" 
                  className={`
                    transition-all duration-300
                    group-hover/pin:r-8
                    ${resort.visited 
                      ? 'fill-primary stroke-white stroke-2' 
                      : 'fill-muted-foreground/40 stroke-white stroke-1'
                    }
                  `}
                />
                
                {/* Label */}
                <g className="opacity-0 group-hover/pin:opacity-100 transition-opacity duration-200">
                  <rect 
                    x={pos.x - 30} 
                    y={pos.y + 10} 
                    width="60" 
                    height="18" 
                    rx="9" 
                    className="fill-white shadow-lg"
                    filter="url(#shadow)"
                  />
                  <text 
                    x={pos.x} 
                    y={pos.y + 22} 
                    textAnchor="middle" 
                    className="fill-foreground text-[8px] font-medium"
                  >
                    {resort.name}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Resort pins - Austria */}
          {austriaResorts.map((resort) => {
            const pos = getResortPosition(resort);
            return (
              <g 
                key={resort.id} 
                className="cursor-pointer group/pin"
                onClick={() => onResortSelect(resort)}
              >
                {/* Pin glow for visited */}
                {resort.visited && (
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r="12" 
                    className="fill-primary/20 animate-pulse" 
                  />
                )}
                
                {/* Pin circle */}
                <circle 
                  cx={pos.x} 
                  cy={pos.y} 
                  r="6" 
                  className={`
                    transition-all duration-300
                    group-hover/pin:r-8
                    ${resort.visited 
                      ? 'fill-primary stroke-white stroke-2' 
                      : 'fill-muted-foreground/40 stroke-white stroke-1'
                    }
                  `}
                />
                
                {/* Label */}
                <g className="opacity-0 group-hover/pin:opacity-100 transition-opacity duration-200">
                  <rect 
                    x={pos.x - 30} 
                    y={pos.y + 10} 
                    width="60" 
                    height="18" 
                    rx="9" 
                    className="fill-white"
                    filter="url(#shadow)"
                  />
                  <text 
                    x={pos.x} 
                    y={pos.y + 22} 
                    textAnchor="middle" 
                    className="fill-foreground text-[8px] font-medium"
                  >
                    {resort.name}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Shadow filter for labels */}
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15"/>
            </filter>
          </defs>
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
            <span>Planned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedMap;
