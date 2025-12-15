import React, { createContext, useContext, ReactNode } from 'react';
import { User, Resort, Memory, Comment } from '@/types';
import { users, resorts, memories, comments } from '@/data/mockData';

interface AppContextType {
  users: User[];
  resorts: Resort[];
  memories: Memory[];
  comments: Comment[];
  getUserById: (id: string) => User | undefined;
  getResortById: (id: string) => Resort | undefined;
  getMemoriesByResort: (resortId: string) => Memory[];
  getMemoriesByUser: (userId: string) => Memory[];
  getResortsByCountry: (country: 'AT' | 'CZ') => Resort[];
  getAdults: () => User[];
  getKids: () => User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getUserById = (id: string) => users.find(user => user.id === id);
  
  const getResortById = (id: string) => resorts.find(resort => resort.id === id);
  
  const getMemoriesByResort = (resortId: string) => 
    memories.filter(memory => memory.resortId === resortId);
  
  const getMemoriesByUser = (userId: string) =>
    memories.filter(memory => memory.taggedUsers.includes(userId));

  const getResortsByCountry = (country: 'AT' | 'CZ') =>
    resorts.filter(resort => resort.country === country);

  const getAdults = () => users.filter(user => user.type === 'adult');
  
  const getKids = () => users.filter(user => user.type === 'kid');

  return (
    <AppContext.Provider value={{
      users,
      resorts,
      memories,
      comments,
      getUserById,
      getResortById,
      getMemoriesByResort,
      getMemoriesByUser,
      getResortsByCountry,
      getAdults,
      getKids,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
