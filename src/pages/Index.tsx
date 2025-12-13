import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PasswordGate } from '@/components/PasswordGate';
import { MainApp } from '@/components/MainApp';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PasswordGate />;
  }

  return <MainApp />;
};

export default Index;
