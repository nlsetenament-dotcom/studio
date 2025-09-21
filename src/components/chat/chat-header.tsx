'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Companion } from '@/lib/types';
import { MoreVertical, Settings } from 'lucide-react';
import SettingsPanel from './settings-panel';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface ChatHeaderProps {
  companion: Companion;
  onDifficultyChange: (difficulty: Companion['difficulty']) => void;
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
        </DropdownMenuContent>
      </DropdownMenu>
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
