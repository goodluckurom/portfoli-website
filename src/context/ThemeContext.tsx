'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, themePresets } from '@/lib/themes/presets';

interface ThemeContextType {
  currentTheme: string;
  setTheme: (themeId: string) => void;
  themes: Record<string, Theme>;
  isDark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): string => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themePresets[savedTheme] ? savedTheme : 'minimal';
  }
  return 'minimal';
};

const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;

  // Apply colors
  Object.entries(theme.settings.colors.primary).forEach(([key, value]) => {
    root.style.setProperty(`--primary-${key}`, value);
  });

  // Apply background colors
  Object.entries(theme.settings.colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--background-${key}`, value);
  });

  // Apply spacing
  Object.entries(theme.settings.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--${key}-spacing`, value);
  });

  // Apply typography
  Object.entries(theme.settings.typography.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const savedIsDark = localStorage.getItem('isDark');

    if (savedTheme) {
      const parsedTheme = savedTheme;
      setCurrentTheme(parsedTheme);
    }

    if (savedIsDark) {
      const darkMode = JSON.parse(savedIsDark);
      setIsDark(darkMode);
      document.documentElement.classList.toggle('dark', darkMode);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const theme = themePresets[currentTheme];
    if (theme) {
      localStorage.setItem('theme', currentTheme);
      applyTheme(theme);
    }
  }, [currentTheme]);

  const toggleDark = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('isDark', JSON.stringify(newIsDark));
  };

  const value = {
    currentTheme,
    setTheme: setCurrentTheme,
    themes: themePresets,
    isDark,
    toggleDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
