'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '@/providers/ThemeProvider';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Palette } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

const getNavItems = (isAdmin: boolean) => {
  const items = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
  ];

  if (isAdmin) {
    items.push({ name: 'Admin', path: '/admin' });
  }

  return items;
};

export default function Navbar() {
  const { currentTheme, setTheme, isDark, toggleDark, themes } = useThemeContext();
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return null;
  }
  const navItems = getNavItems(user?.role === 'ADMIN');

  return (
    <nav className="sticky top-0 z-50 bg-background-main/80 backdrop-blur-lg border-b border-primary-200 dark:border-primary-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold text-primary-900 dark:text-primary-50"
            >
              Goodluck Urom
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="relative text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-50"
              >
                {pathname === item.path ? (
                  <Badge variant="default" className="font-medium">
                    {item.name}
                  </Badge>
                ) : (
                  item.name
                )}
              </Link>
            ))}

            {/* Theme Controls */}
            <div className="relative flex items-center space-x-2">
              {/* Theme Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="p-2 rounded-lg bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-50"
                >
                  <Palette className="h-5 w-5" />
                </button>
                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background-main border border-primary-200 dark:border-primary-800"
                    >
                      <div className="py-1">
                        {Object.entries(themes).map(([id, theme]) => (
                          <button
                            key={id}
                            onClick={() => {
                              setTheme(id);
                              setIsThemeMenuOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-left text-sm hover:bg-primary-100 dark:hover:bg-primary-800 ${
                              currentTheme === id ? 'bg-accent-600 dark:bg-primary-700' : ''
                            }`}
                          >
                            {theme.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDark}
                className="p-2 rounded-lg bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-50"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-50"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-0 right-0 bg-background-main border-b border-primary-200 dark:border-primary-800 py-2"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-50"
                  onClick={() => setIsOpen(false)}
                >
                  {pathname === item.path ? (
                    <Badge variant="default" className="font-medium">
                      {item.name}
                    </Badge>
                  ) : (
                    item.name
                  )}
                </Link>
              ))}
              {/* Mobile Theme Controls */}
              <div className="flex items-center space-x-2 px-3 py-2">
                <button
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="p-2 rounded-lg bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-50"
                >
                  <Palette className="h-5 w-5" />
                </button>
                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background-main border border-primary-200 dark:border-primary-800"
                    >
                      <div className="py-1">
                        {Object.entries(themes).map(([id, theme]) => (
                          <button
                            key={id}
                            onClick={() => {
                              setTheme(id);
                              setIsThemeMenuOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-left text-sm hover:bg-primary-100 dark:hover:bg-primary-800 ${
                              currentTheme === id ? 'bg-accent-600 dark:bg-primary-700' : ''
                            }`}
                          >
                            {theme.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={toggleDark}
                  className="p-2 rounded-lg bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-50"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}