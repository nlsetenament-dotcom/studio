'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanion } from '@/hooks/use-companion';
import { Skeleton } from './ui/skeleton';

export default function InitialLoader() {
  const router = useRouter();
  const { companion, isLoading } = useCompanion();

  useEffect(() => {
    if (!isLoading) {
      if (companion) {
        router.replace('/chat');
      } else {
        router.replace('/create');
      }
    }
  }, [isLoading, companion, router]);

  // Muestra un esqueleto de carga mientras se determina a dónde redirigir.
  return (
      <div className="flex h-screen w-full flex-col">
        <div className="flex items-center gap-4 border-b p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-16 w-3/4 rounded-lg" />
          <Skeleton className="h-16 w-3/4 rounded-lg self-end ml-auto" />
          <Skeleton className="h-24 w-4/5 rounded-lg" />
        </div>
      </div>
  );
}
