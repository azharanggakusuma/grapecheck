import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const deviceScheme = useDeviceColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(deviceScheme || 'light');

  useEffect(() => {
    setTheme(deviceScheme || 'light');
  }, [deviceScheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  return context;
};

// Hook `useColorScheme` sekarang menjadi bagian dari file ini
export function useColorScheme() {
  const { theme } = useTheme();
  return theme;
}