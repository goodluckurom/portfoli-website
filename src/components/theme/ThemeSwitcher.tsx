'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { themePresets } from '@/lib/themes/presets';

const ThemeSwitcher = () => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-background-card shadow-lg rounded-lg p-4 border border-primary-200 dark:border-primary-800"
      >
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3">
            Theme
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(themePresets).map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`p-2 rounded-md text-xs transition-colors ${
                  currentTheme === theme.id
                    ? 'bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-50'
                    : 'hover:bg-primary-50 dark:hover:bg-primary-800/50 text-primary-600 dark:text-primary-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: theme.settings.colors.primary[500],
                    }}
                  />
                  <span>{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThemeSwitcher;
