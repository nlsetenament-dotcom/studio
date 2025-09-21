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
      const companion = localStorage.getItem('altered-self-companion');
      if (progress >= 100) {
        clearInterval(timer);
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
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="animate-in fade-in zoom-in duration-1000">
          <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground md:text-7xl">
            NLS Entertainment
          </h1>
        </div>
        <div className="w-64 animate-in fade-in-up duration-500 delay-500 fill-mode-both">
           <Progress value={progress} className="h-2 [&>div]:bg-primary" />
        </div>
      </div>
    </div>
  );
}
