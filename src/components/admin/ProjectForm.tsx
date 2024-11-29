'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Project } from '@prisma/client';

interface ProjectFormProps {
  project?: Project;
  isEditing?: boolean;
}

export default function ProjectForm({ project, isEditing }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    content: project?.content || '',
    images: project?.images || [],
    technologies: project?.technologies?.join(', ') || '',
    techStack: project?.techStack?.join(', ') || '',
    github: project?.github || '',
    link: project?.link || '',
    status: project?.status || 'PLANNED',
    featured: project?.featured || false,
    published: project?.published || false,
    slug: project?.slug || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const technologies = formData.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean);

      const techStack = formData.techStack
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        technologies,
        techStack,
      };

      const response = await fetch(
        isEditing ? `/api/projects/${project?.id}` : '/api/projects',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (name === 'images') {
      setFormData((prev) => ({
        ...prev,
        images: value.split(',').map((img) => img.trim()).filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl mx-auto"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-200 p-4 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          required
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Content (Markdown)
        </label>
        <textarea
          name="content"
          id="content"
          required
          rows={10}
          value={formData.content}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50 font-mono"
        />
      </div>

      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Images
        </label>
        <input
          type="text"
          name="images"
          id="images"
          required
          value={formData.images.join(', ')}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <label
          htmlFor="technologies"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Technologies (comma-separated)
        </label>
        <input
          type="text"
          name="technologies"
          id="technologies"
          required
          value={formData.technologies}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <label
          htmlFor="techStack"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Tech Stack (comma-separated)
        </label>
        <input
          type="text"
          name="techStack"
          id="techStack"
          required
          value={formData.techStack}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <label
          htmlFor="github"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          GitHub URL
        </label>
        <input
          type="url"
          name="github"
          id="github"
          required
          value={formData.github}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <label
          htmlFor="link"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Project URL
        </label>
        <input
          type="url"
          name="link"
          id="link"
          required
          value={formData.link}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Status
        </label>
        <select
          name="status"
          id="status"
          required
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        >
          <option value="PLANNED">Planned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 dark:border-primary-700 rounded"
        />
        <label
          htmlFor="featured"
          className="ml-2 block text-sm text-primary-900 dark:text-primary-50"
        >
          Featured
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="published"
          id="published"
          checked={formData.published}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 dark:border-primary-700 rounded"
        />
        <label
          htmlFor="published"
          className="ml-2 block text-sm text-primary-900 dark:text-primary-50"
        >
          Published
        </label>
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Slug
        </label>
        <input
          type="text"
          name="slug"
          id="slug"
          required
          value={formData.slug}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md shadow-sm text-sm font-medium text-primary-700 dark:text-primary-300 bg-white dark:bg-primary-800 hover:bg-primary-50 dark:hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Save Project'
          )}
        </button>
      </div>
    </motion.form>
  );
}
