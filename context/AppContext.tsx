import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vaga } from '../models/types';

export type UserRole = 'admin' | 'ong' | 'volunteer' | 'guest';

interface AppContextType {
  selectedVaga: Vaga | null;
  setSelectedVaga: (v: Vaga | null) => void;
  userType: 'volunteer' | 'ong';
  setUserType: (t: 'volunteer' | 'ong') => void;
  // Provisional implementation for Auth Roles
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [userType, setUserType] = useState<'volunteer' | 'ong'>('volunteer');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('guest');

  return (
    <AppContext.Provider value={{ 
      selectedVaga, setSelectedVaga, 
      userType, setUserType,
      currentUserRole, setCurrentUserRole
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
