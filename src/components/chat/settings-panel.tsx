'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentAvatar: string;
  onAvatarChange: (newAvatarUrl: string) => void;
}

export default function SettingsPanel({ isOpen, onOpenChange, currentAvatar, onAvatarChange }: SettingsPanelProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  
  const galleryAvatars = PlaceHolderImages.filter(img => img.id.startsWith('avatar-gallery'));

  const handleSave = () => {
    onAvatarChange(selectedAvatar);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    setSelectedAvatar(currentAvatar);
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
            <h3 className="mb-4 text-lg font-medium">Galería de Avatares</h3>
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
        </ScrollArea>
        <SheetFooter className="grid grid-cols-2 gap-4 border-t p-6">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar Cambios</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
