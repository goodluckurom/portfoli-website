'use client';

import { useThemeContext } from '@/providers/ThemeProvider';

export const useTheme = () => {
  const { currentTheme, setTheme } = useThemeContext();
  return { currentTheme, setTheme };
};