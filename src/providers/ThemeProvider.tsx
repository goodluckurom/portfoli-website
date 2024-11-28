'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { themePresets, type Theme, type ThemeColors } from '@/lib/themes/presets';

interface ThemeContextType {
  currentTheme: string;
  setTheme: (themeId: string) => void;
  themes: Record<string, Theme>;
  isDark: boolean;
  toggleDark: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

const getInitialTheme = (): string => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themePresets[savedTheme] ? savedTheme : 'minimal';
  }
  return 'minimal';
};

const getInitialDarkMode = (): boolean => {
  if (typeof window !== 'undefined') {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      return JSON.parse(savedDarkMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

const applyTheme = (theme: Theme, isDark: boolean) => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  
  // Toggle dark mode class
  root.classList.toggle('dark', isDark);

  // Apply colors
  Object.entries(colors.primary).forEach(([key, value]) => {
    root.style.setProperty(`--primary-${key}`, value);
  });

  Object.entries(colors.accent).forEach(([key, value]) => {
    root.style.setProperty(`--accent-${key}`, value);
  });

  // Apply background colors
  Object.entries(colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--background-${key}`, value);
  });

  // Apply text colors
  Object.entries(colors.text).forEach(([key, value]) => {
    root.style.setProperty(`--text-${key}`, value);
  });

  // Apply typography
  Object.entries(theme.settings.typography.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });

  // Apply spacing
  Object.entries(theme.settings.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme());
  const [isDark, setIsDark] = useState(getInitialDarkMode());

  useEffect(() => {
    const theme = themePresets[currentTheme];
    if (theme) {
      localStorage.setItem('theme', currentTheme);
      applyTheme(theme, isDark);
    }
  }, [currentTheme, isDark]);

  const toggleDark = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('darkMode', JSON.stringify(newIsDark));
  };

  const theme = themePresets[currentTheme];
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const value = {
    currentTheme,
    setTheme: setCurrentTheme,
    themes: themePresets,
    isDark,
    toggleDark,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
