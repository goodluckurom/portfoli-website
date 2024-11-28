'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { useThemeContext } from '@/providers/ThemeProvider';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function MainLayout({ children }: MainLayoutProps) {
  const { currentTheme } = useThemeContext();
  const theme = currentTheme ? currentTheme : 'minimal';
  const pathname = usePathname();

  const isAdmin = !pathname.includes('admin')

  return (
    <div className="min-h-screen bg-background-main text-primary-900 dark:text-primary-50">
      {isAdmin&&<Navbar />}

      <AnimatePresence mode="wait">
        <motion.main
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={pageTransition}
          transition={{ duration: 0.3, type: 'spring' }}
          className="container mx-auto px-4 py-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>
   {isAdmin &&   <Footer />}
    </div>
  );
}
