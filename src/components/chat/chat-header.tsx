'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Companion, Difficulty } from '@/lib/types';
import { MoreVertical, BrainCircuit, Settings } from 'lucide-react';
import SettingsPanel from './settings-panel';
import { useState } from 'react';

interface ChatHeaderProps {
  companion: Companion;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onAvatarChange: (newAvatarUrl: string) => void;
}

export default function ChatHeader({ companion, onDifficultyChange, onAvatarChange }: ChatHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
    <header className="flex shrink-0 items-center gap-4 border-b p-4">
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
          <DropdownMenuLabel>Dificultad</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDifficultyChange('Easy')} disabled={companion.difficulty === 'Easy'}>
            Fácil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDifficultyChange('Hard')} disabled={companion.difficulty === 'Hard'}>
            Difícil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDifficultyChange('Expert')} disabled={companion.difficulty === 'Expert'}>
            Experto
          </DropdownMenuItem>
           <DropdownMenuItem onClick={() => onDifficultyChange('Ultra Hard')} disabled={companion.difficulty === 'Ultra Hard'}>
            Ultra Difícil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
           <DropdownMenuItem disabled>
              <BrainCircuit className="mr-2 h-4 w-4" />
              <span>{companion.difficulty}</span>
           </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
     <SettingsPanel
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        companion={companion}
        onAvatarChange={onAvatarChange}
      />
    </>
  );
}
