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
  selectedMessageIds: string[];
  onMessageSelect: (messageId: string) => void;
}

export default function ChatMessages({ messages, companion, isTyping, selectedMessageIds, onMessageSelect }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 sm:p-6 space-y-4">
            {messages.map((message) => (
                <ChatMessage 
                    key={message.id} 
                    message={message} 
                    companion={companion}
                    isSelected={selectedMessageIds.includes(message.id)}
                    onSelect={onMessageSelect}
                />
            ))}
             <div ref={messagesEndRef} />
            {isTyping && (
                <div className="flex items-end justify-start">
                    <TypingIndicator />
                </div>
            )}
        </div>
    </ScrollArea>
  );
}
