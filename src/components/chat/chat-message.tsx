'use client';

import { Companion, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'group flex items-end gap-2.5',
        isUser ? 'justify-end' : 'justify-start'
      )}
      onClick={() => onSelect(message.id)}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20 shadow-md">
          <AvatarImage src={companion.avatarUrl} alt={companion.name} />
          <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
            {companion.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'relative max-w-[72vw] md:max-w-sm lg:max-w-md px-4 py-2.5 text-sm leading-relaxed cursor-pointer select-none',
            'shadow-sm transition-all duration-200',
            isUser
              ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
              : 'bg-card text-card-foreground border border-border/60 rounded-2xl rounded-bl-md',
            isSelected && 'ring-2 ring-primary/50 scale-[0.98]'
          )}
        >
          <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.text}</p>
        </div>

        <div className={cn('flex items-center gap-1 px-1', isUser ? 'flex-row-reverse' : 'flex-row')}>
          <span className="text-[10px] text-muted-foreground/70">{formattedTime}</span>
          {isUser && (
            <Check className="h-3 w-3 text-primary/60" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
