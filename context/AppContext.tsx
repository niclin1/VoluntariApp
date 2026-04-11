import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Vaga } from '../models/types';

export type UserRole = 'admin' | 'ong' | 'volunteer' | 'guest';

interface AppContextType {
  selectedVaga: Vaga | null;
  setSelectedVaga: (v: Vaga | null) => void;
  userType: 'volunteer' | 'ong';
  setUserType: (t: 'volunteer' | 'ong') => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentUser: any; // Ideally we type this strongly later
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [userType, setUserType] = useState<'volunteer' | 'ong'>('volunteer');   
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('guest');    
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Initialize actual Auth Status
  useEffect(() => {
    let isMounted = true;
    const loadSession = async () => {
      try {
        const response = await fetch('/api/v1/auth/me');
        if (response.ok) {
          const user = await response.json();
          if (isMounted) {
            setCurrentUser(user);
            setCurrentUserRole(user.role as UserRole);
          }
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      }
    };
    loadSession();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppContext.Provider value={{
      selectedVaga, setSelectedVaga,
      userType, setUserType,
      currentUserRole, setCurrentUserRole,
      currentUser
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
