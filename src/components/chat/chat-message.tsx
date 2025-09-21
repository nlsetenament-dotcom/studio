import { Companion, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
  companion: Companion;
  isSelected: boolean;
  onSelect: (messageId: string) => void;
}

export default function ChatMessage({ message, companion, isSelected, onSelect }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  const formattedTime = format(new Date(message.timestamp), 'HH:mm');

  return (
    <div
      className={cn(
        'group flex items-end gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
      onClick={() => onSelect(message.id)}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={companion.avatarUrl} alt={companion.name} />
          <AvatarFallback>{companion.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'max-w-xs rounded-lg px-4 py-3 md:max-w-md cursor-pointer transition-colors duration-200',
            'animate-in fade-in-25 slide-in-from-bottom-4',
            isUser
              ? 'rounded-br-none bg-accent text-accent-foreground'
              : 'rounded-bl-none bg-card text-card-foreground',
            isSelected
              ? 'bg-primary/20'
              : isUser ? 'hover:bg-accent/80' : 'hover:bg-card/90'
          )}
        >
          <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
        </div>
        <span className="mt-1.5 text-xs text-muted-foreground transition-opacity duration-300 opacity-0 group-hover:opacity-100 px-1">
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
