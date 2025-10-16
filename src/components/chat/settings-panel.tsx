
'use client';

import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Companion, relationshipLevels, appThemes, AppTheme } from '@/lib/types';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BookUser, BrainCircuit, ImageIcon, MapPin, Palette, ShieldQuestion, Upload, RotateCcw, Heart, CheckCircle2, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { useCompanion } from '@/hooks/use-companion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAvatarChange: (newAvatarUrl: string) => void;
  onDifficultyChange: (difficulty: Companion['difficulty']) => void;
}

const difficultyLevels: { id: Companion['difficulty']; label: string; description: string }[] = [
    { id: 'Easy', label: 'Fácil', description: 'Progresión rápida (70% - 90% prob. de éxito).' },
    { id: 'Hard', label: 'Normal', description: 'Progresión estándar (40% - 60% prob. de éxito).' },
    { id: 'Expert', label: 'Difícil', description: 'Progreso lento y requiere esfuerzo (5% - 15% prob. de éxito).' },
];

export default function SettingsPanel({ 
    isOpen, 
    onOpenChange, 
    onAvatarChange,
    onDifficultyChange 
}: SettingsPanelProps) {
  const { companion, updateCompanionDetails, appearance, setAppearance } = useCompanion();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Companion['difficulty']>('Hard');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<AppTheme>('sunset-orange');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const originalAvatar = PlaceHolderImages.find(img => img.id === 'companion-avatar')?.imageUrl || 'https://picsum.photos/seed/companion/200/200';

  useEffect(() => {
    if (isOpen && companion) {
        setSelectedDifficulty(companion.difficulty);
        setSelectedAvatar(companion.avatarUrl);
        setSelectedTheme(companion.theme || 'sunset-orange');
    }
  }, [companion, isOpen]);

  useEffect(() => {
    setIsDarkMode(appearance === 'dark');
  }, [appearance]);

  const handleDarkModeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
    setAppearance(isDark ? 'dark' : 'light');
  };

  const handleSave = () => {
    if (!companion) return;
    let hasChanges = false;
    
    if (selectedDifficulty !== companion.difficulty) {
        onDifficultyChange(selectedDifficulty);
        hasChanges = true;
    }
    if (selectedAvatar !== companion.avatarUrl) {
        onAvatarChange(selectedAvatar);
        hasChanges = true;
    }
    if (selectedTheme !== companion.theme) {
        updateCompanionDetails({ theme: selectedTheme });
        hasChanges = true;
    }

    if (hasChanges) {
       toast({
         title: 'Ajustes Guardados',
         description: 'Tus cambios han sido aplicados.',
       });
    }

    onOpenChange(false);
  };
  
  const handleCancel = () => {
    // Restore visual state without saving
    if (companion?.theme) {
        updateCompanionDetails({ theme: companion.theme }, true); // isVolatile = true
    }
    const storedAppearance = localStorage.getItem('altered-self-appearance') as 'dark' | 'light' | null;
    if (storedAppearance) {
        setAppearance(storedAppearance);
    }
    onOpenChange(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
            variant: 'destructive',
            title: 'Archivo Demasiado Grande',
            description: 'Por favor, selecciona una imagen de menos de 10MB.',
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
      if (!oncha) handleCancel();
      else onOpenChange(true);
    }}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="p-6">
          <SheetTitle className="font-headline text-2xl">Panel de Ajustes</SheetTitle>
          <SheetDescription>Personaliza la apariencia, el tema y otros aspectos de tu experiencia.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 px-6">
            <div className="space-y-8 pb-8">
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
                    <div className="rounded-lg border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="dark-mode">Modo Oscuro</Label>
                                <p className="text-sm text-muted-foreground">Disfruta de una interfaz más oscura.</p>
                            </div>
                            <Switch 
                              id="dark-mode" 
                              checked={isDarkMode} 
                              onCheckedChange={handleDarkModeToggle}
                            />
                        </div>
                        <div>
                          <Label htmlFor="app-theme">Tema de Color</Label>
                           <Select value={selectedTheme} onValueChange={(value: AppTheme) => {
                               setSelectedTheme(value);
                               if (companion) updateCompanionDetails({ theme: value }, true);
                           }}>
                              <SelectTrigger id="app-theme">
                                <SelectValue placeholder="Selecciona un tema visual" />
                              </SelectTrigger>
                            <SelectContent>
                              {Object.entries(appThemes).map(([key, theme]) => (
                                <SelectItem key={key} value={key}>{theme.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground mt-2">Elige la paleta de colores principal de la app.</p>
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
                    <h3 className="mb-4 text-lg font-medium text-foreground flex items-center gap-2"><Heart className="h-5 w-5 text-primary" />Progresión de la Relación</h3>
                    <div className="space-y-2 rounded-lg border p-4">
                        <ul className="space-y-3">
                            {relationshipLevels.map((level, index) => {
                                const currentIndex = relationshipLevels.indexOf(companion.relationshipStatus);
                                const isAchieved = index <= currentIndex;
                                return (
                                    <li key={level} className={cn(
                                        "flex items-center gap-3 text-sm",
                                        isAchieved ? "text-foreground font-medium" : "text-muted-foreground/70"
                                    )}>
                                        <CheckCircle2 className={cn(
                                            "h-5 w-5 shrink-0",
                                            isAchieved ? "text-green-500" : "text-muted-foreground/30"
                                        )} />
                                        <span>{level}</span>
                                    </li>
                                );
                            })}
                        </ul>
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
                 <div>
                    <h3 className="mb-4 text-lg font-medium text-foreground flex items-center gap-2"><Code className="h-5 w-5 text-primary" />Créditos</h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                        Versión de la Aplicación: 1
                    </p>
                    <div className="rounded-lg border p-4 text-center">
                        <h4 className="text-4xl font-bold tracking-tighter text-foreground/80 animate-text-glow" style={{ fontFamily: 'serif' }}>
                            NLS
                        </h4>
                        <p className="mt-1 text-xs font-light tracking-[0.3em] text-foreground/60 animate-pulse-subtle">
                            ENTERTAINMENT
                        </p>
                        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                            <p className="animate-color-cycle">Luis Bravo, Diego Romero, Carlos Ramires</p>
                            <p className="animate-color-cycle">Jesus Manuel, Mario Arcia</p>
                        </div>
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
