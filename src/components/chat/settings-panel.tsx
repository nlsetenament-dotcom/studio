'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Upload, Heart, BarChart, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Companion } from '@/lib/types';
import { Separator } from '../ui/separator';

interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  companion: Companion;
  onAvatarChange: (newAvatarUrl: string) => void;
}

export default function SettingsPanel({ isOpen, onOpenChange, companion, onAvatarChange }: SettingsPanelProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(companion.avatarUrl);
  
  const galleryAvatars = PlaceHolderImages.filter(img => img.id.startsWith('avatar-gallery'));

  const handleSave = () => {
    onAvatarChange(selectedAvatar);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    setSelectedAvatar(companion.avatarUrl);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="p-6">
          <SheetTitle className="font-headline text-2xl">Panel de Ajustes</SheetTitle>
          <SheetDescription>Personaliza la apariencia, el tema y otros aspectos de tu experiencia.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 px-6">
            <div className="space-y-6">
                 <div>
                    <h3 className="mb-4 text-lg font-medium text-foreground">Detalles del Compañer@</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Heart className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <p className="font-semibold">Estado de la Relación</p>
                                <p className="text-sm text-muted-foreground">{companion.relationshipStatus}</p>
                            </div>
                        </div>
                        <Separator />
                         <div className="flex items-start gap-3">
                            <BarChart className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <p className="font-semibold">Dificultad Actual</p>
                                <p className="text-sm text-muted-foreground">{companion.difficulty}</p>
                            </div>
                        </div>
                        <Separator />
                         <div className="flex items-start gap-3">
                            <Bot className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <p className="font-semibold">Personalidad</p>
                                <p className="text-sm text-muted-foreground line-clamp-3">{companion.personality}</p>
                            </div>
                        </div>
                    </div>
                 </div>


                <div>
                    <h3 className="mb-4 text-lg font-medium text-foreground">Galería de Avatares</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            type="button"
                            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                            <Upload className="h-8 w-8" />
                            <span className="text-xs">Subir Imagen</span>
                        </button>
                        {galleryAvatars.map((avatar) => (
                            <button
                                key={avatar.id}
                                type="button"
                                onClick={() => setSelectedAvatar(avatar.imageUrl)}
                                className={cn(
                                    'relative aspect-square w-full overflow-hidden rounded-lg transition-all',
                                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
                                    selectedAvatar === avatar.imageUrl && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                )}
                            >
                                <Image
                                    src={avatar.imageUrl}
                                    alt={avatar.description}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={avatar.imageHint}
                                />
                                {selectedAvatar === avatar.imageUrl && (
                                    <div className="absolute inset-0 bg-black/40" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </ScrollArea>
        <SheetFooter className="grid grid-cols-2 gap-4 border-t p-6">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar Cambios</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
