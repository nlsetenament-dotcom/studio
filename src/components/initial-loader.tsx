'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InitialLoader() {
  const router = useRouter();

  useEffect(() => {
    const companion = localStorage.getItem('altered-self-companion');
    if (companion) {
        router.replace('/chat');
    } else {
        router.replace('/create');
    }
  }, [router]);

  // Render nothing, just handle redirection
  return null;
}
