'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [text]);

  const handleSubmit = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <footer className="shrink-0 border-t border-border/50 bg-background/80 backdrop-blur-sm p-3 pb-safe">
      <div className={cn(
        'flex items-end gap-2 rounded-2xl border border-border/60 bg-card/60 px-4 py-2 shadow-sm',
        'transition-all duration-200 focus-within:border-primary/40 focus-within:shadow-md focus-within:bg-card/80'
      )}>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Escribe algo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            'flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/50',
            'leading-relaxed py-1 max-h-[120px] scrollbar-none',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <Button
          onClick={handleSubmit}
          size="icon"
          disabled={disabled || !text.trim()}
          className="h-8 w-8 shrink-0 rounded-xl shadow-sm"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
      <p className="mt-1.5 text-center text-[10px] text-muted-foreground/40">
        Enter para enviar · Shift+Enter para nueva línea
      </p>
    </footer>
  );
}
