'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background-alt/80 backdrop-blur-md">
      <div className="relative flex flex-col items-center gap-2">
        {/* Animated circles */}
        <div className="flex items-center gap-2">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-primary-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-primary-500"
        >
          Loading...
        </motion.div>
        
        {/* Progress bar */}
        <motion.div 
          className="h-1 w-48 overflow-hidden rounded-full bg-primary-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full bg-primary-500"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
