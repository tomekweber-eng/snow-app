import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Resort } from '@/types';
import { MapPin } from 'lucide-react';

interface CountryMapProps {
  country: 'AT' | 'CZ';
  onResortSelect: (resort: Resort) => void;
}

const CountryMap: React.FC<CountryMapProps> = ({ country, onResortSelect }) => {
  const { getResortsByCountry } = useApp();
  const countryResorts = getResortsByCountry(country);

  const countryName = country === 'AT' ? 'Austria' : 'Czech Republic';

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-b from-muted/30 to-background rounded-3xl overflow-hidden">
      {/* Country shape - simplified SVG representation */}
      <div className="absolute inset-0 flex items-center justify-center">
        {country === 'AT' ? (
          <svg viewBox="0 0 200 100" className="w-full max-w-2xl h-auto opacity-20">
            <path
              d="M20,50 Q40,30 60,35 T100,40 T140,45 T180,50 Q170,70 140,75 T100,70 T60,65 T20,50 Z"
              fill="currentColor"
              className="text-muted-foreground"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 200 100" className="w-full max-w-2xl h-auto opacity-20">
            <path
              d="M30,40 Q60,20 100,30 T170,35 Q180,50 170,65 T100,70 T30,60 Q20,50 30,40 Z"
              fill="currentColor"
              className="text-muted-foreground"
            />
          </svg>
        )}
      </div>

      {/* Country label */}
      <div className="absolute top-8 left-8">
        <h2 className="text-2xl font-semibold text-foreground/80">{countryName}</h2>
      </div>

      {/* Resort pins */}
      <div className="absolute inset-0">
        {countryResorts.map((resort) => (
          <button
            key={resort.id}
            onClick={() => onResortSelect(resort)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: `${resort.coordinates.x}%`,
              top: `${resort.coordinates.y}%`,
            }}
          >
            {/* Pin */}
            <div className={`
              relative flex items-center justify-center
              transition-all duration-300 ease-out
              group-hover:scale-125
            `}>
              <div className={`
                w-4 h-4 rounded-full
                ${resort.visited 
                  ? 'bg-primary shadow-lg shadow-primary/30' 
                  : 'bg-muted-foreground/40'
                }
                transition-all duration-300
                group-hover:w-5 group-hover:h-5
              `} />
              
              {/* Ripple effect for visited */}
              {resort.visited && (
                <div className="absolute w-8 h-8 rounded-full bg-primary/20 animate-ping" />
              )}
            </div>

            {/* Label */}
            <div className={`
              absolute top-full mt-2 left-1/2 -translate-x-1/2
              whitespace-nowrap
              px-3 py-1.5 rounded-full
              bg-white/90 backdrop-blur-sm
              shadow-md border border-border/50
              opacity-0 group-hover:opacity-100
              transform scale-90 group-hover:scale-100
              transition-all duration-200
              pointer-events-none
            `}>
              <span className="text-sm font-medium text-foreground">
                {resort.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountryMap;
