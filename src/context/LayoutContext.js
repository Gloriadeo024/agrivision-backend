import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isRTL } from './utils/rtlHelper';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    // Update document direction when user language changes
    const language = user?.preferredLanguage || 'en';
    document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [user?.preferredLanguage]);

  return (
    <LayoutContext.Provider value={{}}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext); 