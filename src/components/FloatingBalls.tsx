'use client';

import { motion } from 'framer-motion';

const balls = [
  { color: 'bg-primary/20', size: 'w-64 h-64', duration: 20 },
  { color: 'bg-secondary/20', size: 'w-48 h-48', duration: 25 },
  { color: 'bg-accent/20', size: 'w-56 h-56', duration: 30 },
  { color: 'bg-muted/20', size: 'w-40 h-40', duration: 22 },
  { color: 'bg-primary/10', size: 'w-72 h-72', duration: 28 },
];

export function FloatingBalls() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {balls.map((ball, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${ball.color} ${ball.size}`}
          animate={{
            x: ['0%', '100%', '50%', '0%'],
            y: ['0%', '50%', '100%', '0%'],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: ball.duration,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            left: `${(index * 20) % 80}%`,
            top: `${(index * 25) % 75}%`,
          }}
        />
      ))}
    </div>
  );
}
