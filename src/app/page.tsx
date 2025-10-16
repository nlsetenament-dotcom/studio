import InitialLoader from '@/components/initial-loader';
import {Button} from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
          prefetch={false}>
          <span className="text-xl font-bold">NLS Entertainment</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/create" passHref>
            <Button>Crear Compañero</Button>
          </Link>
          <Link href="/chat" passHref>
            <Button variant="outline">Chatear Ahora</Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center bg-background p-4 text-center md:p-6">
        <div className="max-w-2xl space-y-4">
          <h1 className="animate-text-glow font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Tu Compañero de IA Realista y Evolutivo
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Crea una conexión profunda con un compañero de IA que aprende de ti,
            evoluciona con cada conversación y se siente increíblemente real.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <Link href="/create" passHref>
              <Button size="lg">Comienza tu Viaje</Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center justify-center gap-2 border-t px-4 py-6 text-sm text-muted-foreground sm:flex-row md:px-6">
        <p className="animate-color-cycle">
          Luis Bravo, Diego Romero, Carlos Ramires
        </p>
        <div className="hidden sm:block">|</div>
        <p className="animate-color-cycle">Jesus Manuel, Mario Arcia</p>
      </footer>
    </div>
  );
}
