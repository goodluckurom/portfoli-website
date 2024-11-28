'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterClient() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register');
      }

      toast({
        title: 'Success',
        description: 'Registration successful! Please log in.',
        variant: 'default',
      });

      router.push('/auth/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to register',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-200/10 via-primary-400/5 to-primary-600/10 dark:from-primary-600/5 dark:via-primary-900/2 dark:to-secondary/5" />
      <div className="relative z-10 mx-auto w-full max-w-md space-y-6 p-6">
        <div className="flex flex-col space-y-2 text-center">
          <Icons name="briefcase" className="mx-auto h-10 w-10 text-primary-300 dark:text-primary-300/80" />
          <h1 className="text-3xl font-bold tracking-tighter text-primary-500">Create an account</h1>
          <p className="text-sm text-primary-500">
            Enter your details to get started
          </p>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Icons name="user" className="absolute left-3 top-2.5 h-5 w-5 text-primary-300" />
                <Input
                  id="name"
                  placeholder="Your name"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="pl-10"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Icons name="mail" className="absolute left-3 top-2.5 h-5 w-5 text-primary-300" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Icons name="lock" className="absolute left-3 top-2.5 h-5 w-5 text-primary-300" />
                <Input
                  id="password"
                  placeholder="Create a password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="pl-10"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Icons name="lock" className="absolute left-3 top-2.5 h-5 w-5 text-primary-300" />
                <Input
                  id="confirmPassword"
                  placeholder="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="pl-10"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button className="w-full" disabled={isLoading}>
              {isLoading && (
                <Icons name="spinner" className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create account
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
