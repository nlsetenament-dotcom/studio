
'use client';

import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Companion } from '@/lib/types';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BookUser, BrainCircuit, ImageIcon, MapPin, Palette, ShieldQuestion, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { useCompanion } from '@/hooks/use-companion';

interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAvatarChange: (newAvatarUrl: string) => void;
  onDifficultyChange: (difficulty: Companion['difficulty']) => void;
}

const difficultyLevels: { id: Companion['difficulty']; label: string; description: string }[] = [
    { id: 'Easy', label: 'Fácil', description: 'Progreso muy rápido (~70% prob.)' },
    { id: 'Hard', label: 'Normal', description: 'Progresión estándar (~40% prob.)' },
    { id: 'Expert', label: 'Difícil', description: 'Progreso lento y requiere esfuerzo (~15% prob.)' },
    { id: 'Ultra Hard', label: 'Experto', description: 'Casi imposible de progresar (~2% prob.)' },
];

export default function SettingsPanel({ 
    isOpen, 
    onOpenChange, 
    onAvatarChange,
    onDifficultyChange 
}: SettingsPanelProps) {
  const { companion } = useCompanion();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Companion['difficulty']>('Hard');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const originalAvatar = PlaceHolderImages.find(img => img.id === 'companion-avatar')?.imageUrl || 'https://picsum.photos/seed/companion/200/200';

  useEffect(() => {
    // Sincronizar el estado del panel cuando el compañero cambie o el panel se abra
    if (companion) {
        setSelectedDifficulty(companion.difficulty);
        setSelectedAvatar(companion.avatarUrl);
    }
  }, [companion, isOpen]);

  useEffect(() => {
    // Cargar la preferencia de tema del localStorage al montar el componente
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        const darkMode = storedTheme === 'dark';
        setIsDarkMode(darkMode);
        document.documentElement.classList.toggle('dark', darkMode);
    } else {
        // Si no hay nada guardado, usar la preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
        document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const handleThemeChange = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
    // Guardar la preferencia en localStorage y actualizar la clase en el HTML
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode);
  };

  const handleSave = () => {
    if (!companion) return;
    if (selectedDifficulty !== companion.difficulty) {
        onDifficultyChange(selectedDifficulty);
    }
    if (selectedAvatar !== companion.avatarUrl) {
        onAvatarChange(selectedAvatar);
    }
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    if (companion) {
        // Resetear a los valores actuales del compañero, no a los guardados en el estado del panel
        setSelectedDifficulty(companion.difficulty);
        setSelectedAvatar(companion.avatarUrl);
    }
    onOpenChange(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
            variant: 'destructive',
            title: 'Archivo Demasiado Grande',
            description: 'Por favor, selecciona una imagen de menos de 2MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setSelectedAvatar(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetAvatar = () => {
    setSelectedAvatar(originalAvatar);
    toast({
        title: 'Avatar Restaurado',
        description: 'Se ha restaurado la imagen de perfil original.',
    });
  };

  const avatarGallery = PlaceHolderImages.filter(img => img.id !== 'companion-avatar');

  if (!companion) {
      return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={oncha => {
      if (!oncha) handleCancel(); // Reset changes if closing without saving
      else onOpenChange(true);
    }}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="p-6">
          <SheetTitle className="font-headline text-2xl">Panel de Ajustes</SheetTitle>
          <SheetDescription>Personaliza la apariencia, el tema y otros aspectos de tu experiencia.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 px-6">
            <div className="space-y-8">
                 <div>
                    <h3 className="mb-4 text-lg font-medium text-foreground flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary" />Galería de Avatares</h3>
                     <div className="rounded-lg border p-4">
                        <div className="grid grid-cols-4 gap-4">
                             <input 
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif"
                             />
                             <button
                                className={cn(
                                    'relative flex aspect-square flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-muted-foreground/50 bg-muted/25 text-muted-foreground transition-colors',
                                    'hover:bg-muted/50 hover:border-muted-foreground',
                                    'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                )}
                                onClick={handleUploadClick}
                                title="Subir Imagen"
                            >
                                <Upload className="h-6 w-6" />
                                <span className="text-xs">Subir</span>
                             </button>
                             <button
                                className={cn(
                                    'relative flex aspect-square flex-col items-center justify-center gap-1 rounded-md border-2 border-muted-foreground/50 bg-muted/25 text-muted-foreground transition-colors',
                                    'hover:bg-muted/50 hover:border-muted-foreground',
                                    'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                )}
                                onClick={handleResetAvatar}
                                title="Restaurar Original"
                            >
                                <RotateCcw className="h-6 w-6" />
                                <span className="text-xs">Restaurar</span>
                             </button>
                            {avatarGallery.slice(0, 10).map(image => (
                                <button
                                    key={image.id}
                                    className={cn(
                                        'relative aspect-square overflow-hidden rounded-md transition-all duration-200',
                                        'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                        selectedAvatar === image.imageUrl && 'ring-2 ring-primary ring-offset-2'
                                    )}
                                    onClick={() => setSelectedAvatar(image.imageUrl)}
                                    title={image.description}
                                >
                                    <Image 
                                        src={image.imageUrl} 
                                        alt={image.description} 
                                        fill
                                        className="object-cover"
                                        data-ai-hint={image.imageHint}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="mb-4 text-lg font-medium text-foreground flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Apariencia</h3>
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="dark-mode">Modo Oscuro</Label>
                                <p className="text-sm text-muted-foreground">Disfruta de una interfaz más oscura.</p>
                            </div>
                            <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={handleThemeChange} />
                        </div>
                    </div>
                </div>
                 <div>
                    <h3 className="mb-4 text-lg font-medium text-foreground flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" />Detalles del Compañer@</h3>
                    <div className="space-y-4 rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                            <BookUser className="h-5 w-5 shrink-0 text-muted-foreground" />
                            <div className="flex w-full items-center justify-between">
                                <span className="font-medium">Estado de la Relación</span>
                                <Badge variant="secondary">{companion.relationshipStatus}</Badge>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                            <div className="flex w-full items-center justify-between">
                                <span className="font-medium">Residencia</span>
                                <Badge variant="secondary">{companion.residence}</Badge>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <BrainCircuit className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                            <div>
                                <span className="font-medium">Personalidad</span>
                                <p className="text-sm text-muted-foreground">{companion.personality}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="mb-4 text-lg font-medium text-foreground flex items-center gap-2"><ShieldQuestion className="h-5 w-5 text-primary" />Jugabilidad</h3>
                    <div className="rounded-lg border p-4">
                         <Label className="mb-2 block">Dificultad de Relación</Label>
                         <RadioGroup value={selectedDifficulty} onValueChange={(value: Companion['difficulty']) => setSelectedDifficulty(value)}>
                            <div className="space-y-4">
                            {difficultyLevels.map(level => (
                                <div key={level.id} className="flex items-start gap-3">
                                    <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                                    <div className='grid gap-0.5'>
                                        <Label htmlFor={level.id} className="font-normal">{level.label}</Label>
                                        <p className="text-xs text-muted-foreground">{level.description}</p>
                                    </div>
                                </div>
                            ))}
                            </div>
                         </RadioGroup>
                         <p className="mt-4 text-xs text-center text-muted-foreground">Al cambiar la dificultad se reiniciará la conversación y la relación.</p>
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
