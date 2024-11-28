'use client';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { FloatingBall } from '@/components/FloatingBall';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background-main flex">
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <FloatingBall
            size="600px"
            initialX={0}
            initialY={0}
            color="bg-primary-300"
            shape="blob"
            speed={15}
            opacity={0.1}
            blur="blur-3xl"
          />
          <FloatingBall
            size="500px"
            initialX={600}
            initialY={500}
            color="bg-accent-300"
            shape="blob"
            speed={20}
            opacity={0.08}
            blur="blur-2xl"
          />
          <FloatingBall
            size="400px"
            initialX={300}
            initialY={200}
            color="bg-primary-200"
            shape="square"
            speed={25}
            opacity={0.05}
            blur="blur-xl"
          />
          <FloatingBall
            size="300px"
            initialX={800}
            initialY={100}
            color="bg-accent-200"
            shape="triangle"
            speed={18}
            opacity={0.07}
            blur="blur-2xl"
          />
          <FloatingBall
            size="200px"
            initialX={200}
            initialY={500}
            color="bg-primary-400"
            shape="circle"
            speed={22}
            opacity={0.06}
            blur="blur-xl"
          />
        </div>
      </div>
        <AdminHeader />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 sm:p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
