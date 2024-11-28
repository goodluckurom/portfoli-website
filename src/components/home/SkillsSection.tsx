'use client';

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '@prisma/client';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useInView } from 'react-intersection-observer';

interface SkillsSectionProps {
  skills: Skill[];
  isLoading?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const categoryVariant = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

function SkillCard({ skill }: { skill: Skill }) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <>
      <motion.div
        ref={ref}
        className="relative p-4 rounded-xl border border-primary-200 dark:border-primary-700 bg-white dark:bg-primary-900 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        whileHover={{ scale: 1.02, y: -5 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-4 mb-3">
          {skill.icon && (
            <motion.div 
              className="relative w-14 h-14 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-800 ring-2 ring-primary-200 dark:ring-primary-700"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Image
                src={skill.icon}
                alt={skill.name}
                fill
                className="object-cover"
              />
            </motion.div>
          )}
          <div className="flex-1 min-w-0">
            <motion.h4 
              className="text-base font-medium text-primary-900 dark:text-primary-50 mb-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {skill.name}
            </motion.h4>
            <div className="flex justify-between items-center gap-2">
              <div className="relative h-2.5 flex-grow bg-primary-100 dark:bg-primary-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: false }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500"
                />
              </div>
              <motion.span 
                className="text-sm font-medium text-primary-600 dark:text-primary-400 min-w-[3rem] text-right"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                {skill.level}%
              </motion.span>
            </div>
          </div>
        </div>
        {skill.description && (
          <motion.p 
            className="text-sm text-primary-600 dark:text-primary-400 line-clamp-2 mt-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {skill.description}
          </motion.p>
        )}
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-4">
              {skill.icon && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-800 ring-2 ring-primary-200 dark:ring-primary-700">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold">{skill.name}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Proficiency: {skill.level}%
                </p>
              </div>
            </DialogTitle>
            <DialogDescription className="mt-4">
              {skill.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SkillCategorySkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-primary-200 dark:border-primary-700">
            <div className="flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-2.5 w-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-full mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection({ skills, isLoading }: SkillsSectionProps) {
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-2 w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-100px" }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <motion.h2
            variants={item}
            className="text-3xl font-bold"
          >
            Skills & Expertise
          </motion.h2>
          <motion.p
            variants={item}
            className="text-muted-foreground"
          >
            Technologies and tools I work with
          </motion.p>
        </div>

        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-4"
            >
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="text-lg font-semibold"
              >
                {category}
              </motion.h3>
              <motion.div 
                className="space-y-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: false }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: index * 0.2,
                    },
                  },
                }}
              >
                {categorySkills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeOut"
                        }
                      }
                    }}
                  >
                    <SkillCard skill={skill} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
