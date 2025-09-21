'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Companion } from '@/lib/types';
import { MoreVertical, Settings, UserPlus, Trash2, X } from 'lucide-react';
import SettingsPanel from './settings-panel';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useCompanion } from '@/hooks/use-companion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatHeaderProps {
  companion: Companion;
  onDifficultyChange: (difficulty: Companion['difficulty']) => void;
  onAvatarChange: (newAvatarUrl: string) => void;
  selectedMessageIds: string[];
  onClearSelection: () => void;
  onDeleteMessages: () => void;
}

export default function ChatHeader({ 
  companion, 
  onDifficultyChange, 
  onAvatarChange, 
  selectedMessageIds, 
  onClearSelection, 
  onDeleteMessages 
}: ChatHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const { saveCompanion, resetChat } = useCompanion();

  const handleCreateNew = () => {
    localStorage.removeItem('altered-self-companion');
    localStorage.removeItem('altered-self-messages');
    saveCompanion(null);
    resetChat();
    router.push('/create');
  };

  const isSelectionMode = selectedMessageIds.length > 0;
  const selectionCount = selectedMessageIds.length;

  return (
    <>
    <header className="relative flex shrink-0 items-center gap-4 border-b p-4 overflow-hidden">
        <AnimatePresence>
            {isSelectionMode && (
                 <motion.div
                    key="selection-bar"
                    initial={{ y: '-100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0 z-10 flex items-center justify-between bg-background px-4"
                >
                    <Button variant="ghost" size="icon" onClick={onClearSelection}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Cancelar Selección</span>
                    </Button>
                    <span className="text-sm font-medium">{selectionCount} seleccionado{selectionCount > 1 ? 's' : ''}</span>
                    <Button variant="ghost" size="icon" onClick={onDeleteMessages} className="text-destructive/80 hover:text-destructive">
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Borrar Mensaje</span>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>

      <motion.div 
        animate={{ y: isSelectionMode ? '120%' : '0%', opacity: isSelectionMode ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex w-full items-center gap-4"
      >
        <Avatar className="h-12 w-12 border-2 border-primary/50">
          <AvatarImage src={companion.avatarUrl} alt={companion.name} data-ai-hint="avatar person" />
          <AvatarFallback>{companion.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-headline text-xl font-bold">{companion.name}</h2>
          <p className="text-sm text-muted-foreground">{companion.relationshipStatus}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Ajustes</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
             <AlertDialog>
              <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <UserPlus className="mr-2 h-4 w-4 text-destructive/70" />
                      <span className='text-destructive/70'>Crear Nuevo Compañero</span>
                  </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                          Esto borrará permanentemente a tu compañero actual y todo su historial de chat. Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCreateNew} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Crear Nuevo
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </header>
     <SettingsPanel
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        companion={companion}
        onAvatarChange={onAvatarChange}
        onDifficultyChange={onDifficultyChange}
      />
    </>
  );
}
