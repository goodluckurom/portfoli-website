'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingElementProps {
  size: string;
  initialX: number;
  initialY: number;
  color: string;
  shape?: 'circle' | 'square' | 'triangle' | 'blob';
  speed?: number;
  opacity?: number;
  blur?: string;
}

const shapes = {
  circle: 'rounded-full',
  square: 'rounded-lg',
  triangle: 'clip-path-triangle',
  blob: 'blob'
} as const;

export function FloatingBall({ 
  size, 
  initialX, 
  initialY, 
  color, 
  shape = 'circle',
  speed = 10,
  opacity = 0.2,
  blur = 'blur-3xl'
}: FloatingElementProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [rotation, setRotation] = useState(0);

  const getRandomPosition = () => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    return {
      x: Math.random() * (windowWidth - parseInt(size)),
      y: Math.random() * (windowHeight - parseInt(size)),
    };
  };

  const getRandomRotation = () => {
    return Math.random() * 360;
  };

  useEffect(() => {
    const updatePosition = () => {
      setPosition(getRandomPosition());
      setRotation(getRandomRotation());
    };

    const interval = setInterval(updatePosition, speed * 1000);
    return () => clearInterval(interval);
  }, [speed]);

  const shapeClass = shape === 'blob' 
    ? `[clip-path:path('M120.4,-157.5C159.1,-142.3,195.5,-111.6,209.4,-73.1C223.3,-34.7,214.8,11.4,197.4,51.5C180,91.6,153.7,125.7,119.7,147.1C85.7,168.6,43.8,177.3,3,173.3C-37.9,169.3,-75.8,152.6,-108.6,128.6C-141.5,104.5,-169.3,73.2,-179.6,35.9C-189.9,-1.3,-182.7,-44.5,-163.5,-80.2C-144.2,-115.9,-112.9,-144.2,-78.5,-161.4C-44.1,-178.6,-6.7,-184.8,31.4,-180.5C69.4,-176.2,81.7,-172.6,120.4,-157.5Z')]`
    : shapes[shape];

  return (
    <motion.div
      className={`absolute ${shapeClass} ${blur} ${color}`}
      style={{
        width: size,
        height: size,
        opacity,
      }}
      initial={{ x: initialX, y: initialY, rotate: 0 }}
      animate={{
        x: position.x,
        y: position.y,
        rotate: rotation,
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: speed,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  );
}
