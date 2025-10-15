
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function InitialLoader() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Apply appearance from localStorage on initial load
    const storedAppearance = localStorage.getItem('altered-self-appearance');
    if (storedAppearance === 'dark' || (!storedAppearance && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

    const timer = setTimeout(() => {
        setIsExiting(true);
    }, randomDelay);

    return () => clearTimeout(timer);
  }, []);
  
  const handleExitComplete = () => {
    const companion = localStorage.getItem('altered-self-companion');
    if (companion) {
        router.replace('/chat');
    } else {
        router.replace('/create');
    }
  };


  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isExiting && (
         <motion.main
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } }}
            className="flex h-screen w-full flex-col items-center justify-center bg-background p-4"
        >
          <div className="flex w-full max-w-md flex-col items-center gap-6">
            <div className="text-center">
              <h1 className="font-headline text-8xl font-bold tracking-tighter animate-text-glow">
                NLS
              </h1>
              <p className="text-sm tracking-[0.4em] text-muted-foreground animate-pulse-subtle">
                ENTERTAINMENT
              </p>
            </div>
            <div className="w-full h-12 flex justify-center items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-jump-1"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-jump-2"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-jump-3"></div>
            </div>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
