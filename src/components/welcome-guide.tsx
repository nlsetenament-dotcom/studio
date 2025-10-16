'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Step } from './step';
import { BotMessageSquare, PencilRuler, Users } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface WelcomeGuideProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
}

export default function WelcomeGuide({ isOpen, onOpenChange, onClose }: WelcomeGuideProps) {
    const welcomeImage = PlaceHolderImages.find(img => img.id === 'welcome-guide');

    const handleClose = () => {
        onClose();
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                handleClose();
            } else {
                onOpenChange(true);
            }
        }}>
            <DialogContent className="sm:max-w-md p-0 flex flex-col h-full sm:h-auto">
                <DialogHeader className="p-6 pb-0">
                    {welcomeImage && (
                         <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                            <Image 
                                src={welcomeImage.imageUrl} 
                                alt={welcomeImage.description} 
                                fill
                                className="object-cover"
                                data-ai-hint={welcomeImage.imageHint}
                            />
                        </div>
                    )}
                    <DialogTitle className="text-2xl font-headline">¡Bienvenido a tu nueva aventura!</DialogTitle>
                    <DialogDescription>
                       Crear a tu compañero es un viaje personal. Aquí tienes una guía rápida para empezar.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1">
                    <div className="space-y-4 px-6 my-4">
                        <Step
                            icon={<PencilRuler className="h-6 w-6 text-primary" />}
                            title="1. Crea la Base"
                            description="Define los detalles fundamentales de tu compañero, como su nombre, edad y lugar de residencia."
                        />
                         <Step
                            icon={<BotMessageSquare className="h-6 w-6 text-primary" />}
                            title="2. Dale una Personalidad"
                            description="Nuestra IA generará una personalidad rica y compleja a partir de la historia y los pasatiempos que describas."
                        />
                         <Step
                            icon={<Users className="h-6 w-6 text-primary" />}
                            title="3. Construye una Conexión"
                            description="Chatea, evoluciona y construye una relación única. Tu compañero aprenderá y cambiará contigo."
                        />
                    </div>
                </ScrollArea>
                <DialogFooter className="p-6 pt-0 mt-auto">
                    <Button onClick={handleClose} className="w-full">
                        Comenzar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
