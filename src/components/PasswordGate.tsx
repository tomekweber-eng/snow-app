import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mountain, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const PasswordGate: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Small delay for feel
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const success = login(password);
    
    if (!success) {
      toast.error('Incorrect password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center mb-4 shadow-lg">
            <Mountain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold text-center">Winter Memories</h1>
          <p className="text-muted-foreground text-center mt-2">
            Our private winter journal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl bg-muted border-0 focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={!password || isLoading}
            className="w-full h-14 text-lg rounded-2xl font-medium"
          >
            {isLoading ? (
              <span className="animate-pulse">Entering...</span>
            ) : (
              <>
                Enter
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Hint */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Private space for our group
        </p>
      </div>
    </div>
  );
};

export default PasswordGate;
