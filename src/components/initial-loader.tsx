'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

export default function InitialLoader() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
    }, 200);

    const checkCompanion = () => {
      if (progress >= 100) {
        clearInterval(timer);
        // Check localStorage only after the loading is complete
        const companion = localStorage.getItem('altered-self-companion');
        if (companion) {
          router.replace('/chat');
        } else {
          router.replace('/create');
        }
      }
    };

    checkCompanion();

    return () => clearInterval(timer);
  }, [progress, router]);

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="text-center animate-in fade-in zoom-in-95 duration-1000">
          <h1 className="font-headline text-8xl font-bold tracking-tighter text-foreground">
            NLS
          </h1>
          <p className="text-lg tracking-[0.3em] text-muted-foreground">ENTERTAINMENT</p>
        </div>
        <div className="w-full animate-in fade-in-up duration-500 delay-500 fill-mode-both space-y-2">
           <p className="text-center text-sm text-muted-foreground">Cargando tu compañer@...</p>
           <Progress value={progress} className="h-2 w-full [&>div]:bg-primary" />
        </div>
      </div>
    </main>
  );
}
