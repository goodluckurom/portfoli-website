// 'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoginClient } from './LoginClient';
import { Icons } from '@/components/icons';
import { dynamicRoutes } from '@/app/config';
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/auth/login');

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default async function LoginPage() {
  const session = await getSession();
  
  // If already logged in, redirect based on role
  if (session) {
    if (session.role === 'ADMIN') {
      redirect('/admin');
    } else {
      redirect('/');
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Background image */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90 dark:from-primary/80 dark:to-secondary/80" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-30"
          style={{
            backgroundImage: 'url(/images/auth-bg.jpg)',
          }}
        />
        <div className="relative z-20 flex h-full flex-col items-center justify-between p-12">
          <div className="flex items-center space-x-2  text-primary-300">
            <Icons name="briefcase" className="h-8 w-8" />
            <span className="text-2xl font-bold">Welcome Back</span>
          </div>
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight  text-primary-300">
              Login to your account 
            </h1>
            <p className="text-lg text-primary-300/90 ">
              Interact with our stories, share your thoughts and connect with us
            </p>
          </div>
          <div className="space-y-4 text-center text-primary-300">
            <div className="space-y-2">
              <p className="text-lg font-medium">Trusted by creators worldwide</p>
              <div className="flex justify-center space-x-4">
                <Icons name="star" className="h-5 w-5" />
                <Icons name="star" className="h-5 w-5" />
                <Icons name="star" className="h-5 w-5" />
                <Icons name="star" className="h-5 w-5" />
                <Icons name="star" className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex items-center justify-center">
        <LoginClient />
      </div>
    </div>
  );
}
