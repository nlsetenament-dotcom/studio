'use client';

import { useEffect, useRef } from 'react';
import { Companion, Message } from '@/lib/types';
import ChatMessage from './chat-message';
import TypingIndicator from './typing-indicator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessagesProps {
  messages: Message[];
  companion: Companion;
  isTyping: boolean;
}

export default function ChatMessages({ messages, companion, isTyping }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isTyping]);
  
  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 sm:p-6 space-y-4">
            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} companion={companion} />
            ))}
            {isTyping && (
                <div className="flex items-end justify-start">
                    <TypingIndicator />
                </div>
            )}
        </div>
    </ScrollArea>
  );
}
