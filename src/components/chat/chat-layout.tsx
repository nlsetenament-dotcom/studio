import { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="relative flex h-screen w-full flex-col bg-background overflow-hidden">
      {/* Subtle ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--primary) / 0.06), transparent 70%)',
        }}
      />
      {children}
    </div>
  );
}
