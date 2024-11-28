'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Skill } from '@prisma/client';

interface SkillsPageClientProps {
  groupedSkills: Record<string, Skill[]>;
}

export default function SkillsPageClient({ groupedSkills }: SkillsPageClientProps) {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="heading-1 mb-12">Skills</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedSkills).map(([category, skills], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <h2 className="heading-3 mb-6">{category}</h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-primary-500">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="h-2 bg-primary-100 dark:bg-primary-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-primary-600 dark:bg-primary-400 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
