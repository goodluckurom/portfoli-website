'use client';

import React from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Code2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string | null;
}

interface SkillListClientProps {
  skills: Skill[];
}

export function SkillListClient({ skills }: SkillListClientProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete skill');
      
      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill. Please try again.');
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-8">
      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <div key={category}>
          <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-4">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorySkills.map((skill) => (
              <Card key={skill.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                      {skill.icon ? (
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="w-6 h-6"
                        />
                      ) : (
                        <Code2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-primary-900 dark:text-primary-100">
                        {skill.name}
                      </h3>
                      <div className="mt-1 w-full bg-primary-100 dark:bg-primary-800 rounded-full h-2">
                        <div
                          className="bg-primary-600 dark:bg-primary-400 h-2 rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/skills/${skill.id}/edit`}
                      className="p-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-100"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-primary-600 dark:text-primary-400">
            No skills added yet. Add your first skill!
          </p>
        </div>
      )}
    </div>
  );
}
