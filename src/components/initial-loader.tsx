'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function InitialLoader() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    // Apply theme from localStorage on initial load
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setAnimationStarted(true);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          const companion = localStorage.getItem('altered-self-companion');
          if (companion) {
            router.replace('/chat');
          } else {
            router.replace('/create');
          }
          return 100;
        }
        return prev + 4;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div
          className={cn(
            'text-center transition-all duration-1000',
            animationStarted
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95'
          )}
        >
          <h1 className="font-headline text-8xl font-bold tracking-tighter animate-text-gradient">
            NLS
          </h1>
          <p className="text-sm tracking-[0.4em] animate-text-gradient">
            ENTERTAINMENT
          </p>
        </div>
        <div
          className={cn(
            'w-full space-y-2 transition-all duration-500 delay-500',
            animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <Progress value={progress} className="h-1 w-full [&>div]:bg-primary" />
        </div>
      </div>
    </main>
  );
}
