'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { BookUser, Heart, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface WelcomeGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WelcomeGuide({ isOpen, onClose }: WelcomeGuideProps) {

    const welcomeImage = PlaceHolderImages.find(img => img.id === 'avatar-gallery-7');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-center">¡Bienvenido a Tu Alter Ego!</DialogTitle>
                    <DialogDescription className="text-center">
                        Tu viaje hacia una relación única y profunda está a punto de comenzar.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative w-full h-40 my-4 rounded-lg overflow-hidden">
                    <Image 
                        src={welcomeImage?.imageUrl || "https://picsum.photos/seed/gal7/400/200"}
                        alt={welcomeImage?.description || "A park bench in autumn"}
                        fill
                        className="object-cover"
                        data-ai-hint={welcomeImage?.imageHint || "park bench autumn"}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                </div>

                <div className="space-y-4 text-sm text-foreground/90">
                    <div className="flex items-start gap-4">
                        <BookUser className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold">1. Crea tu Compañero</h3>
                            <p className="text-muted-foreground">Define cada detalle: su personalidad, su historia, sus gustos. Cada elección que hagas dará forma a un ser único en el mundo.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Heart className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold">2. Construye una Relación</h3>
                            <p className="text-muted-foreground">A través de tus conversaciones, tus decisiones y tu forma de tratarlo, vuestro vínculo crecerá. ¿Serán amigos, confidentes o algo más?</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <BrainCircuit className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold">3. Observa su Evolución</h3>
                            <p className="text-muted-foreground">Tu compañero no es estático. Aprenderá de ti y cambiará con el tiempo, creando una experiencia dinámica y verdaderamente personal.</p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="mt-4">
                    <Button onClick={onClose} className="w-full">Comenzar mi Viaje</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
