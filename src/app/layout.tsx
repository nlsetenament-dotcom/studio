import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { Alegreya } from 'next/font/google';
import { CompanionProvider } from '@/hooks/use-companion';

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
});


export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'Tu Alter Ego',
  description: 'Una relación inmersiva y evolutiva con un compañero de IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn('font-body antialiased', alegreya.variable)}>
        {/* The script to set dark/light mode is now handled in CompanionProvider, 
            but this can be kept for the initial non-JS render to avoid flickering. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const appearance = localStorage.getItem('altered-self-appearance');
                  const theme = localStorage.getItem('altered-self-theme') || 'sunset-orange';
                  
                  if (appearance === 'dark' || (!appearance && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <CompanionProvider>
          {children}
          <Toaster />
        </CompanionProvider>
      </body>
    </html>
  );
}
