'use client';

import { useState, useEffect, useCallback } from 'react';
import { Companion, Message, Difficulty } from '@/lib/types';

const COMPANION_KEY = 'altered-self-companion';
const MESSAGES_KEY = 'altered-self-messages';

export function useCompanion() {
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedCompanion = localStorage.getItem(COMPANION_KEY);
      const storedMessages = localStorage.getItem(MESSAGES_KEY);

      if (storedCompanion) {
        setCompanion(JSON.parse(storedCompanion));
      }
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Failed to load from localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveCompanion = useCallback((newCompanion: Companion | null) => {
    setCompanion(newCompanion);
    try {
        if (newCompanion) {
            localStorage.setItem(COMPANION_KEY, JSON.stringify(newCompanion));
        } else {
            localStorage.removeItem(COMPANION_KEY);
        }
    } catch (error) {
      console.error('Failed to save companion to localStorage', error);
    }
  }, []);

  const saveMessages = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save messages to localStorage', error);
    }
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, message];
        try {
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
        } catch (error) {
            console.error('Failed to save messages to localStorage', error);
        }
        return updatedMessages;
    });
  }, []);
  
  const removeMessage = useCallback((messageId: string) => {
    setMessages(prevMessages => {
        const updatedMessages = prevMessages.filter(msg => msg.id !== messageId);
        try {
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
        } catch (error) {
            console.error('Failed to save messages to localStorage', error);
        }
        return updatedMessages;
    });
  }, []);

  const updateCompanionDetails = useCallback((updates: Partial<Companion>) => {
    if (companion) {
      const updatedCompanion = { ...companion, ...updates };
      saveCompanion(updatedCompanion);
    }
  }, [companion, saveCompanion]);
  
  const resetChat = useCallback(() => {
      saveMessages([]);
      if(companion){
          updateCompanionDetails({relationshipStatus: 'Conocido'});
      }
  }, [saveMessages, companion, updateCompanionDetails]);

  return {
    companion,
    messages,
    isLoading,
    saveCompanion,
    addMessage,
    removeMessage,
    updateCompanionDetails,
    resetChat,
  };
}
