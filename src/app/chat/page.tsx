'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanion } from '@/hooks/use-companion';
import ChatLayout from '@/components/chat/chat-layout';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages';
import ChatInput from '@/components/chat/chat-input';
import { getAIResponseAction, reactToUserBehaviorAction, updatePersonalityAction } from '@/lib/actions';
import { Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatPage() {
  const router = useRouter();
  const { companion, messages, addMessage, updateCompanionDetails, isLoading: isCompanionLoading, removeMessages } = useCompanion();
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const { toast } = useToast();
  const [_, startTransition] = useTransition();

  useEffect(() => {
    if (!isCompanionLoading && !companion) {
      router.replace('/create');
    }
  }, [companion, isCompanionLoading, router]);

  const handleSendMessage = async (text: string) => {
    if (!companion || isTyping) return;
    setSelectedMessageIds([]);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };
    addMessage(userMessage);
    
    // --- New Immediate Reaction Logic (Synchronous) ---
    const currentCompanion = companion; // Capture current state
    const reactionResult = await reactToUserBehaviorAction(currentCompanion, userMessage.text);
    
    if (reactionResult.success && reactionResult.updates) {
      const newStatus = reactionResult.updates.relationshipStatus;
      if (newStatus && newStatus !== currentCompanion.relationshipStatus) {
        updateCompanionDetails({ relationshipStatus: newStatus });
        toast({
          title: '¡Relación Actualizada!',
          description: `Tu relación con ${currentCompanion.name} es ahora: ${newStatus}.`,
        });
      }
    } else if (reactionResult.error) {
      console.error("Error in behavior reaction:", reactionResult.error);
    }
    
    setIsTyping(true);

    // --- Main Response Generation ---
    const currentMessages = [...messages, userMessage];
    const userLocalTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const result = await getAIResponseAction(companion, currentMessages, userLocalTime);

    setIsTyping(false);

    if (result.response) {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: result.response,
        sender: 'ai',
        timestamp: Date.now(),
      };
      addMessage(aiMessage);

      // --- Background Personality Update ---
      startTransition(async () => {
        if (!companion) return; // Guard here as well
        const personalityResult = await updatePersonalityAction(companion, [...currentMessages, aiMessage]);
        if (personalityResult.success && personalityResult.updates) {
          updateCompanionDetails(personalityResult.updates);
        } else if (personalityResult.error) {
          console.error(personalityResult.error);
        }
      });

    } else if (result.error) {
      toast({ variant: 'destructive', title: 'Error de Respuesta', description: result.error });
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: result.error,
        sender: 'ai',
        timestamp: Date.now(),
      };
      addMessage(errorMessage);
    }
  };

  const handleDeleteMessages = () => {
    if (selectedMessageIds.length > 0) {
      removeMessages(selectedMessageIds);
      setSelectedMessageIds([]);
      toast({
        title: `Mensaje${selectedMessageIds.length > 1 ? 's' : ''} Eliminado${selectedMessageIds.length > 1 ? 's' : ''}`,
        description: `Se ha${selectedMessageIds.length > 1 ? 'n' : ''} eliminado ${selectedMessageIds.length} mensaje${selectedMessageIds.length > 1 ? 's' : ''} de la conversación.`,
      });
    }
  };

  const handleMessageSelect = (messageId: string) => {
    setSelectedMessageIds(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };


  if (isCompanionLoading || !companion) {
    return (
      <div className="flex h-screen w-full flex-col">
        <div className="flex items-center gap-4 border-b p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-16 w-3/4 rounded-lg" />
          <Skeleton className="h-16 w-3/4 rounded-lg self-end ml-auto" />
          <Skeleton className="h-24 w-4/5 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <ChatLayout>
      <ChatHeader
        selectedMessageIds={selectedMessageIds}
        onClearSelection={() => setSelectedMessageIds([])}
        onDeleteMessages={handleDeleteMessages}
      />
      <ChatMessages
        messages={messages}
        isTyping={isTyping}
        selectedMessageIds={selectedMessageIds}
        onMessageSelect={handleMessageSelect}
      />
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </ChatLayout>
  );
}
