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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginClient() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to login');
      }

      // Redirect based on user role
      if (result.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }

      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-300/10 via-primary-500/5 to-primary-700/10 dark:from-primary-100/5 dark:via-primary-300/2 dark:to-primary-500/5" />
      <div className="relative z-10 mx-auto w-full max-w-md space-y-6 p-6">
        <div className="flex flex-col space-y-2 text-center">
          <Icons name="briefcase" className="mx-auto h-10 w-10 text-primary-300" />
          <h1 className="text-3xl font-bold tracking-tighter text-primary-300">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Icons name="mail" className="absolute left-3 top-2.5 h-5 w-5 text-primary-500" />
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
                <Icons name="lock" className="absolute left-3 top-2.5 h-5 w-5 text-primary-500" />
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="pl-10"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button className="w-full" disabled={isLoading}>
              {isLoading && (
                <Icons name="spinner" className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in
            </Button>
          </form>
          <div className="relative">
            
          </div>
                   <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
