'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InitialLoader() {
  const router = useRouter();

  useEffect(() => {
    // Apply theme from localStorage on initial load
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Random delay between 5 and 10 seconds
    const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

    const timer = setTimeout(() => {
        const companion = localStorage.getItem('altered-self-companion');
        if (companion) {
            router.push('/chat');
        } else {
            router.push('/create');
        }
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="font-headline text-8xl font-bold tracking-tighter animate-text-glow">
            NLS
          </h1>
          <p className="text-sm tracking-[0.4em] text-muted-foreground animate-pulse-subtle">
            ENTERTAINMENT
          </p>
        </div>
        <div className="w-full h-12 flex justify-center items-center">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-subtle"></div>
        </div>
      </div>
    </main>
  );
}
