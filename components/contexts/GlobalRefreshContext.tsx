import React, { createContext, useState, useContext, ReactNode } from 'react';

type GlobalRefreshContextType = {
  // A simple counter to trigger re-renders
  refreshKey: number; 
  // Function to increment the counter, causing a re-render
  refreshApp: () => void; 
};

// Create the context with a default undefined value
const GlobalRefreshContext = createContext<GlobalRefreshContextType | undefined>(undefined);

// Define the provider component
export const GlobalRefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshApp = () => {
    // Increment the key to trigger a re-render of consumers
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <GlobalRefreshContext.Provider value={{ refreshKey, refreshApp }}>
      {children}
    </GlobalRefreshContext.Provider>
  );
};

// Custom hook to use the global refresh context
export const useGlobalRefresh = () => {
  const context = useContext(GlobalRefreshContext);
  if (context === undefined) {
    throw new Error('useGlobalRefresh must be used within a GlobalRefreshProvider');
  }
  return context;
};