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
    setAnimationStarted(true);
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 50);

    const checkCompanion = () => {
      if (progress >= 100) {
        clearInterval(timer);
        const companion = localStorage.getItem('altered-self-companion');
        if (companion) {
          router.replace('/chat');
        } else {
          router.replace('/create');
        }
      }
    };

    if (progress >= 100) {
        checkCompanion();
    }


    return () => clearInterval(timer);
  }, [progress, router]);

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
          <h1 className="font-headline text-8xl font-bold tracking-tighter animate-text-gradient bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent">
            NLS
          </h1>
          <p className="text-sm tracking-[0.4em] text-muted-foreground animate-text-gradient bg-gradient-to-r from-muted-foreground/80 via-foreground to-muted-foreground/80 bg-clip-text text-transparent">
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
