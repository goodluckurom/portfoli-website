'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/admin/', icon: LayoutDashboard },
  { name: 'Blog Posts', href: '/admin/blogs', icon: FileText },
  { name: 'Projects', href: '/admin/projects', icon: Briefcase },
  { name: 'Experience', href: '/admin/experience', icon: Award },
  { name: 'Skills', href: '/admin/skills', icon: Code },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/auth/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        'fixed top-0 left-0 h-screen bg-primary-800 shadow-xl transition-all duration-300 z-50',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-primary-700/50">
        {!isCollapsed && (
          <span className="text-lg font-semibold text-primary-100">Goodluck Urom</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-primary-700/50 text-primary-200 hover:text-white transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 pt-4">
        <Link
          href="/"
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            'text-primary-300 hover:bg-primary-800/50 hover:text-white'
          )}
        >
          <Home className="w-5 h-5 mr-3 text-primary-400" />
          {!isCollapsed && 'View Site'}
        </Link>

        <div className="my-2 border-t border-primary-700/50" />

        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-700  text-white shadow-sm'
                  : 'text-primary-300 hover:bg-primary-800/50 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 flex-shrink-0',
                  !isCollapsed && 'mr-3',
                  isActive
                    ? 'text-white'
                    : 'text-primary-400 group-hover:text-primary-300'
                )}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium text-primary-300 rounded-lg hover:bg-primary-800/50 hover:text-white transition-colors w-full',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className={cn('w-5 h-5 flex-shrink-0', !isCollapsed && 'mr-3')} />
          {!isCollapsed && 'Sign Out'}
        </button>
      </div>
    </motion.div>
  );
}
