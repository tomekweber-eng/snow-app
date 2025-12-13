import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mountain, Snowflake } from 'lucide-react';
import winterHero from '@/assets/winter-hero.jpg';

export function PasswordGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${winterHero})` }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      
      {/* Animated snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <Snowflake
            key={i}
            className="absolute text-snow/30 animate-snow-drift"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              fontSize: `${Math.random() * 16 + 8}px`,
            }}
          />
        ))}
      </div>

      {/* Warm glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[120px] animate-glow-pulse" />

      {/* Main content */}
      <div className={`relative z-10 w-full max-w-md px-6 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-firelight/20 border border-primary/40 mb-6 shadow-glow backdrop-blur-sm">
            <Mountain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-3">
            Winter Memories
          </h1>
          <p className="text-muted-foreground text-lg">
            A shared journal for our mountain adventures
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter the secret password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`text-center text-lg h-14 bg-card/60 ${error ? 'border-destructive ring-destructive/50' : ''}`}
              autoFocus
            />
            {error && (
              <p className="absolute -bottom-6 left-0 right-0 text-center text-sm text-destructive animate-fade-up">
                Wrong password. Try again!
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="warm"
            size="xl"
            className="w-full"
          >
            Enter the Cabin
          </Button>
        </form>

        <p className="text-center text-muted-foreground/60 text-sm mt-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          A private space for friends
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}
