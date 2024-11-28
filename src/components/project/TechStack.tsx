'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TechStackProps {
  technologies: string[];
  className?: string;
}

export function TechStack({ technologies, className }: TechStackProps) {
  return (
    <div className={cn('flex flex-wrap gap-4', className)}>
      {technologies.map((tech) => (
        <div
          key={tech}
          className="relative h-12 w-12"
        >
          <Image
            src={tech}
            alt="Technology"
            fill
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
}
