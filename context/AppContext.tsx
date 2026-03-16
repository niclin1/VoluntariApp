import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vaga } from '../models/types';

interface AppContextType {
  selectedVaga: Vaga | null;
  setSelectedVaga: (v: Vaga | null) => void;
  userType: 'volunteer' | 'ong';
  setUserType: (t: 'volunteer' | 'ong') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [userType, setUserType] = useState<'volunteer' | 'ong'>('volunteer');

  return (
    <AppContext.Provider value={{ selectedVaga, setSelectedVaga, userType, setUserType }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
