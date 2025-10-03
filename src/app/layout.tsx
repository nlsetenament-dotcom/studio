import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { Alegreya } from 'next/font/google';

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
});


export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'NLS Entertainment',
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
