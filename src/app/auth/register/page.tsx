import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { RegisterClient } from './RegisterClient';
import { Icons } from '@/components/icons';

export default async function RegisterPage() {
  const session = await getSession();
  
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary-300/90 to-primary-500/90 dark:from-primary-600/80 dark:to-primary-800/80" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-30"
          style={{
            backgroundImage: 'url(/images/auth-bg.jpg)',
          }}
        />
        <div className="relative z-20 flex h-full flex-col items-center justify-between p-12">
          <div className="flex items-center space-x-2 text-primary-300">
            <Icons name="briefcase" className="h-8 w-8" />
            <span className="text-2xl font-bold">Join Us</span>
          </div>
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary-300">
              Join Our Blog Platform
            </h1>
            <p className="text-lg text-primary-300/90">
              Create an account to start interacting with our stories.
            </p>
          </div>
          <div className="space-y-4 text-center text-primary-300">
            <div className="space-y-2">
              <p className="text-lg font-medium">Start your journey today</p>
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

      {/* Right side - Register form */}
      <div className="flex items-center justify-center">
        <RegisterClient />
      </div>
    </div>
  );
}
