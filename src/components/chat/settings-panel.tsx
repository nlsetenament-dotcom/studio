'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Companion } from '@/lib/types';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  companion: Companion;
  onAvatarChange: (newAvatarUrl: string) => void;
  onDifficultyChange: (difficulty: Companion['difficulty']) => void;
}

const difficultyLevels: { id: Companion['difficulty']; label: string; description: string }[] = [
    { id: 'Easy', label: 'Fácil', description: 'Progreso muy rápido (~70-90% prob.)' },
    { id: 'Hard', label: 'Normal', description: 'Progresión estándar (~40-60% prob.)' },
    { id: 'Expert', label: 'Difícil', description: 'Requiere esfuerzo (~20-35% prob.)' },
    { id: 'Ultra Hard', label: 'Experto', description: 'Paciencia es clave (~10-15% prob.)' },
];

export default function SettingsPanel({ 
    isOpen, 
    onOpenChange, 
    companion, 
    onDifficultyChange 
}: SettingsPanelProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Companion['difficulty']>(companion.difficulty);

  useEffect(() => {
    // Sync with system/browser theme
    const darkModeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMatcher.matches);
    const
 
handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMatcher.addEventListener('change', handleChange);
    return () => darkModeMatcher.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSave = () => {
    if (selectedDifficulty !== companion.difficulty) {
        onDifficultyChange(selectedDifficulty);
    }
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    setSelectedDifficulty(companion.difficulty);
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
            <div className="space-y-8">
                <div>
                    <h3 className="mb-4 text-lg font-medium text-foreground">General</h3>
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="dark-mode">Modo Oscuro</Label>
                                <p className="text-sm text-muted-foreground">Disfruta de una interfaz más oscura.</p>
                            </div>
                            <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-lg font-medium text-foreground">Jugabilidad</h3>
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
                             <div className="flex items-start gap-3">
                                <RadioGroupItem value={'Ultra Hard'} id={'Ultra Hard'} className="mt-1" />
                                <div className='grid gap-0.5'>
                                    <Label htmlFor={'Ultra Hard'} className="font-normal">Ultra Difícil</Label>
                                    <p className="text-xs text-muted-foreground">Casi imposible (~1-5% prob.)</p>
                                </div>
                            </div>
                            </div>
                         </RadioGroup>
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
