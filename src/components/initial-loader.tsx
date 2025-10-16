'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanion } from '@/hooks/use-companion';

export default function InitialLoader() {
  const router = useRouter();
  const { companion, isLoading } = useCompanion();

  useEffect(() => {
    if (!isLoading) {
      const randomDelay = Math.random() * 3000 + 5000; // Random delay between 5s and 8s
      const timer = setTimeout(() => {
        if (companion) {
          router.replace('/chat');
        } else {
          router.replace('/create');
        }
      }, randomDelay);
      return () => clearTimeout(timer);
    }
  }, [isLoading, companion, router]);

  // Muestra un esqueleto de carga mientras se determina a dónde redirigir.
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <div className="text-center">
            <h1 className="text-8xl font-bold tracking-tighter text-foreground/80 animate-text-glow" style={{ fontFamily: 'serif' }}>
                NLS
            </h1>
            <p className="mt-2 text-lg font-light tracking-[0.4em] text-foreground/60 animate-pulse-subtle">
                ENTERTAINMENT
            </p>
            <div className="mt-8 flex justify-center items-center space-x-2">
                <span className="h-2 w-2 animate-jump-1 rounded-full bg-foreground/70" />
                <span className="h-2 w-2 animate-jump-2 rounded-full bg-foreground/70" />
                <span className="h-2 w-2 animate-jump-3 rounded-full bg-foreground/70" />
            </div>
        </div>
         <div className="absolute bottom-10 w-full px-4 text-center text-xs text-foreground/40 space-y-1 animate-pulse-subtle">
            <p>Luis Bravo, Diego Romero, Carlos Ramires</p>
        </div>
    </div>
  );
}
