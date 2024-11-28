'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-200 p-4 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900 text-green-500 dark:text-green-200 p-4 rounded-md">
          Message sent successfully! I'll get back to you soon.
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Subject
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-primary-900 dark:text-primary-50"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-primary-800 dark:text-primary-50"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center button-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
            'Send Message'
          )}
        </button>
      </div>
    </motion.form>
  );
}
