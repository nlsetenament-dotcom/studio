'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Companion, Difficulty } from '@/lib/types';
import { MoreVertical, BrainCircuit } from 'lucide-react';

interface ChatHeaderProps {
  companion: Companion;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export default function ChatHeader({ companion, onDifficultyChange }: ChatHeaderProps) {
  return (
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
            <span className="sr-only">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDifficultyChange('Easy')} disabled={companion.difficulty === 'Easy'}>
            Easy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDifficultyChange('Hard')} disabled={companion.difficulty === 'Hard'}>
            Hard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDifficultyChange('Expert')} disabled={companion.difficulty === 'Expert'}>
            Expert
          </DropdownMenuItem>
           <DropdownMenuItem onClick={() => onDifficultyChange('Ultra Hard')} disabled={companion.difficulty === 'Ultra Hard'}>
            Ultra Hard
          </DropdownMenuItem>
          <DropdownMenuSeparator />
           <DropdownMenuItem disabled>
              <BrainCircuit className="mr-2 h-4 w-4" />
              <span>{companion.difficulty}</span>
           </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
