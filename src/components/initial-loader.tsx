'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanion } from '@/hooks/use-companion';

export default function InitialLoader() {
  const router = useRouter();
  const { companion, isLoading } = useCompanion();
  const [isTimingOut, setIsTimingOut] = useState(true);

  // Efecto para el retardo artificial
  useEffect(() => {
    // Genera un tiempo aleatorio entre 5000ms y 8000ms
    const delay = Math.random() * (8000 - 5000) + 5000;
    const timer = setTimeout(() => {
      setIsTimingOut(false);
    }, delay);

    // Función de limpieza para limpiar el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Redirigir solo cuando la carga de datos y el temporizador hayan finalizado
    if (!isLoading && !isTimingOut) {
      if (companion) {
        router.replace('/chat');
      } else {
        router.replace('/create');
      }
    }
  }, [isLoading, companion, router, isTimingOut]);

  // Muestra un esqueleto de carga mientras se determina a dónde redirigir o el temporizador está activo.
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black">
        <div className="text-center">
            <h1 className="text-8xl font-bold tracking-tighter text-white animate-text-glow" style={{ fontFamily: 'serif' }}>
                NLS
            </h1>
            <p className="mt-2 text-lg font-light tracking-[0.4em] text-white/80 animate-pulse-subtle">
                ENTERTAINMENT
            </p>
        </div>
        <div className="absolute bottom-20 flex items-center space-x-2">
            <span className="h-2 w-2 animate-jump-1 rounded-full bg-white/70" />
            <span className="h-2 w-2 animate-jump-2 rounded-full bg-white/70" />
            <span className="h-2 w-2 animate-jump-3 rounded-full bg-white/70" />
        </div>
         <div className="absolute bottom-10 w-full px-4 text-center text-xs text-white/40 space-y-1 animate-pulse-subtle">
            <p>Luis Bravo, Diego Romero, Carlos Ramires</p>
        </div>
    </div>
  );
}
