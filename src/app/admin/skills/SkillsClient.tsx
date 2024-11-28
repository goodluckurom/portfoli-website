'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Skill } from '@prisma/client';
import { toast } from 'sonner';

export default function SkillsClient({ skills }: { skills: Skill[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete skill');
      }

      toast.success('Skill deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete skill');
      console.error('Error deleting skill:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-50">Skills</h1>
        <Link
          href="/admin/skills/new"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-900 text-primary-50 hover:bg-primary-800 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Skill
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg border bg-white dark:bg-primary-800/50 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-50">
                  {skill.name}
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                  {skill.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/admin/skills/${skill.id}/edit`}
                  className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-700/50 text-primary-600 dark:text-primary-400 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(skill.id)}
                  disabled={isDeleting}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-primary-900 dark:text-primary-50">
                  Level:
                </div>
                <div className="flex-1 h-2 bg-primary-100 dark:bg-primary-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 dark:bg-primary-400 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <div className="text-sm text-primary-600 dark:text-primary-400">
                  {skill.level}%
                </div>
              </div>
            </div>
            {skill.category && (
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200">
                  {skill.category}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
